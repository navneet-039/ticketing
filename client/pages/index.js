import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Available Tickets
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Browse all listed tickets below.
          </p>
        </div>

        {/* Tickets Table */}
        <div className="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {ticket.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    ${ticket.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <Link
                      href="/tickets/[ticketId]"
                      as={`/tickets/${ticket.id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {tickets.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No tickets available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
