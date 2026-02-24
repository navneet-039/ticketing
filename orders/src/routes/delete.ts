import express, { Request, Response } from 'express';
const router = express.Router();
import { Ticket } from '../models/ticket';
import { Order, OrderStatus } from '../models/order';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@ticketsnav/common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';
router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId != req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version:order.version,
      ticket: {
        id: order.ticket.id,
      
      },
    });
    res.status(204).send(order);
  },
);
export { router as deleteOrderRouter };
