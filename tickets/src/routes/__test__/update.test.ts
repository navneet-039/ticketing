import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import getCookie from '../../test/auth-helper';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/tickets';

it('return a 404 if the provide id does not exist', async () => {
  const id = new mongoose.Types.ObjectId();
  const cookie = getCookie();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({
      title: 'cbjbc',
      price: 30,
    })
    .expect(404);
});

it('return a 401  if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId();
  const cookie = getCookie();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'cbjbc',
      price: 30,
    })
    .expect(401);
});

it('return a 401 if the user does not own the ticket', async () => {
  const cookie = getCookie();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'jccbjbd',
      price: 30,
    });
  const cookie1 = getCookie();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie1)
    .send({
      title: 'jcnkncbjbd',
      price: 40,
    })
    .expect(401);
});

it('return a 400 if the user provides an inavlid title or price', async () => {
  const cookie = getCookie();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'jccbjbd',
      price: 30,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'jncsjn',
      price: -10,
    })
    .expect(400);
});

it('updates the ticket provided vaalid input', async () => {
  const cookie = getCookie();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'jccbjbd',
      price: 30,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'jncsjn',
      price: 10,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tcikets/${response.body.id}`)
    .send();
  console.log(ticketResponse.body);
});

it('publishes an event ', async () => {
  const cookie = getCookie();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'jccbjbd',
      price: 30,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'jncsjn',
      price: 10,
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = getCookie();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'jccbjbd',
      price: 30,
    });
  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'jncsjn',
      price: 10,
    })
    .expect(400);
});
