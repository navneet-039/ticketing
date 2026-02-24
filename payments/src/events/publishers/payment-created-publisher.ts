import { Subjects,Publisher,PaymentCreatedEvent } from "@ticketsnav/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  subject:Subjects.PaymentCreated=Subjects.PaymentCreated;
}