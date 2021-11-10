import { Action, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import axios from "axios";
import { env } from "process";
import { RootState } from "../../store";
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

export type UserSlice = {
  currentUser: loggedUser;
  loggValues: logginValues;
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
  }
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
  },
});

const usersReducer = slice.reducer;

export const { setCurrentUser, setUsername, setPassword, setLoginState } = slice.actions;
export default usersReducer;

export const onLoginSubmit = (): ThunkAction<void, RootState, unknown, Action<unknown>> => {
  return async (dispatch, getState) => {
    const logginValues = getState().users.loggValues;
    if (!logginValues) return;

    const { username, password } = logginValues;

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      username,
      password
    })
    
    if(response.status === 200) {
      dispatch(slice.actions.setLoginState('ok'));
    }
  }
}
