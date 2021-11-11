import type { NextPage } from 'next'
import Container from '../components/container'
import DataTable from '../components/dataTable'
import BasicSpeedDial from '../components/speedDial';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Home: NextPage = () => {
  
  const state = useSelector((reduxState: RootState) => reduxState);
  const token = state.users.currentUser.token;
  const router = useRouter();
 
  useEffect(() => {
    if(!token) router.push('/login');
    return () => {
    }
  }, [router, token]);
  
  
  return (
    <Container name='Home'>
      <DataTable />
      <BasicSpeedDial/>
    </Container>
  )
}

export default Home
