import { Action, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../store";
import { setCurrentUser } from "../Users/UsersSlice";
import { Article } from "./Article";

export type NorificationSnack = {
  message: string,
  variant: 'success' | 'error' | 'warning' | 'info' | 'default'
}
export type ArticleSlice = {
  selectedArticles: Article[];
  articles: Article[];
  actionArticle: 'edit' | 'create' | false;
  status: 'busy' | 'none';
  mutatedArticle: Article | null;
  aprovedAction: boolean;
  iva: number;
  notification: NorificationSnack[]
}
const defaultState: ArticleSlice = {
  selectedArticles: [],
  articles: [],
  status: 'none',
  mutatedArticle: null,
  actionArticle: false,
  aprovedAction: false,
  notification: [],
  iva: 16.0,
};

const slice = createSlice({
  name: 'articles',
  initialState: defaultState,
  reducers: {
    setSelectedArticles: (state, action: PayloadAction<Article[]>) => {
      state.selectedArticles = action.payload;
    },
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
    setActionArticle: (state, action: PayloadAction<'edit' | 'create' | false>) => {
      state.actionArticle = action.payload;
    },
    setMutatedArticle: (state, action: PayloadAction<Article | null>) => {
      state.mutatedArticle = action.payload;
    },
    setAprovedAction: (state, action: PayloadAction<boolean>) => {
      state.aprovedAction = action.payload
    },
    clearNotifer: (state) => {
      state.notification = [];
    },
    enqueueNotification: (state, action: PayloadAction<NorificationSnack>) => {
      state.notification = [
        ...state.notification,
        action.payload
      ]
    },
    setStatus: (state, action: PayloadAction<'busy' | 'none'>) => {
      state.status = action.payload;
    },
  },
});

const articlesReducer = slice.reducer;

export const {
  setSelectedArticles,
  setArticles,
  setActionArticle,
  setMutatedArticle,
  setAprovedAction,
  clearNotifer,
  enqueueNotification,
} = slice.actions;

export default articlesReducer;

export const getAllArticles = (): ThunkAction<void, RootState, unknown, Action<unknown>> => {
  return async (dispatch, getState) => {
    const token = getState().users.currentUser?.token;
    if (!token) {
      return ;
    }
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      dispatch(slice.actions.setArticles(data));
    } catch (err: any) {
      const error = err.toJSON();
      dispatch(slice.actions.enqueueNotification({
        variant: 'error',
        message: error.message
      }))
      if (error.status === 401) {
        dispatch(setCurrentUser({
          user: null,
          token: null
        }))
      }
    }
  }
}

export const createArticle = (article: Article): ThunkAction<void, RootState, unknown, Action<unknown>> => {
  return async (dispatch, getState) => {
    const token = getState().users.currentUser?.token;
    if (!token) {
      return;
    }
    dispatch(slice.actions.setStatus('busy'))
    try {
      const { name, price, cost, description } = article;
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`,
        {
          name, price, cost, description
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      dispatch(slice.actions.enqueueNotification({
        variant: 'success',
        message: 'Articulo añadido'
      }))
    } catch (err: any) {
      const error = err.toJSON();
      dispatch(slice.actions.enqueueNotification({
        variant: 'error',
        message: error.message
      }))
      if (error.status === 401) {
        dispatch(setCurrentUser({
          user: null,
          token: null
        }))
      }
    } finally {
      dispatch(getAllArticles())
      dispatch(slice.actions.setMutatedArticle(null));
      dispatch(slice.actions.setActionArticle(false));
      dispatch(slice.actions.setStatus('none'))

    }
  };
};

export const updateArticle = (article: Article): ThunkAction<void, RootState, unknown, Action<unknown>> => {
  return async (dispatch, getState) => {
    const token = getState().users.currentUser?.token;
    if (!token) {
      return;
    }
    
    dispatch(slice.actions.setStatus('busy'))
    try {
      const { name, price, cost, description, id } = article;
      const { data } = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`,
        {
          name, price, cost, description
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      dispatch(slice.actions.enqueueNotification({
        variant: 'success',
        message: `Articulo ${data.name} Editado`
      }))
      dispatch(getAllArticles())
    } catch (err: any) {
      const error = err.toJSON();
      dispatch(slice.actions.enqueueNotification({
        variant: 'error',
        message: error.message
      }))
      if (error.status === 401) {
        dispatch(setCurrentUser({
          user: null,
          token: null
        }))
      }
    } finally {
      dispatch(slice.actions.setMutatedArticle(null));
      dispatch(slice.actions.setActionArticle(false));
      dispatch(slice.actions.setStatus('none'))
    }
  };
};

export const deleteArticle = (): ThunkAction<void, RootState, unknown, Action<unknown>> => {
  return async (dispatch, getState) => {
    const { selectedArticles } = getState().articles;
    const token = getState().users.currentUser?.token;
    if (!token) {
      return;
    }
    
    dispatch(slice.actions.setStatus('busy'))
    if (selectedArticles.length === 0) {
      return;
    }
    const promises: Promise<void>[] = [];
    for (const article of selectedArticles) {
      promises.push(
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${article.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        ));
    }
    try {
      const prom = await Promise.all(promises).then(()=>{
        dispatch(slice.actions.setStatus('none'))
        dispatch(slice.actions.enqueueNotification({
          variant: 'warning',
          message: `Articulo ${promises.length} eliminados`
        }))
      });
      
      dispatch(slice.actions.enqueueNotification({
        variant: 'warning',
        message: `Articulo ${promises.length} eliminados`
      }))
    } catch (err: any) {
      const error = err.toJSON();
      dispatch(slice.actions.enqueueNotification({
        variant: 'error',
        message: error.message
      }))
      if (error.status === 401) {
        dispatch(setCurrentUser({
          user: null,
          token: null
        }))
      }
      dispatch(slice.actions.setStatus('none'))
    } finally {
      dispatch(getAllArticles())
      dispatch(slice.actions.setSelectedArticles([]))
    }

  };
};
