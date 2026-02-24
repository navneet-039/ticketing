import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import getCookie from '../../test/auth-helper';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();
  const cookie = getCookie();
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId })
    .expect(404);
});

it('return an error if ticket is already reserved', async () => {
  const cookie = getCookie();
  const ticket = Ticket.build({
     id:new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 30,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'cndjnjncd',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(400);
});
it('reserves a ticket', async () => {
  const cookie = getCookie();
  const ticket = Ticket.build({
     id:new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 30,
  });
  await ticket.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created', async () => {
  const cookie = getCookie();
  const ticket = Ticket.build({
     id:new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 30,
  });
  await ticket.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
