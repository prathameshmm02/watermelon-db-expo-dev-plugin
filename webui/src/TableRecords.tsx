import {
  ArrowLeftOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Flex, Table } from "antd";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AddRecordModal from "./AddRecordModal";
import { Column } from "../../types";

type Props = {
  tableName: string;
  records: any[];
  loading: boolean;
  page: number;
  limit: number;
  totalCount: number;
  columns: Column[];
  onBackPress: () => void;
  onRefresh: () => void;
  onAddRecord: (record: any) => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

const TableRecords = ({
  tableName,
  records,
  columns,
  page,
  limit,
  totalCount,
  loading,
  onAddRecord,
  onBackPress,
  onRefresh,
  onPageChange,
  onLimitChange,
}: Props) => {
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);

  const handleAddRecord = (record: any) => {
    setIsAddRecordModalOpen(false);
    onAddRecord(record);
  };

  return (
    <View style={styles.container}>
      <AddRecordModal
        columns={columns}
        open={isAddRecordModalOpen}
        onCancel={() => setIsAddRecordModalOpen(false)}
        onOk={handleAddRecord}
      />
      <Button
        shape="circle"
        icon={<ArrowLeftOutlined />}
        onClick={onBackPress}
      />

      {records.length > 0 && (
        <Table
          title={() => (
            <Flex align="center" justify="center" gap="0.5em">
              <Flex vertical>
                <Text style={styles.title}>{tableName}</Text>
                <Text>Total Count: {totalCount}</Text>
              </Flex>
              <Button icon={<ReloadOutlined />} onClick={onRefresh} />
              <Button
                icon={<PlusOutlined />}
                onClick={() => setIsAddRecordModalOpen(true)}
              />
            </Flex>
          )}
          rowKey="id"
          columns={Object.keys(records[0]).map((item) => {
            return {
              title: item,
              dataIndex: item,
            };
          })}
          dataSource={records}
          pagination={{
            current: page + 1,
            pageSize: limit,
            total: totalCount,
            onChange(page, pageSize) {
              onPageChange(page - 1);
              onLimitChange(pageSize);
            },
            position: ["topRight"],
          }}
          loading={loading}
        />
      )}
    </View>
  );
};

export default TableRecords;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
