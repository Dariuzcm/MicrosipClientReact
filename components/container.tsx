import Head from 'next/head';
import { ReactChild, ReactFragment, ReactPortal, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllArticles } from '../Models/Articles/ArticleSlice';
import { RootState } from '../store';
import ButtonAppBar from './toolbar';

const Container = (props: { children: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; name: string; }) => {
  const { name } = props;
  const dispatch = useDispatch();
  const state = useSelector((reduxState: RootState) => reduxState);
  const { articles } = state.articles;
  const users = state.users;
  
  useEffect(()=> {
    
    dispatch(getAllArticles());
    console.log(articles, users)
  }, [articles, users]);
  
  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      <ButtonAppBar/>
      {props.children}
    </div>
  );
}
export default Container;