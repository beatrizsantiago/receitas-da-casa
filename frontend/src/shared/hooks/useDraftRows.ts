import { useState } from 'react';

export interface DraftRow<TFields> {
  tempId: string;
  serverId?: number;
  fields: TFields;
}

let counter = 0;

/**
 * Local editable-list state shared by the recipe sub-resource editors
 * (ingredients, notes, ...): each server item becomes a draft row keyed by a
 * stable tempId, new rows get a temp-only id, and removed rows are tracked
 * by serverId so the caller can delete them on save. The create/update
 * diffing itself stays with each caller since what counts as "changed" or
 * "empty" differs per resource.
 */
export function useDraftRows<TServer, TFields extends object>(
  items: TServer[],
  toRow: (item: TServer) => { serverId: number; fields: TFields },
) {
  const [rows, setRows] = useState<DraftRow<TFields>[]>(() =>
    items.map((item) => {
      const { serverId, fields } = toRow(item);
      return { tempId: `existing-${serverId}`, serverId, fields };
    })
  );
  const [deletedIds] = useState(() => new Set<number>());

  function addRow(fields: TFields) {
    setRows((prev) => [...prev, { tempId: `new-${++counter}`, fields }]);
  }

  function updateRow(tempId: string, patch: Partial<TFields>) {
    setRows((prev) =>
      prev.map((r) => (r.tempId === tempId ? { ...r, fields: { ...r.fields, ...patch } } : r))
    );
  }

  function removeRow(row: DraftRow<TFields>) {
    setRows((prev) => prev.filter((r) => r.tempId !== row.tempId));
    if (row.serverId !== undefined) {
      deletedIds.add(row.serverId);
    }
  }

  return { rows, setRows, deletedIds, addRow, updateRow, removeRow };
}
