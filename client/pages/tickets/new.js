import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: ()=>Router.push('/'),
  });
  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
    setPrice('');
    setTitle('');
  };

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Create New Ticket
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            Provide a title and set the ticket price.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ticket Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter ticket title"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                           transition"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-400">$</span>
                <input
                  value={price}
                  onBlur={onBlur}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-gray-300 pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                             transition"
                />
              </div>
            </div>

            {/* Submit */}
            {errors}
            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg 
                           bg-indigo-600 px-6 py-3 text-sm font-medium text-white
                           hover:bg-indigo-700 active:scale-[0.98]
                           transition"
              >
                Create Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTicket;
