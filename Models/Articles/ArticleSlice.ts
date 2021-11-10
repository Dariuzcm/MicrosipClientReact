import { Action, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../store";
import { Article } from "./Article";

export type ArticleSlice = {
  selectedArticles: Article[];
  editedArticle: Article | undefined;
  articles: Article[];
}
const defaultState: ArticleSlice = {
  selectedArticles: [],
  articles: [],
  editedArticle: undefined,
};

const slice = createSlice({
  name: 'articles',
  initialState: defaultState,
  reducers:{
    setSelectedArticles: (state, action: PayloadAction<Article[]>) => {
      state.selectedArticles = action.payload;
    },
    setArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
    setToEditArticle: (state, action: PayloadAction<Article | undefined >) => {
      state.editedArticle = action.payload;
    }
  },
});

const articlesReducer = slice.reducer;

export const { setSelectedArticles, setArticles, setToEditArticle } = slice.actions;
export default articlesReducer;

export const getAllArticles = (): ThunkAction<Promise<string>, RootState, unknown, Action<unknown>> => {
  return async (dispatch, getState) => {
    const token = getState().users.currentUser?.token;
    if(!token){
      return 'fail';
    }
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles`,{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    dispatch(slice.actions.setArticles(data));
    return 'done';
  }
}