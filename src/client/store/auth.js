import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '../history';

const TOKEN = 'token';
const initialState = {
  status: 'idle', // 'idle | 'loading' | 'succeeded' | 'failed'
  me: {},
  error: null,
};

export const fetchAuth = createAsyncThunk('auth/me', async () => {
  try {
    const token = window.localStorage.getItem(TOKEN);
    if (token) {
      const { data } = await axios.get('/auth/me', {
        headers: {
          authorization: token,
        },
      });
      return data;
    }
  } catch (error) {
    return error.message;
  }
});

export const authenticate = createAsyncThunk(
  'auth/authenticate',
  async ({ username, password, method }, { dispatch }) => {
    try {
      const { data } = await axios.post(`/auth/${method}`, {
        username,
        password,
      });
      window.localStorage.setItem(TOKEN, data.token);
      dispatch(fetchAuth());
    } catch (error) {
      return error.message;
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state, action) => {
      window.localStorage.removeItem(TOKEN);
      history.push('/login');
      state = initialState;
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state, action) => {
      state.status = 'pending';
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.status = 'succeeded';
      state.me = action.payload;
    },
    [fetchAuth.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
    [authenticate.pending]: (state, action) => {
      state.status = 'pending';
    },
    [authenticate.fulfilled]: (state, action) => {
      state.status = 'succeeded';
    },
    [authenticate.rejected]: (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    },
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
