import { Publisher, OrderCancelledEvent, Subjects } from '@ticketsnav/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
