import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (_, action) => action.payload,
    addUser: (state, action) => [action.payload, ...state],
    deleteUser: (state, action) => {
      return state.filter((user) => user.id !== action.payload);
    },
    updateUser: (state, action) =>
      state.map((u) => (u.id === action.payload.id ? action.payload : u)),
  },
});

export const { setUsers, addUser, deleteUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
