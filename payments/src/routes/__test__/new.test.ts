import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@ticketsnav/common';
import { stripe } from '../../stripe';
import getCookie from '../../test/auth-helper';

jest.mock('../../stripe');

it('returns 404 if order not found', async () => {
  const cookie = getCookie();
  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('creates payment intent and returns clientSecret', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = getCookie(userId);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Created,
    price: 50,
    version: 0,
  });

  await order.save();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      orderId: order.id,
    })
    .expect(201);

  expect(stripe.paymentIntents.create).toHaveBeenCalled();

  const options = (stripe.paymentIntents.create as jest.Mock).mock.calls[0][0];

  expect(options.amount).toEqual(50 * 100);
  expect(options.currency).toEqual('usd');

  expect(response.body.clientSecret).toBeDefined();
});
