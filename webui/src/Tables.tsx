import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { List } from "antd";

type Props = {
  tables: string[];
  onSelectTable: (table: string) => void;
};
const Tables = ({ tables, onSelectTable }: Props) => {
  return (
    <View style={styles.container}>
      <List
        style={{ minWidth: 300 }}
        itemLayout="vertical"
        dataSource={tables}
        size="large"
        renderItem={(item) => (
          <List.Item onClick={() => onSelectTable(item)} style={styles.text}>
            {item}
          </List.Item>
        )}
        header={<Text style={styles.header}>Tables</Text>}
      />
    </View>
  );
};

export default Tables;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
  },
  text: {
    fontSize: 16,
    cursor: "pointer",
  },
});
