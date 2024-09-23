"use client";
import { useBoardStore } from "@/store/BoardStore";
import { useAuthStore } from "@/store/AuthStore";
import { useEffect, useState } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import DateModal from "./DateModal";

function Board() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState("");
  const [
    board,
    getBoard,
    setBoardState,
    updateTodoInDB,
    archiveOldItems,
    loading,
    successMessage,
    errorMessage,
    completedProject,
  ] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState,
    state.updateTodoInDB,
    state.archiveOldItems,
    state.loading,
    state.successMessage,
    state.errorMessage,
    state.completedProject,
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
      const columns = Array.from(board.columns);
      const dataIndex = columns[2];
      const data: Column = {
        id: dataIndex[1].id,
        todos: dataIndex[1].todos,
      };
      trackingDate(data);
    }
  }, [board, archiveOldItems]);

  const trackingDate = (data: Column) => {
    data.todos.map((item, key) => {
      const today = new Date();
      if (item.endDate) {
        const dateString = item.endDate.toString();
        const date1 = new Date(
          dateString.replace("T", " ").replace(/\..+/, "")
        );
        console.log("end date: ", date1.getTime());
        console.log("today: ", today.getTime());

        if (date1.getTime() <= today.getTime()) {
          completedProject(item.$id);
        }
      }
    });
  };

  if (!isAuthenticated) {
    return null; // Or you can return a message or redirect to the login page
  }

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

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

    const allowedMoves: { [key in TypedColumn]: TypedColumn } = {
      proposed: "todo",
      todo: "inprogress",
      inprogress: "done",
      done: "done",
    };

    if (allowedMoves[startCol.id] !== finishCol.id) {
      return;
    }

    if (startCol.id === "todo" || finishCol.id === "inprogress") {
      const selectedId = startCol.todos[source.index].$id;
      setSelectedId(selectedId);
      setOpen(true);
    } else {
      const newTodos = startCol.todos;
      const [todoMoved] = newTodos.splice(source.index, 1);
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

      // update in DB
      updateTodoInDB(todoMoved, finishCol.id, `Moved to ${finishCol.id}`);
      setBoardState({ ...board, columns: newColumns });
    }
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
        <DateModal isOpen={isOpen} setOpen={setOpen} selectedId={selectedId} />
      </DragDropContext>
    </>
  );
}

export default Board;
