import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
  OrderStatus,
} from '@ticketsnav/common';

import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for cancelled order');
    }

  const paymentIntent=  await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: false,
      },
      payment_method_types: ['card'], 
    });

    const payment = Payment.build({
      orderId,
      stripeId: paymentIntent.id,
    });

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: order.id,
      stripeId: payment.stripeId,
    });

    res.status(201).send({
      clientSecret: paymentIntent.client_secret,
    });
  },
);

export { router as createPaymentRouter };
