import { ID, databases, storage } from '@/appwrite';
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn';
import uploadData from '@/lib/uploadData';
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand'

interface BoardState{
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDB: (todo: Todo, columnID: TypedColumn) => void;
    newTaskInput: string;
    newTaskType: TypedColumn;
    image: File | null;
    projdata: File | null;
    

    searchString: string;
    setSearchString: (searchString: string) => void;

    addTask: (todo:string, columnId: TypedColumn, image?: File| null, projdata?: File | null) => void;
    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;

    setNewTaskInput: (input:string) => void;
    setNewTaskType: (columnId: TypedColumn) => void;
    setImage: (image: File | null) => void;
    setProjData: (projdata: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>()
  },
  
  searchString: "",
  newTaskInput: "",
  setSearchString:(searchString) => set({ searchString }),
  newTaskType: "todo",
  image: null,
  projdata: null,

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({board}),

  updateTodoInDB: async(todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLETION_ID!,
      todo.$id,{
        title: todo.title,
        status: columnId,
      }
    )
  },

  setNewTaskInput: (input:string) => set({newTaskInput: input}),
  setNewTaskType: (columnId:TypedColumn) => set({ newTaskType: columnId}),
  setImage: (image: File | null) => set({ image }),
  setProjData: (projdata: File | null) => set({ projdata }),

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null, projdata?: File | null) => {
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

    const { $id} = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLETION_ID!,
      ID.unique(),{
        title: todo,
        status: columnId,
        //if image exists
        ...(file && { image: JSON.stringify(file)}),
        ...(dataFile && {projdata: JSON.stringify(dataFile)}),
      }
    );

    set({ newTaskInput: ""});

    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        //if eists
        ...(file && { image: file}),
        ...(dataFile && { projdata: dataFile}),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      } return {
        board: {
          columns: newColumns,
        }
      }
    })
  },

  deleteTask: async (taskIndex: number, todo: Todo, id:TypedColumn) => {
    const newColumns = new Map(get().board.columns);

    newColumns.get(id)?.todos.splice(taskIndex, 1 );

    set({ board: {columns: newColumns } });

    if(todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLETION_ID!,
      todo.$id
    );
  },
}))

