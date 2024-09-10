import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadData from "@/lib/uploadData";
import uploadImage from "@/lib/uploadImage";
import { create } from "zustand";
import { toast } from "react-toastify";
import addChangelog from "@/lib/addChangelog";

interface BoardState {
  board: Board;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnID: TypedColumn, changes: string) => void;
  moveToNextState: (
    todoId: string,
    nextState: TypedColumn,
    percentageUsed?: number
  ) => void;
  newTaskInput: string;
  newTaskType: TypedColumn;
  image: File | null;
  projdata: File | null;
  fileType: string;
  archiveOldItems: () => void;
  archivedProjects: Todo[];

  searchString: string;
  setSearchString: (searchString: string) => void;
  updateConvertData: (id: string, file_id: string) => void;

  addTask: (
    todo: string,
    columnId: TypedColumn,
    image?: File | null,
    projdata?: File | null,
    fileType?: string
  ) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumn) => void;

  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  setImage: (image: File | null) => void;
  setProjData: (projdata: File | null) => void;
  setFileType: (fileType: string) => void;
  addGptRecommend: (threadId: string, msgId: string, id: string) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  loading: false,
  successMessage: null,
  errorMessage: null,

  searchString: "",
  newTaskInput: "",
  setSearchString: (searchString) => set({ searchString }),
  newTaskType: "todo",
  image: null,
  projdata: null,
  fileType: "",

  getBoard: async () => {
    set({ loading: true });
    toast.info("Loading board...");
    try {
      const board = await getTodosGroupedByColumn();
      set({ board, loading: false });
      toast.success("Board loaded successfully");
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to load board");
    }
  },
  archivedProjects: [],

  archiveOldItems: async () => {
    const { board } = get();
    const doneColumn = board.columns.get("done");

    if (doneColumn && doneColumn.todos.length > 5) {
      const newDoneTodos = doneColumn.todos.slice(0, 5);
      const archivedTodos = doneColumn.todos.slice(5);

      // Update the board state with the new done todos
      const newColumns = new Map(board.columns);
      newColumns.set("done", { id: "done", todos: newDoneTodos });

      set((state) => ({
        board: {
          columns: newColumns,
        },
        archivedProjects: [...state.archivedProjects, ...archivedTodos],
      }));

      // Optionally, you can update the database to mark these items as archived.
    }
  },

  updateConvertData: (id, file_id) => {
    console.log("update Data: ", file_id, id);
  },

  setBoardState: (board) => set({ board }),

  setFileType: (fileType) => set({ fileType }),

  updateTodoInDB: async (todo, columnId, changes) => {
    set({ loading: true });
    toast.info(`Updating ${columnId}...`);
    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLETION_ID!,
        todo.$id,
        {
          title: todo.title,
          status: columnId,
        }
      );

      const username = localStorage.getItem("username");
      if (username) {
        if (columnId === "proposed") {
          await addChangelog(todo.title, "Moved to Propose", username);
        }
        if (columnId === "todo") {
          await addChangelog(todo.title, "Moved to Todo", username);
        }
        if (columnId === "inprogress") {
          await addChangelog(todo.title, "Moved to Progress", username);
        }
        if (columnId === "done") {
          await addChangelog(todo.title, "Moved to done", username);
        }
      }

      set({ successMessage: "Todo updated successfully", loading: false });
      toast.success("Todo updated successfully");
    } catch (error) {
      set({ errorMessage: "Failed to update todo", loading: false });
      toast.error("Failed to update todo");
    }
  },

  moveToNextState: async (todoId, nextState, percentageUsed) => {
    console.log(todoId, percentageUsed);

    set({ loading: true });
    toast.info("Moving to next state...");
    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLETION_ID!,
        todoId,
        {
          status: nextState,
          percentageUsed: percentageUsed,
        }
      );

      const board = await getTodosGroupedByColumn();
      set({ board, loading: false });
      const username = localStorage.getItem("username");
      if (username) {
        await addChangelog(todoId, "Move to Todo", username);
      }
      console.log(board);
      toast.success("Moved to next state successfully");
    } catch (error) {
      set({ loading: false });
      toast.error("Failed to move to next state");
    }
  },

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  setImage: (image: File | null) => set({ image }),
  setProjData: (projdata: File | null) => set({ projdata }),

  addTask: async (
    todo: string,
    columnId: TypedColumn,
    image?: File | null,
    projdata?: File | null,
    fileType?: string
  ) => {
    set({ loading: true });
    toast.info("Adding task...");
    try {
      let file: Image | undefined;
      let dataFile: ProjData | undefined;

      if (image) {
        const fileUploaded = await uploadImage(image);
        if (fileUploaded) {
          file = {
            bucketId: fileUploaded.bucketId,
            fileId: fileUploaded.$id,
          };
        }
      }

      if (projdata) {
        const fileUploaded = await uploadData(projdata);
        if (fileUploaded) {
          dataFile = {
            bucketId: fileUploaded.bucketId,
            fileId: fileUploaded.$id,
          };
        }
      }

      const { $id } = await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLETION_ID!,
        ID.unique(),
        {
          title: todo,
          status: columnId,
          fileType: fileType,
          ...(file && { image: JSON.stringify(file) }),
          ...(dataFile && { projdata: JSON.stringify(dataFile) }),
        }
      );

      const username = localStorage.getItem("username");

      if (username) {
        if (columnId === "proposed") {
          await addChangelog(todo, "Added new Propose", username);
        }
        if (columnId === "todo") {
          await addChangelog(todo, "Added new Todo", username);
        }
        if (columnId === "inprogress") {
          await addChangelog(todo, "Added new Progress", username);
        }
        if (columnId === "done") {
          await addChangelog(todo, "Added done", username);
        }
      }

      set({ newTaskInput: "" });

      set((state) => {
        const newColumns = new Map(state.board.columns);

        const newTodo: Todo = {
          $id,
          $createdAt: new Date().toISOString(),
          title: todo,
          status: columnId,
          ...(file && { image: file }),
          ...(dataFile && { projdata: dataFile }),
          ...(fileType && { fileType: fileType }),
          percentageUsed: 0,
        };

        const column = newColumns.get(columnId);

        if (!column) {
          newColumns.set(columnId, {
            id: columnId,
            todos: [newTodo],
          });
        } else {
          newColumns.get(columnId)?.todos.push(newTodo);
        }
        return {
          board: {
            columns: newColumns,
          },
          successMessage: "Task added successfully",
          loading: false,
        };
      });
      toast.success("Task added successfully");
    } catch (error) {
      set({ errorMessage: "Failed to add task", loading: false });
      toast.error("Failed to add task");
    }
  },

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    set({ loading: true });
    toast.info("Deleting task...");
    try {
      const newColumns = new Map(get().board.columns);

      console.log(todo);

      newColumns.get(id)?.todos.splice(taskIndex, 1);

      set({ board: { columns: newColumns } });

      if (todo.image) {
        await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
      }

      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLETION_ID!,
        todo.$id
      );

      const username = localStorage.getItem("username");
      if (username) {
        if (todo.status === "proposed") {
          await addChangelog(todo.title, "Deleted Propose", username);
        }
        if (todo.status === "todo") {
          await addChangelog(todo.title, "Deleted Todo", username);
        }
        if (todo.status === "inprogress") {
          await addChangelog(todo.title, "Deleted Progress", username);
        }
        if (todo.status === "done") {
          await addChangelog(todo.title, "Deleted done", username);
        }
      }

      set({ successMessage: "Task deleted successfully", loading: false });
      toast.success("Task deleted successfully");
    } catch (error) {
      set({ errorMessage: "Failed to delete task", loading: false });
      toast.error("Failed to delete task");
    }
  },
  addGptRecommend: async (threadId: string, msgId: string, id: string) => {
    console.log(id, threadId);

    set({ loading: true });
    try {
      await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLETION_ID!,
        id,
        {
          threadID: threadId,
          msgID: msgId,
          // percentageUsed: percentageUsed,
        }
      );

      const board = await getTodosGroupedByColumn();
      set({ board, loading: false });
      // toast.success("Moved to next state successfully");
    } catch (error) {
      set({ loading: false });
      // toast.error("Failed to move to next state");
    }
  },
}));
