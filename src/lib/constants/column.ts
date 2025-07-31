export const columns = [
  { key: "open", title: "Open" },
  { key: "inprogress", title: "In Progress" },
  { key: "inreview", title: "In Review" },
  { key: "closed", title: "Closed" },
] as const;

export type ColumnKey = typeof columns[number]["key"];

export type Column = typeof columns[number];
