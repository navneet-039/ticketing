import Router from 'next/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';

export default function SignOutPage() {
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });
  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <h1 className="text-xl font-semibold text-gray-700">
        Signing you out...
      </h1>
    </div>
  );
}
