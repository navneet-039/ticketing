const OrderIndex = ({ orders }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            <p className="text-gray-600">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex justify-between items-center"
              >
                {/* Ticket Info */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {order.ticket.title}
                  </h2>
                  <p className="text-indigo-600 font-bold mt-1">
                    ${order.ticket.price}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    order.status === 'complete'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get('/api/orders');
  return { orders: data };
};

export default OrderIndex;
