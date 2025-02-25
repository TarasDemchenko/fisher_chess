import { Button, StyleSheet, Switch, Text, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "./store/rootReducer";
import { addPlayersPair, deletePlayer } from "./store/playersSlices";
import uuid from "react-native-uuid";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { addGame, removeGame } from "./store/gamesSlices";
import generateChess960Fen from "./components/RandomFen";

const PlayersScreen = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const pairs = useSelector((state: RootState) => state.players.pairs);
  const games = useSelector((state: RootState) => state.games.games);
  const [editablePairs, setEditablePairs] = useState<Record<string, boolean>>(
    {}
  );

  console.log("games", games);
  console.log("pairs", pairs);

  const handleAddPair = () => {
    if (name1 && name2) {
      dispatch(
        addPlayersPair({
          id: uuid.v4(),
          player1: { id: uuid.v4(), name: name1 },
          player2: { id: uuid.v4(), name: name2 },
        })
      );
      setName1("");
      setName2("");
    }
  };
  const handleSwitchChange = (pairId: string, value: boolean) => {
    setEditablePairs((prev) => ({
      ...prev,
      [pairId]: value,
    }));
  };
  const handleStartGame = (pairId: string) => {
    const canEditMoves = editablePairs[pairId] || false;
    dispatch(removeGame(pairId));
    const pair = pairs.find((p) => p.id === pairId);
    if (!pair) return;
    const gameId = pair.id;
    const newFen = generateChess960Fen();
    dispatch(
      addGame({
        id: gameId,
        player1Id: pair.player1.id,
        player2Id: pair.player2.id,
        fen: newFen,
        canEditMoves,
      })
    );
    router.push({ pathname: "/GameScreen", params: { gameId } });
  };

  const handleViewGame = (pairId: string) => {
    const game = games.find((game) => game.id === pairId);
    if (game) {
      router.push({
        pathname: "/GameScreen",
        params: { gameId: game.id },
      });
    } else {
      alert("Player don't have game");
    }
  };

  const handleDeletePair = (pairId: string) => {
    dispatch(deletePlayer(pairId));
    dispatch(removeGame(pairId));
  };

  return (
    <View>
      <Text style={styles.text}>Create players</Text>
      <View>
        <TextInput
          placeholder="Player 1"
          value={name1}
          onChangeText={setName1}
          style={styles.input}
        />
        <TextInput
          placeholder="Player 2"
          value={name2}
          onChangeText={setName2}
          style={styles.input}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Button title="Add pairs" onPress={handleAddPair} />
      </View>
      <FlatList
        data={pairs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                }}
              >
                {item.player1.name} vs {item.player2.name}
              </Text>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <Switch
                  value={editablePairs[item.id] || false}
                  onValueChange={(value) => handleSwitchChange(item.id, value)}
                  style={{ marginVertical: 10 }}
                />
                <Text style={{ fontSize: 15 }}>
                  {editablePairs[item.id] ? "Rewritable" : "No rewritable"}
                </Text>
              </View>
              <Button title="Play" onPress={() => handleStartGame(item.id)} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Button
                title="View game"
                onPress={() => handleViewGame(item.id)}
              />

              <Button
                title="Delete"
                onPress={() => handleDeletePair(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    marginTop: 5,
  },
  text: {
    fontSize: 30,
  },
});

export default PlayersScreen;
