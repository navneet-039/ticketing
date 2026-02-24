import express, { Request, Response } from 'express';
const router = express.Router();
import { Order } from '../models/order';
import { requireAuth } from '@ticketsnav/common';
router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.currentUser!.id }).populate(
    'ticket',
  );
  res.send(orders);
});
export { router as indexOrderRouter };
