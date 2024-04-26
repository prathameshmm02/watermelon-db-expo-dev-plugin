import { StyleSheet, Text, View } from "react-native";
import WatermelonDevTools from "./src/WatermelonDevTools";
import { useConnectedClient } from "./src/hooks/useConnectedClient";

export default function App() {
  const connectedClient = useConnectedClient();

  if (!connectedClient) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          No connection to the dev client. Make sure you have the dev client
          running.
        </Text>
        <Text style={styles.devHint}>
          You can start the dev client by running{" "}
          <Text style={styles.textLink}>expo start --dev-client</Text>
        </Text>
      </View>
    );
  }
  console.log("Client:", connectedClient?.connectionInfo);

  return <WatermelonDevTools client={connectedClient} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
  },
  devHint: {
    color: "#666",
  },
  textLink: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
