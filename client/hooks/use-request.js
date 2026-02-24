import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);

      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
          <h4 className="text-sm font-semibold text-red-800 mb-2">
            Something went wrong
          </h4>
          <ul className="space-y-1 text-sm text-red-700">
            {err.response?.data?.errors?.map((error) => (
              <li key={error.message}>• {error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};