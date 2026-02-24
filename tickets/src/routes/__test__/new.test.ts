import request from 'supertest';
import getCookie from '../../test/auth-helper';
import { Ticket } from '../../models/tickets';
import { app } from '../../app';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});
it('can only be accessed if user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('return a status other than 401 if user is signed in', async () => {
  const cookie = getCookie();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'Test Ticket', price: 20 });
  expect(response.status).not.toEqual(401);
});

it('return an error if an invalid title is provided', async () => {
  const cookie = getCookie();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 10,
    })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      price: 10,
    })
    .expect(400);
});
it('return an error if an invalid price is provided', async () => {
  const cookie = getCookie();
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asndkj', price: -10 })
    .expect(400);
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ncknknc',
    })
    .expect(400);
});
it('Creates a ticket with valid inputs ', async () => {
  const cookie = getCookie();
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const title = 'hbcbc';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price: 20,
    })
    .expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});
it('publishes an event', async () => {
  const cookie = getCookie();
  const title = 'hbcbc';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price: 20,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
