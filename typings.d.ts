interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "proposed" | "todo" | "inprogress" | "done";

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: Image;
  projdata?: ProjData;
  fileType?: string;
  convertedData?: string;
  percentageUsed: number;
  threadID?: string;
  msgID?: string;
  startDate?: Date;
  endDate?: Date;
}

interface Image {
  bucketId: string;
  fileId: string;
}

interface ProjData {
  bucketId: string;
  fileId: string;
}

interface User {
  $id: string;
  username: string;
  password: string;
  position: string;
}

interface ChartDataItem {
  category: string;
  cost: number;
}

interface CostChartProps {
  data: ChartDataItem[];
}

interface Changelog {
  $id: string;
  todoId: string;
  changes: string;
  timestamp: string;
  userId: string;
}
