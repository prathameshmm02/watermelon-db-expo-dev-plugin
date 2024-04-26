import { DevToolsPluginClient, type EventSubscription } from "expo/devtools";
import { useCallback, useEffect, useState } from "react";
import { Column, Method, MethodAck } from "../../../types";

const methodAck: Record<Method, MethodAck> = {
  collections: "ack:collections",
  getRecords: "ack:getRecords",
  getColumns: "ack:getColumns",
  getCount: "ack:getCount",
  addNewRecord: "ack:addNewRecord",
  deleteCollection: "ack:deleteCollection",
};
const columnsTemp: Column[] = [
  { name: "title", type: "string" },
  { isOptional: true, name: "subtitle", type: "string" },
  { name: "body", type: "string" },
  { name: "is_pinned", type: "boolean" },
];
const dummyData: any[] = [];

for (let i = 0; i < 100; i++) {
  dummyData.push({
    id: i,
    title: `title ${i}`,
    body: `body ${i}`,
  });
}

export function usePluginStore(
  client: DevToolsPluginClient,
  onError: (error: unknown) => void
) {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [records, setRecords] = useState<any[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTables = useCallback(async () => {
    try {
      return client.sendMessage("collections", {});
    } catch (e) {
      onError(e);
    }
  }, [client]);

  const fetchTableRecords = useCallback(
    async (collection: string, offset: number, limit: number) => {
      try {
        setLoading(true);
        return client.sendMessage("getRecords", { collection, offset, limit });
      } catch (e) {
        onError(e);
      }
    },
    [client]
  );

  const fetchTableCount = useCallback(
    async (collection: string) => {
      try {
        return client.sendMessage("getCount", { collection });
      } catch (e) {
        onError(e);
      }
    },
    [client]
  );

  const fetchTableColumns= useCallback(
    async (collection: string) => {
      try {
        return client.sendMessage("getColumns", { collection });
      } catch (e) {
        onError(e);
      }
    },
    [client]
  );

  const refreshTableRecords = useCallback(async () => {
    if (!selectedTable) {
      return;
    }
    fetchTableRecords(selectedTable, page, limit);
    fetchTableCount(selectedTable);
  }, [selectedTable, page, limit]);

  const addNewRecord = useCallback(
    async (record: any) => {
      try {
        return client.sendMessage("addRecord", {
          collection: selectedTable,
          record,
        });
      } catch (e) {
        onError(e);
      }
    },
    [client]
  );

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (!selectedTable) {
      return;
    }
    fetchTableCount(selectedTable);
    fetchTableColumns(selectedTable);
  }, [selectedTable])

  useEffect(() => {
    if (!selectedTable) {
      return;
    }
    fetchTableRecords(selectedTable, page * limit, limit);
   
  }, [selectedTable, page, limit]);

  useEffect(() => {
    const subscriptions: EventSubscription[] = [];
    try {
      subscriptions.push(
        client.addMessageListener(
          methodAck.collections,
          ({ result }: { result: string[] }) => {
            setTables(result);
          }
        )
      );
    } catch (e) {
      onError(e);
    }

    try {
      subscriptions.push(
        client.addMessageListener(
          methodAck.getRecords,
          ({ result }: { result: string[] }) => {
            setRecords(result);
            setLoading(false);
          }
        )
      );
    } catch (e) {
      onError(e);
    }

    try {
      subscriptions.push(
        client.addMessageListener(
          methodAck.getCount,
          ({ result }: { result: number }) => {
            setTotalCount(result);
          }
        )
      );
    } catch (e) {
      onError(e);
    }

    try {
      subscriptions.push(
        client.addMessageListener(
          methodAck.getColumns,
          ({ result }: { result: Column[] }) => {
            setColumns(result);
          }
        )
      );
    } catch (e) {
      onError(e);
    }

    try {
      subscriptions.push(
        client.addMessageListener(
          methodAck.addNewRecord,
          ({ result }: { result: boolean }) => {
            if (result) {
              fetchTableRecords(selectedTable, page * limit, limit);
            }
          }
        )
      );
    } catch (e) {
      onError(e);
    }

    subscriptions.push(
      client.addMessageListener("error", ({ error }: { error: unknown }) => {
        onError(error);
      })
    );

    return () => {
      for (const subscription of subscriptions) {
        try {
          subscription?.remove();
        } catch (e) {
          onError(e);
        }
      }
    };
  }, [client]);

  return {
    tables,
    selectedTable,
    records,
    columns,
    page,
    limit,
    totalCount,
    loading,
    setSelectedTable,
    setPage,
    setLimit,
    addNewRecord,
    refreshTableRecords,
  };
}
