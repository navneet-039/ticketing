import { TicketCreatedEvent } from '@ticketsnav/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
const setup = async () => {
  //create an instance of listener
  const listner = new TicketCreatedListener(natsWrapper.client);
  //create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    version: 0,
    price: 24,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //creates a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return {listner,data,msg};
};

it('creates and saves a tciket', async () => {
  const{listner,data,msg}=await setup();
  //call the onmessage function with data object+message object
  await listner.onMessage(data,msg);
  //write assertions to make sure a ticket was created
  const ticket=await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
});
it('acks the message', async () => {
  //call the onmessage function with data object+message object
  const {listner,data,msg}=await setup();
  await listner.onMessage(data,msg);
  //write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
