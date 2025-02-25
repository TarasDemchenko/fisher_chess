import { Stack } from "expo-router";
import { Provider } from "react-redux";
import store from "./store/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <Stack />
      </GestureHandlerRootView>
    </Provider>
  );
}
