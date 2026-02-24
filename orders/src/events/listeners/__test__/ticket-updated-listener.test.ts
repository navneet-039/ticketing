import { TicketUpdatedEvent } from '@ticketsnav/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  //create an instance of listener
  const listner = new TicketUpdatedListener(natsWrapper.client);
  //create and save  atickst
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  //create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'Updated concert',
    version: ticket.version + 1,
    price: 24,
    userId: 'akmkmck',
  };

  //creates a fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listner, data, msg, ticket };
};

it('finds ,updates and saves a ticket', async () => {
  const { listner, data, msg, ticket } = await setup();
  await listner.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the  message', async () => {
  const { listner, data, msg } = await setup();
  await listner.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number ',async()=>{
  const {msg,data,listner,ticket}=await setup();
  data.version=10;
  try{
    await listner.onMessage(data,msg);
  }catch(err){

  }
  expect(msg.ack).not.toHaveBeenCalled();
  


})


