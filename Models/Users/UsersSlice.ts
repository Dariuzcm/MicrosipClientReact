import { ConstructionOutlined } from "@mui/icons-material";
import { Action, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { env } from "process";
import { RootState } from "../../store";
import { getAllArticles } from "../Articles/ArticleSlice";
import { User } from "./Users";

export type loggedUser = {
  user: User | null;
  token: string | null;
}
export type logginValues = {
  username: string | null;
  password: string | null;
  status: 'loading' | 'none' | 'ok';
};
export type NotifError = {
  message: string;
  type: 'error' | 'info' | 'warning' | 'success';
}

export type UserSlice = {
  currentUser: loggedUser;
  loggValues: logginValues;
  loginError: NotifError | null;
}
const defaultState: UserSlice = {
  currentUser: {
    user: null,
    token: null,
  },
  loggValues: {
    username: null,
    password: null,
    status: 'none'
  },
  loginError: null,
};

const slice = createSlice({
  name: 'users',
  initialState: defaultState,
  reducers: {
    setLogginValues: (state, action: PayloadAction<logginValues>) => {
      state.loggValues = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<loggedUser>) => {
      state.currentUser = action.payload;
    },
    setLoginState: (state, action: PayloadAction<'loading' | 'none' | 'ok'>) => {
      state.loggValues.status = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.loggValues.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.loggValues.password = action.payload;
    },
    setError: (state, action: PayloadAction<NotifError | null>) => {
      state.loginError = action.payload
    },
  },
});

const usersReducer = slice.reducer;

export const { setCurrentUser, setUsername, setPassword, setLoginState } = slice.actions;
export default usersReducer;

export const onLoginSubmit = (): ThunkAction<void, RootState, unknown, Action<unknown>> => {
  return async (dispatch, getState) => {
    const { loggValues, loginError } = getState().users;
    dispatch(slice.actions.setLoginState('loading'));
    if (!loggValues) return;
    if (loginError) dispatch(slice.actions.setError(null));

    try {
      const { username, password } = loggValues;
      const { data, status } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        username,
        email: username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { token, user } = data;
      const {email, id, name} = user;
      if (status === 200) {
        dispatch(slice.actions.setLoginState('ok'));
        dispatch(slice.actions.setCurrentUser({
          token: token.token,
          user: {
            email,
            id,
            name
          }
        }))
      }
    } catch (error: any) {
      dispatch(slice.actions.setError({
        message: `${error.message}: ${error.error}`,
        type: 'error',
      }));
    } finally {
      dispatch(getAllArticles())
    }
  }
}
