import request from 'supertest';
import { app } from '../../app';
import getCookie from '../../test/auth-helper';

it('Can fetch a list of tickets', async () => {
  const cookie = getCookie();
  await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'hcbhc',
    price: 20,
  });
  await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'hcbhcjnc',
    price: 20,
  });
  const response = await request(app).get('/api/tickets').send().expect(200);
  expect(response.body.length).toEqual(2);
});
