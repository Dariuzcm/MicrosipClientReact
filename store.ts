import { configureStore } from '@reduxjs/toolkit'
import articlesReducer from './Models/Articles/ArticleSlice'
import usersReducer from './Models/Users/UsersSlice'

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    users: usersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
