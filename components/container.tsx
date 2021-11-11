import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { ReactChild, ReactFragment, ReactPortal, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotifer, getAllArticles, NorificationSnack } from '../Models/Articles/ArticleSlice';
import { RootState } from '../store';
import ModalCharge from './modalCharge';
import ButtonAppBar from './toolbar';

const Container = (props: { children: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; name: string; }) => {
  const { name } = props;
  const dispatch = useDispatch();
  const state = useSelector((reduxState: RootState) => reduxState);
  const { articles, notification } = state.articles;
  
  const notifqueue: NorificationSnack[] = notification;

  const token = state.users.currentUser.token;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleEnqueueNorification = (notif: NorificationSnack) => {
    const { variant, message } = notif;
    enqueueSnackbar(message, { variant});
  };

  useEffect(()=> {
    if(!token) {
      router.push('/login');
    }
    else {
      router.push('/');
    }
    const timeout = setTimeout(() => {
      dispatch(getAllArticles());
    }, 5000);
    
    const notifer = setTimeout(() => {
      for (const notif of notification) {
        handleEnqueueNorification(notif);
      }
      dispatch(clearNotifer());
    }, 1000);
    
    return () => {
      clearTimeout(timeout);
      clearTimeout(notifer);
    }
  }, [token, articles]);
  
  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <ButtonAppBar/>
      {props.children}
      <ModalCharge />
    </div>
  );
}
export default Container;