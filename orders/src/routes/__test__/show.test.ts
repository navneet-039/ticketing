import request from 'supertest';
import { app } from '../../app';

import getCookie from '../../test/auth-helper';

import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('fetches the order', async () => {
  const cookie = getCookie();
  const ticket = Ticket.build({
     id:new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 23,
  });

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);
  expect(fetchedOrder.id).toEqual(order.id);
});
