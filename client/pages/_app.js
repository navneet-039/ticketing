import Header from '../components/Header';
import buildClient from '../api/build-client';
import '../styles/globals.css';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);

  let pageProps = {};
  let currentUser = null;

  try {
    const { data } = await client.get('/api/users/currentuser');
    currentUser = data.currentUser || null;
  } catch (err) {
    currentUser = null;
  }

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      currentUser,
    );
  }

  return {
    pageProps,
    currentUser,
  };
};

export default AppComponent;
