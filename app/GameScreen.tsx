import React, { useEffect, useState } from "react";
import Chessboard from "react-native-chessboard";
import { Button, Text, View } from "react-native";
import generateChess960Fen from "./components/RandomFen";
import { Chess } from "chess.js";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "./store/rootReducer";
import { useDispatch } from "react-redux";
import { updateGameHistory } from "./store/gamesSlices";

type Move = {
  from: string;
  to: string;
  color: string;
};

type GameState = {
  fen: string;
  game_over: boolean;
};

type ChessMoveInfo = {
  move: Move;
  state: GameState;
};

const GameScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { gameId } = route.params as { gameId: string };
  const { games } = useSelector((state: RootState) => state.games);
  const game = games.find((g) => g.id === gameId);
  const [fen, setFen] = useState<string>(
    game?.startFen || generateChess960Fen()
  );
  const [chess, setChess] = useState(new Chess(fen));
  const [historyGame, setHistoryGame] = useState<Move[]>([]);
  const [currentTurn, setCurrentTurn] = useState<string>(chess.turn());
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);
  console.log("historyChess", historyGame.length);
  console.log("stateHistory", game?.history.length);

  const onMove = (move: ChessMoveInfo) => {
    if (!game?.canEditMoves) return;
    const from = move.move.from;
    const to = move.move.to;
    const result = chess.move({ from, to });

    if (result) {
      setFen(chess.fen());
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setCurrentTurn(chess.turn());
      setHistoryGame(chess.history({ verbose: true }));
      dispatch(updateGameHistory({ gameId, from, to }));
    }
  };

  const goToMove = (index: number) => {
    const newChess = new Chess(game?.startFen || generateChess960Fen());

    for (let i = 0; i <= index; i++) {
      newChess.move({
        from: historyGame[i].from,
        to: historyGame[i].to,
      });
    }
    setChess(newChess);
    setFen(newChess.fen());
    setCurrentHistoryIndex(index);
    setCurrentTurn(newChess.turn());
  };

  const goBack = () => {
    if (currentHistoryIndex >= 0) {
      chess.undo();
      setFen(chess.fen());
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setCurrentTurn(chess.turn());
    }
  };

  const goForward = () => {
    if (currentHistoryIndex < historyGame.length - 1) {
      chess.move(historyGame[currentHistoryIndex + 1]);
      setFen(chess.fen());
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setCurrentTurn(chess.turn());
    }
  };

  const goToEnd = () => {
    const lastFen = historyGame.length > 0 ? chess.fen() : fen;
    chess.load(lastFen);
    setFen(lastFen);
    setCurrentHistoryIndex(historyGame.length - 1);
    setCurrentTurn(chess.turn());
  };

  return (
    <View style={{ flex: 1, justifyContent: "flex-start" }}>
      <Text
        style={{
          fontSize: 18,
          marginTop: 10,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        {currentTurn === "w" ? "White to move" : "Black to move"}
      </Text>

      <Chessboard fen={fen} onMove={onMove} key={currentHistoryIndex} />

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Button
          title="Back"
          onPress={goBack}
          disabled={currentHistoryIndex === -1}
        />
        <Button
          title="Forward"
          onPress={goForward}
          disabled={currentHistoryIndex >= historyGame.length - 1}
        />
        <Button
          title="Last"
          onPress={goToEnd}
          disabled={currentHistoryIndex >= historyGame.length - 1}
        />
      </View>
      <View>
        {historyGame.map((item, index) => (
          <Text
            key={index}
            style={{
              fontSize: 14,
              marginBottom: 5,
              fontWeight: currentHistoryIndex === index ? "bold" : "normal",
            }}
            onPress={() => goToMove(index)}
          >
            {index + 1}: {item.color} {item.from} → {item.to}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default GameScreen;
