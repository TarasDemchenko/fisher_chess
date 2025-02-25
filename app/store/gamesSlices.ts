import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Move {
  from: string;
  to: string;
  // san: string;
  // color: string;
}

export interface Game {
  id: string;
  player1Id: string;
  player2Id: string;
  history: Move[];
  startFen: string;
  canEditMoves: boolean;
}

interface GamesState {
  games: Game[];
}

const initialState: GamesState = {
  games: [],
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    addGame: (
      state,
      action: PayloadAction<{
        id: string;
        player1Id: string;
        player2Id: string;
        fen: string;
        canEditMoves: boolean;
      }>
    ) => {
      state.games.push({
        id: action.payload.id,
        player1Id: action.payload.player1Id,
        player2Id: action.payload.player2Id,
        history: [],
        startFen: action.payload.fen,
        canEditMoves: action.payload.canEditMoves,
      });
    },
    // updateGameHistory: (
    //   state,
    //   action: PayloadAction<{ gameId: string; move: Move; fen: string }>
    // ) => {
    //   const game = state.games.find((g) => g.id === action.payload.gameId);
    //   if (game) {
    //     game.history.push({
    //       move: action.payload.move,
    //       fen: action.payload.fen,
    //     });
    //   }
    // },
    updateGameHistory: (
      state,
      action: PayloadAction<{ gameId: string; from: string; to: string }>
    ) => {
      const game = state.games.find((g) => g.id === action.payload.gameId);
      if (game) {
        game.history.push({ from: action.payload.from, to: action.payload.to });
      }
    },
    removeGame: (state, action: PayloadAction<string>) => {
      state.games = state.games.filter((game) => game.id !== action.payload);
    },
    clearHistory: (state, action: PayloadAction<string>) => {
      const game = state.games.find((g) => g.id === action.payload);
      if (game) {
        game.history = [];
      }
    },
  },
});

export const { addGame, updateGameHistory, removeGame, clearHistory } =
  gamesSlice.actions;
export default gamesSlice.reducer;
