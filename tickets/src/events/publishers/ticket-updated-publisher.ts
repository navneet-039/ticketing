import { Publisher, Subjects, TicketUpdatedEvent } from '@ticketsnav/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
