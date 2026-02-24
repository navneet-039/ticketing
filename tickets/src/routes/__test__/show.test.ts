import request from 'supertest';
import { app } from '../../app';
import getCookie from '../../test/auth-helper';
import mongoose from 'mongoose';

it('return a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const cookie = getCookie();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'New Ticket',
      price: 30,
    })
    .expect(201);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send({})
    .expect(200);
});
