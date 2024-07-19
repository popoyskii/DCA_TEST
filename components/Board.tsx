"use client";
import { useBoardStore } from "@/store/BoardStore";
import { useAuthStore } from "@/store/AuthStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

function Board() {
  const [
    board,
    getBoard,
    setBoardState,
    updateTodoInDB,
    archiveOldItems,
    loading,
    successMessage,
    errorMessage,
  ] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
    state.updateTodoInDB,
    state.archiveOldItems,
    state.loading,
    state.successMessage,
    state.errorMessage,
  ]);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      getBoard();
    }
  }, [getBoard, isAuthenticated]);

  useEffect(() => {
    if (board.columns.size > 0) {
      archiveOldItems();
    }
  }, [board, archiveOldItems]);

  if (!isAuthenticated) {
    return null; // Or you can return a message or redirect to the login page
  }

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // dragged outside of board
    if (!destination) return;

    // handle column drag
    if (type === "column") {
      return; // Disable column dragging
    }

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    // Allow movement within the same column
    if (startCol.id === finishCol.id) {
      const newTodos = Array.from(startCol.todos);
      const [movedTodo] = newTodos.splice(source.index, 1);
      newTodos.splice(destination.index, 0, movedTodo);

      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoardState({ ...board, columns: newColumns });
      return;
    }

    // Only allow movement to the next column
    const allowedMoves: { [key in TypedColumn]: TypedColumn } = {
      proposed: "todo",
      todo: "inprogress",
      inprogress: "done",
      done: "done", // No further movement
    };

    if (allowedMoves[startCol.id] !== finishCol.id) {
      return;
    }

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    // drag to another column
    const finishTodos = Array.from(finishCol.todos);
    finishTodos.splice(destination.index, 0, todoMoved);

    const newColumns = new Map(board.columns);
    const newCol = {
      id: startCol.id,
      todos: newTodos,
    };

    newColumns.set(startCol.id, newCol);
    newColumns.set(finishCol.id, {
      id: finishCol.id,
      todos: finishTodos,
    });
    console.log("SOURCE: ", source);
    console.log("DEST: ", destination);
    console.log("TYPE:", type);

    // update in DB
    updateTodoInDB(todoMoved, finishCol.id);
    setBoardState({ ...board, columns: newColumns });
  };

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-5 max-w-7xl mx-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {Array.from(board.columns.entries()).map(
                ([id, column], index) => (
                  <Column key={id} id={id} todos={column.todos} index={index} />
                )
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

export default Board;
