import { Database, Q } from "@nozbe/watermelondb";
import { useDevToolsPluginClient, type EventSubscription } from "expo/devtools";
import { useCallback, useEffect } from "react";
import { Method } from "../types";

export function useWatermelonDevTools({
  database,
  errorHandler,
}: {
  database: Database;
  errorHandler?: (error: Error) => void;
}) {
  const client = useDevToolsPluginClient("watermelon-db-expo-dev-plugin");

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof Error) {
        errorHandler?.(error);
      } else {
        errorHandler?.(new Error(`Unknown error: ${String(error)}`));
      }
    },
    [errorHandler]
  );

  useEffect(() => {
    const on = <T>(event: Method, listener: (params: T) => Promise<any>) =>
      client?.addMessageListener(event, async (params: T) => {
        try {
          const result = await listener(params);

          client?.sendMessage(`ack:${event}`, { result });
        } catch (error) {
          try {
            client?.sendMessage("error", { error });
            handleError(error);
          } catch (e) {
            handleError(e);
          }
        }
      });

    const subscriptions: EventSubscription[] = [];

    try {
      subscriptions.push(
        on("collections", async () => {
          return Object.keys(database.collections.map);
        })
      );
    } catch (e) {
      handleError(e);
    }

    try {
      subscriptions.push(
        on(
          "getRecords",
          async ({
            collection,
            offset,
            limit,
          }: {
            collection?: string;
            offset?: number;
            limit?: number;
          }) => {
            if (collection !== undefined) {
              const data = await database
                .get(collection)
                .query([Q.skip(offset ?? 0), Q.take(limit ?? 50)])
                .fetch();
              return data.map((record) => record._raw);
            }
            return [];
          }
        )
      );
    } catch (e) {
      handleError(e);
    }

    try {
      subscriptions.push(
        on("getCount", async ({ collection }: { collection?: string }) => {
          if (collection !== undefined) {
            const count = await database.get(collection).query().fetchCount();
            return count;
          }
          return [];
        })
      );
    } catch (e) {
      handleError(e);
    }

    try {
      subscriptions.push(
        on("getColumns", async ({ collection }: { collection?: string }) => {
          if (collection !== undefined) {
            const count = database.get(collection).schema.columnArray;
            return count;
          }
          return [];
        })
      );
    } catch (e) {
      handleError(e);
    }

    try {
      subscriptions.push(
        on(
          "addNewRecord",
          async ({
            collection,
            record,
          }: {
            collection?: string;
            record?: any;
          }) => {
            if (collection !== undefined && record !== undefined) {
              try {
                await database.write(async () => {
                  await database.get(collection).create((entry) => {
                    Object.entries(record).forEach(([k, v]) => {
                      entry[k] = v;
                    });
                  });
                });
                return true;
              } catch {
                return false;
              }
            }
            return false;
          }
        )
      );
    } catch (e) {
      handleError(e);
    }

    return () => {
      for (const subscription of subscriptions) {
        try {
          subscription?.remove();
        } catch (e) {
          handleError(e);
        }
      }
    };
  }, [client]);
}
