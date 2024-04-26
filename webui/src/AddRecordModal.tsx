import { Form, Input, Modal } from "antd";
import React, { useState } from "react";
import { Column } from "../../types";

type Props = {
  columns: Column[];
  open: boolean;
  onCancel: () => void;
  onOk: (record: any) => void;
};

export default function AddRecordModal({
  columns,
  open,
  onCancel,
  onOk,
}: Props) {
  const [record, setRecord] = useState<Record<string, any>>({});

  return (
    <Modal
      title="Add Record"
      open={open}
      onOk={() => onOk(record)}
      onCancel={onCancel}
    >
      <Form layout="vertical">
        {columns.map(({ name, type, isOptional }) => (
          <Form.Item
            key={name}
            label={name}
            rules={[{ type }]}
            required={!isOptional}
          >
            <Input
              value={record[name]}
              onChange={(e) =>
                setRecord((prevRecord) => ({
                  ...prevRecord,
                  [name]: e.target.value,
                }))
              }
            />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}
