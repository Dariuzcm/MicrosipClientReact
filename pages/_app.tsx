import type { AppProps } from 'next/app'
import { store } from '../store'
import { Provider, useDispatch } from 'react-redux'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SnackbarProvider } from 'notistack';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const state = store.getState();
  const token = state.users.currentUser.token;
  
  useEffect(()=> {
    if(!token) {
      router.push('/login');
    }
    else {
      router.push('/');
    }
  }, [token]);

  return (
    <Provider store={store}>
       <SnackbarProvider maxSnack={3} preventDuplicate>
          <Component {...pageProps} />
       </SnackbarProvider>
    </Provider>
  );
}

export default MyApp
