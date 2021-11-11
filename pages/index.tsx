import type { NextPage } from 'next'
import Container from '../components/container'
import DataTable from '../components/dataTable'
import BasicSpeedDial from '../components/speedDial';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { clearNotifer, NorificationSnack } from '../Models/Articles/ArticleSlice';
import { useSnackbar } from 'notistack';

const Home: NextPage = () => {
  
  const state = useSelector((reduxState: RootState) => reduxState);
  const token = state.users.currentUser.token;
  const { notification } = state.articles;
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleEnqueueNorification = (notif: NorificationSnack) => {
    const { variant, message } = notif;
    enqueueSnackbar(message, { variant});
  };
  
  useEffect(() => {
    if(!token) router.push('/login');
    if(notification.length > 0) {
      for (const notif of notification) {
        handleEnqueueNorification(notif);
      }
      dispatch(clearNotifer());
    }
    return () => {
    }
  }, [router, token, notification]);
  
  
  return (
    <Container name='Home'>
      <DataTable />
      <BasicSpeedDial/>
    </Container>
  )
}

export default Home
