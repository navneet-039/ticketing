import request from 'supertest';
import { app } from '../../app';
import getCookie from '../../test/auth-helper';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
  const ticket = Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 39,
  });
  const cookie = getCookie();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
  const ticket = Ticket.build({
     id:new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 39,
  });
  const cookie = getCookie();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
