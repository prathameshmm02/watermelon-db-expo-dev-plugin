import { App } from "antd";
import { DevToolsPluginClient } from "expo/devtools";
import React from "react";
import TableRecords from "./TableRecords";
import Tables from "./Tables";
import { usePluginStore } from "./hooks/usePluginStore";

type Props = {
  client: DevToolsPluginClient;
};

const WatermelonDevTools = ({ client }: Props) => {
  const {
    tables,
    selectedTable,
    records,
    page,
    limit,
    totalCount,
    loading,
    columns,
    addNewRecord,
    refreshTableRecords,
    setSelectedTable,
    setPage,
    setLimit,
  } = usePluginStore(client, console.error);

  return (
    <App
      style={{
        width: "100%",
        height: "100%",
        padding: "0.75em",
        overflowY: "scroll",
      }}
    >
      {selectedTable ? (
        <TableRecords
          tableName={selectedTable}
          records={records}
          columns={columns}
          page={page}
          limit={limit}
          totalCount={totalCount}
          loading={loading}
          onBackPress={() => setSelectedTable("")}
          onRefresh={refreshTableRecords}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onAddRecord={addNewRecord}
        />
      ) : (
        <Tables tables={tables} onSelectTable={setSelectedTable} />
      )}
    </App>
  );
};

export default WatermelonDevTools;
