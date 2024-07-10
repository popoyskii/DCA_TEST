import { ID, databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadData from '@/lib/uploadData';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand';
import { toast } from 'react-toastify';

interface BoardState {
  board: Board;
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnID: TypedColumn) => void;
  newTaskInput: string;
  newTaskType: TypedColumn;
  image: File | null;
  projdata: File | null;
  fileType: string;

  searchString: string;
  setSearchString: (searchString: string) => void;

  addTask: (
    todo: string,
    columnId: TypedColumn,
    image?: File | null,
    projdata?: File | null,
    fileType?: string
  ) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;

  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  setImage: (image: File | null) => void;
  setProjData: (projdata: File | null) => void;
  setFileType: (fileType: string) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  loading: false,
  successMessage: null,
  errorMessage: null,
  
  searchString: '',
  newTaskInput: '',
  setSearchString: (searchString) => set({ searchString }),
  newTaskType: 'todo',
  image: null,
  projdata: null,
  fileType: '',

  getBoard: async () => {
    set({ loading: true });
    toast.info('Loading board...');
    try {
      const board = await getTodosGroupedByColumn();
      set({ board, loading: false });
      toast.success('Board loaded successfully');
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to load board');
    }
  },

  setBoardState: (board) => set({ board }),

  setFileType: (fileType) => set({ fileType }),

  updateTodoInDB: async (todo, columnId) => {
    set({ loading: true });
    toast.info('Updating todo...');
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
      set({ successMessage: 'Todo updated successfully', loading: false });
      toast.success('Todo updated successfully');
    } catch (error) {
      set({ errorMessage: 'Failed to update todo', loading: false });
      toast.error('Failed to update todo');
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
    toast.info('Adding task...');
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
          //if image exists
          ...(file && { image: JSON.stringify(file) }),
          ...(dataFile && { projdata: JSON.stringify(dataFile) }),
        }
      );

      set({ newTaskInput: '' });

      set((state) => {
        const newColumns = new Map(state.board.columns);

        const newTodo: Todo = {
          $id,
          $createdAt: new Date().toISOString(),
          title: todo,
          status: columnId,
          //if exists
          ...(file && { image: file }),
          ...(dataFile && { projdata: dataFile }),
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
          successMessage: 'Task added successfully',
          loading: false,
        };
      });
      toast.success('Task added successfully');
    } catch (error) {
      set({ errorMessage: 'Failed to add task', loading: false });
      toast.error('Failed to add task');
    }
  },

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    set({ loading: true });
    toast.info('Deleting task...');
    try {
      const newColumns = new Map(get().board.columns);

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
      set({ successMessage: 'Task deleted successfully', loading: false });
      toast.success('Task deleted successfully');
    } catch (error) {
      set({ errorMessage: 'Failed to delete task', loading: false });
      toast.error('Failed to delete task');
    }
  },
}));
