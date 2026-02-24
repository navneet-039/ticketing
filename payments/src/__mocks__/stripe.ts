export const stripe = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({
      id: 'pi_test',
      client_secret: 'secret_test',
    }),
  },
};