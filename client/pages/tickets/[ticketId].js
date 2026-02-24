import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const TicketShow = ({ ticket }) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div className="flex justify-center mt-16 px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        {/* Ticket Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {ticket.title}
        </h1>

        {/* Price */}
        <div className="text-2xl font-semibold text-indigo-600 mb-6">
          ${ticket.price}
        </div>

        {/* Errors */}
        {errors && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {errors}
          </div>
        )}

        {/* Purchase Button */}
        <button
          onClick={doRequest}
          className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition duration-200"
        >
          Purchase Ticket
        </button>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;