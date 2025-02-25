import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PlayerPair {
  id: string;
  player1: { id: string; name: string };
  player2: { id: string; name: string };
}

interface PlayersState {
  pairs: PlayerPair[];
}

const initialState: PlayersState = {
  pairs: [],
};

const playersSlice = createSlice({
  name: "players",
  initialState,
  reducers: {
    addPlayersPair: (state, action: PayloadAction<PlayerPair>) => {
      state.pairs.push(action.payload);
    },
    // updatePlayer: (state, action: PayloadAction<Player>) => {
    //   const index = state.players.findIndex((p) => p.id === action.payload.id);
    //   if (index !== -1) {
    //     state.players[index] = action.payload;
    //   }
    // },
    deletePlayer: (state, action: PayloadAction<string>) => {
      state.pairs = state.pairs.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addPlayersPair, deletePlayer } = playersSlice.actions;
export default playersSlice.reducer;
