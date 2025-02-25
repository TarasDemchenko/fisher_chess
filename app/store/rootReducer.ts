import { combineReducers } from "@reduxjs/toolkit";
import gemesReducer from "./gamesSlices";
import playersReducer from "./playersSlices";

const rootReducer = combineReducers({
  games: gemesReducer,
  players: playersReducer,
});
export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
