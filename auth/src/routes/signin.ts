import express from 'express';
import { body } from 'express-validator';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';
const router = express.Router();
import { validateRequest,BadRequestError } from '@ticketsnav/common';

import { Password } from '../services/password';

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must enter a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.Compare(
      existingUser.password,
      password,
    );
    if (!passwordMatch) {
      throw new BadRequestError('Invalid Credentials');
    }
    const userJwt = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!,
    );
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  },
);

export { router as signinRouter };
