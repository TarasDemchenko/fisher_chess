// import { useState } from "react";
// import { Button, Text, View } from "react-native";
// import Chessboard from "react-native-chessboard";
// import generateChess960Fen from "./components/RandomFen";
// import { useSelector } from "react-redux";
// import { RootState } from "./store/rootReducer";
// import { useDispatch } from "react-redux";
// import { useRoute } from "@react-navigation/native";
// import { clearHistory, updateGameHistory } from "./store/gamesSlices";

// type Move = {
//   from: string;
//   to: string;
//   color: string;
// };

// type GameState = {
//   fen: string;
//   game_over: boolean;
// };

// type ChessMoveInfo = {
//   move: Move;
//   state: GameState;
// };

// type HistoryItem = {
//   move: Move;
//   fen: string;
// };
// const GameScreen = () => {
//   const route = useRoute();
//   const { gameId } = route.params as { gameId: string };
//   const games = useSelector((state: RootState) => state.games.games);
//   const dispatch = useDispatch();
//   const game = games.find((g) => g.id === gameId);
//   const [history, setHistory] = useState<HistoryItem[]>(game?.history || []);
//   const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(
//     game?.history && game.history.length > 0 ? game.history.length - 1 : -1
//   );
//   const [fen, setFen] = useState<string>(
//     game?.history.length
//       ? game.history[game.history.length - 1].fen
//       : game?.startFen || generateChess960Fen()
//   );
//   console.log("histiry", history);

//   const saveFen = (fen: string, move: Move) => {
//     const newHistory = [
//       ...history.slice(0, currentHistoryIndex + 1),
//       { fen, move },
//     ];

//     setHistory(newHistory);
//     setCurrentHistoryIndex(newHistory.length - 1);
//     const game = games.find((g) => g.id === gameId);
//     if (game) {
//       dispatch(updateGameHistory({ gameId, move, fen }));
//       if (!game?.canEditMoves) {
//         if (currentHistoryIndex < history.length - 1) {
//           alert("You can only change the last move.");
//           setFen(history[history.length - 1].fen);
//           setCurrentHistoryIndex(history.length - 1);
//         }
//       }

//       // if (currentHistoryIndex < history.length - 1) {
//       //   setFen(history[history.length - 1].fen);
//       //   setCurrentHistoryIndex(history.length - 1);
//       //   alert("You can only change the last move.");
//       //   return;
//       // }
//     }
//   };

//   const handleNewGame = () => {
//     const newFen = generateChess960Fen();
//     setFen(newFen);
//     dispatch(clearHistory(gameId));
//     setHistory([]);
//     setCurrentHistoryIndex(-1);
//   };

//   const handleMove = (info: ChessMoveInfo) => {
//     const { move } = info;
//     const { from, to, color } = move;
//     const newFen = info.state.fen;
//     setFen(newFen);
//     const moveObject: Move = {
//       from,
//       to,
//       color,
//     };
//     saveFen(newFen, moveObject);
//     console.log("info", move);
//   };

//   const undoMove = () => {
//     if (currentHistoryIndex > 0) {
//       const prevState = history[currentHistoryIndex - 1];
//       setFen(prevState.fen);
//       setCurrentHistoryIndex(currentHistoryIndex - 1);
//     } else if (currentHistoryIndex === 0 && history.length > 0) {
//       setFen(game?.startFen || generateChess960Fen());
//       setCurrentHistoryIndex(-1);
//     }
//   };

//   const goToLastMove = () => {
//     if (currentHistoryIndex < history.length - 1) {
//       const nextState = history[currentHistoryIndex + 1];
//       setFen(nextState.fen);
//       setCurrentHistoryIndex(currentHistoryIndex + 1);
//     }
//   };

//   const goToEndOfGame = () => {
//     if (history.length > 0) {
//       const lastState = history[history.length - 1];
//       setFen(lastState.fen);
//       setCurrentHistoryIndex(history.length - 1);
//     }
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "flex-start",
//       }}
//     >
//       {fen && (
//         <Chessboard key={currentHistoryIndex} fen={fen} onMove={handleMove} />
//       )}
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-between",
//           width: "100%",
//         }}
//       >
//         <Button title="New game" onPress={handleNewGame} />
//         <Button
//           title="Undo move"
//           onPress={undoMove}
//           disabled={currentHistoryIndex < 0}
//         />
//         <Button
//           title="Redo move"
//           onPress={goToLastMove}
//           disabled={currentHistoryIndex >= history.length - 1}
//         />
//         <Button
//           title="Last"
//           onPress={goToEndOfGame}
//           disabled={history.length === 0}
//         />
//       </View>
//       <View>
//         {history.map((item, index) => (
//           <Text
//             key={index}
//             style={{
//               fontSize: 14,
//               marginBottom: 5,
//               fontWeight: currentHistoryIndex === index ? "bold" : "normal",
//             }}
//             onPress={() => {
//               setFen(item.fen);
//               setCurrentHistoryIndex(index);
//             }}
//           >
//             {index + 1}: {item.move.color}:{item.move.from}-{item.move.to}
//           </Text>
//         ))}
//       </View>
//     </View>
//   );
// };

// export default GameScreen;

// import React, { useRef, useState } from "react";
// import { useRoute } from "@react-navigation/native";
// import { Button, Text, View } from "react-native";
// import Chessboard, { ChessboardRef } from "react-native-chessboard";
// import { useSelector } from "react-redux";
// import { RootState } from "./store/rootReducer";
// import { router } from "expo-router";
// import generateChess960Fen from "./components/RandomFen";
// type Move = {
//   from: string;
//   to: string;
//   color: "w" | "b";
// };
// const GameScreen = () => {
//   const chessboardRef = useRef<ChessboardRef>(null);
//   const route = useRoute();
//   const { gameId } = route.params as { gameId: string };
//   const games = useSelector((state: RootState) => state.games.games);
//   const game = games.find((g) => g.id === gameId);
//   const [fen, setFen] = useState<string>(
//     game?.startFen || generateChess960Fen()
//   );
//   const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(
//     game?.history.length - 1 || -1
//   );
//   const history = game?.history || [];

//   const handleMove = (move: Move) => {
//     if (!game?.canEditMoves && currentHistoryIndex < history.length - 1) {
//       alert("Вы можете изменять только последний ход.");
//       return;
//     }

//     const newFen = chessboardRef.current?.getFen();
//     if (newFen) {
//       dispatch(updateGameHistory({ gameId, move, fen: newFen }));
//       setCurrentHistoryIndex(history.length);
//     }
//   };

//   const handleNewGame = () => {
//     const newFen = generateChess960Fen();
//     setFen(newFen);
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "flex-start",
//       }}
//     >
//       {fen && (
//         <Chessboard
//           fen={fen}
//           ref={chessboardRef}
//           key={currentHistoryIndex}
//           onMove={(move, state) =>
//             handleMove(
//               { from: move.from, to: move.to, color: move.color },
//               state
//             )
//           }
//         />
//       )}
//       <View>
//         <Button title="Сбросить доску" onPress={handleNewGame} />
//       </View>
//     </View>
//   );
// };

// export default GameScreen;

// import { useEffect, useState } from "react";
// import { Button, Text, View } from "react-native";
// import Chessboard from "react-native-chessboard";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "./store/rootReducer";
// import { useRoute } from "@react-navigation/native";
// import { updateGameHistory, clearHistory } from "./store/gamesSlices";
// import { Chess } from "chess.js";
// import generateChess960Fen from "./components/RandomFen"; // Генерация начальной позиции

// type Move = {
//   from: string;
//   to: string;
//   san: string;
//   color: string;
// };

// type HistoryItem = {
//   fen: string;
//   move: Move;
// };

// const GameScreen = () => {
//   const route = useRoute();
//   const { gameId } = route.params as { gameId: string };
//   const games = useSelector((state: RootState) => state.games.games);
//   const dispatch = useDispatch();

//   const game = games.find((g) => g.id === gameId);
//   const [history, setHistory] = useState<HistoryItem[]>(game?.history || []);
//   const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(
//     game?.history.length ? game.history.length - 1 : -1
//   );

//   const chess = new Chess(game?.startFen || generateChess960Fen()); // Инициализируем объект chess.js
//   const [fen, setFen] = useState<string>(chess.fen());

//   useEffect(() => {
//     if (game?.history.length) {
//       setHistory(game.history);
//       setCurrentHistoryIndex(game.history.length - 1);
//       setFen(game.history[game.history.length - 1].fen);
//     }
//   }, [game]);

//   const saveFen = (fen: string, move: Move) => {
//     const newHistory = [
//       ...history.slice(0, currentHistoryIndex + 1),
//       { fen, move },
//     ];

//     setHistory(newHistory);
//     setCurrentHistoryIndex(newHistory.length - 1);
//     dispatch(updateGameHistory({ gameId, move, fen }));
//   };

//   const handleNewGame = () => {
//     const newFen = generateChess960Fen();
//     chess.reset();
//     setFen(newFen);
//     dispatch(clearHistory(gameId));
//     setHistory([]);
//     setCurrentHistoryIndex(-1);
//   };

//   const handleMove = (move: Move) => {
//     const chessMove = chess.move({
//       from: move.from,
//       to: move.to,
//     });

//     if (chessMove) {
//       const newFen = chess.fen();
//       saveFen(newFen, move);
//     } else {
//       console.log("Invalid move");
//     }
//   };

//   const undoMove = () => {
//     chess.undo();
//     const newFen = chess.fen();
//     setFen(newFen);

//     if (currentHistoryIndex > 0) {
//       const prevState = history[currentHistoryIndex - 1];
//       setFen(prevState.fen);
//       setCurrentHistoryIndex(currentHistoryIndex - 1);
//     }
//   };

//   const goToLastMove = () => {
//     if (currentHistoryIndex < history.length - 1) {
//       const nextState = history[currentHistoryIndex + 1];
//       setFen(nextState.fen);
//       setCurrentHistoryIndex(currentHistoryIndex + 1);
//     }
//   };

//   const goToEndOfGame = () => {
//     if (history.length > 0) {
//       const lastState = history[history.length - 1];
//       setFen(lastState.fen);
//       setCurrentHistoryIndex(history.length - 1);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "flex-start" }}>
//       {fen && (
//         <Chessboard key={currentHistoryIndex} fen={fen} onMove={handleMove} />
//       )}
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-between",
//           width: "100%",
//         }}
//       >
//         <Button title="New Game" onPress={handleNewGame} />
//         <Button
//           title="Undo Move"
//           onPress={undoMove}
//           disabled={currentHistoryIndex < 0}
//         />
//         <Button
//           title="Redo Move"
//           onPress={goToLastMove}
//           disabled={currentHistoryIndex >= history.length - 1}
//         />
//         <Button
//           title="Last Move"
//           onPress={goToEndOfGame}
//           disabled={history.length === 0}
//         />
//       </View>
//       <View>
//         {history.map((item, index) => (
//           <Text
//             key={index}
//             style={{
//               fontSize: 14,
//               marginBottom: 5,
//               fontWeight: currentHistoryIndex === index ? "bold" : "normal",
//             }}
//             onPress={() => {
//               setFen(item.fen);
//               setCurrentHistoryIndex(index);
//             }}
//           >
//             {index + 1}: {item.move.color} - {item.move.from} to {item.move.to}
//           </Text>
//         ))}
//       </View>
//     </View>
//   );
// };

// export default GameScreen;

// import React, { useState, useEffect } from "react";
// import { Button, View, Text } from "react-native";
// import Chessboard from "react-native-chessboard";
// import { Chess, Move as ChessMove } from "chess.js";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "./store/rootReducer";
// import { updateGameHistory, clearHistory } from "./store/gamesSlices";
// import generateChess960Fen from "./components/RandomFen"; // Для генерации начальной позиции

// // Типы для игры
// interface Move {
//   from: string;
//   to: string;
//   san: string;
//   color: string;
// }

// interface HistoryItem {
//   fen: string;
//   move: Move;
// }

// interface Game {
//   id: string;
//   player1Id: string;
//   player2Id: string;
//   history: HistoryItem[];
//   startFen: string;
//   canEditMoves: boolean;
// }

// interface GameScreenProps {
//   route: {
//     params: {
//       gameId: string;
//     };
//   };
// }

// // Компонент GameScreen
// const GameScreen: React.FC<GameScreenProps> = ({ route }) => {
//   const { gameId } = route.params;
//   const dispatch = useDispatch();
//   const games = useSelector((state: RootState) => state.games.games);
//   const game = games.find((g) => g.id === gameId);

//   // Состояние для chess.js и историй игры
//   const [chess, setChess] = useState<Chess | null>(null);
//   const [fen, setFen] = useState<string>("");
//   const [history, setHistory] = useState<HistoryItem[]>(game?.history || []);
//   const [currentHistoryIndex, setCurrentHistoryIndex] = useState<number>(-1);

//   // Инициализация chess.js
//   useEffect(() => {
//     const initialFen = game?.startFen || generateChess960Fen();
//     const chessInstance = new Chess(initialFen);
//     setChess(chessInstance);
//     setFen(chessInstance.fen());
//   }, [game]);

//   // Сохранение хода в историю
//   const saveMove = (move: ChessMove) => {
//     const newHistory = [
//       ...history.slice(0, currentHistoryIndex + 1),
//       {
//         fen,
//         move: {
//           from: move.from,
//           to: move.to,
//           san: move.san,
//           color: move.color,
//         },
//       },
//     ];

//     setHistory(newHistory);
//     setCurrentHistoryIndex(newHistory.length - 1);
//     dispatch(
//       updateGameHistory({
//         gameId,
//         move: newHistory[newHistory.length - 1].move,
//         fen,
//       })
//     );
//   };

//   // Обработка нового хода
//   const handleMove = (move: any) => {
//     if (!chess) return;
//     const chessMove = chess.move({ from: move.from, to: move.to });
//     if (chessMove) {
//       const newFen = chess.fen();
//       setFen(newFen);
//       saveMove(chessMove);
//     } else {
//       console.log("Invalid move");
//     }
//   };

//   // Обработка нового начала игры
//   const handleNewGame = () => {
//     const newFen = generateChess960Fen();
//     const chessInstance = new Chess(newFen);
//     setChess(chessInstance);
//     setFen(chessInstance.fen());
//     dispatch(clearHistory(gameId));
//     setHistory([]);
//     setCurrentHistoryIndex(-1);
//   };

//   // Отмена последнего хода
//   const undoMove = () => {
//     if (!chess) return;
//     chess.undo();
//     setFen(chess.fen());
//     if (currentHistoryIndex > 0) {
//       const prevState = history[currentHistoryIndex - 1];
//       setFen(prevState.fen);
//       setCurrentHistoryIndex(currentHistoryIndex - 1);
//     }
//   };

//   // Перейти к следующему ходу
//   const redoMove = () => {
//     if (currentHistoryIndex < history.length - 1) {
//       const nextState = history[currentHistoryIndex + 1];
//       setFen(nextState.fen);
//       setCurrentHistoryIndex(currentHistoryIndex + 1);
//     }
//   };

//   // Переход к последнему ходу
//   const goToEndOfGame = () => {
//     if (history.length > 0) {
//       const lastState = history[history.length - 1];
//       setFen(lastState.fen);
//       setCurrentHistoryIndex(history.length - 1);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "flex-start", padding: 20 }}>
//       {fen && <Chessboard fen={fen} onMove={handleMove} />}

//       <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//         <Button title="New Game" onPress={handleNewGame} />
//         <Button
//           title="Undo Move"
//           onPress={undoMove}
//           disabled={currentHistoryIndex < 0}
//         />
//         <Button
//           title="Redo Move"
//           onPress={redoMove}
//           disabled={currentHistoryIndex >= history.length - 1}
//         />
//         <Button
//           title="Last Move"
//           onPress={goToEndOfGame}
//           disabled={history.length === 0}
//         />
//       </View>

//       <View>
//         {history.map((item, index) => (
//           <Text
//             key={index}
//             style={{
//               fontSize: 14,
//               marginBottom: 5,
//               fontWeight: currentHistoryIndex === index ? "bold" : "normal",
//             }}
//             onPress={() => {
//               setFen(item.fen);
//               setCurrentHistoryIndex(index);
//             }}
//           >
//             {index + 1}: {item.move.color} - {item.move.from} to {item.move.to}
//           </Text>
//         ))}
//       </View>
//     </View>
//   );
// };

// export default GameScreen;

// import React, { useState } from "react";
// import Chessboard from "react-native-chessboard";
// import { Button, Text, View } from "react-native";
// import generateChess960Fen from "./components/RandomFen";
// import { Chess } from "chess.js";
// type Move = {
//   from: string;
//   to: string;
//   color: string;
// };

// type GameState = {
//   fen: string;
//   game_over: boolean;
// };

// type ChessMoveInfo = {
//   move: Move;
//   state: GameState;
// };
// const GameScreen = () => {
//   const [fen, setFen] = useState(generateChess960Fen());
//   const [chess, setChess] = useState(new Chess(fen));
//   const [history, setHistory] = useState<Move[]>([]);

//   const onMove = (move: ChessMoveInfo) => {
//     console.log(history);

//     const newGame = new Chess(fen);

//     // Извлекаем значения from и to
//     const from = move.move.from;
//     const to = move.move.to;

//     // Формируем строку "from" + "to" (например "c2c4")
//     const moveString = from + to;
//     console.log(moveString);
//     // Передаем строку в метод move
//     const result = newGame.move(moveString);

//     if (result) {
//       setChess(newGame); // Обновляем состояние игры
//       setFen(newGame.fen()); // Обновляем позицию на доске
//       setHistory(newGame.history({ verbose: true })); // Обновляем историю
//     } else {
//       console.error("Недопустимый ход:", move);
//     }
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "flex-start", padding: 20 }}>
//       {fen && <Chessboard fen={fen} onMove={onMove} />}

//       <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//         <Button title="New Game" />
//         <Button
//           title="Undo Move"
//           // onPress={undoMove}
//           // disabled={currentHistoryIndex < 0}
//         />
//         <Button
//           title="Redo Move"
//           // onPress={redoMove}
//           // disabled={currentHistoryIndex >= history.length - 1}
//         />
//         <Button
//           title="Last Move"
//           // onPress={goToEndOfGame}
//           // disabled={history.length === 0}
//         />
//       </View>

//       {/* <View>
//         {history.map((item, index) => (
//           <Text
//             key={index}
//             style={{
//               fontSize: 14,
//               marginBottom: 5,
//               fontWeight: currentHistoryIndex === index ? "bold" : "normal",
//             }}
//             onPress={() => {
//               setFen(item.fen);
//               setCurrentHistoryIndex(index);
//             }}
//           >
//             {index + 1}: {item.move.color} - {item.move.from} to {item.move.to}
//           </Text>
//         ))}
//       </View> */}
//     </View>
//   );
// };

// export default GameScreen;
