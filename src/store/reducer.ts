import userSlice from '@src/slices/user';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  user: userSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
