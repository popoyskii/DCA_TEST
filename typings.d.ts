interface  Board{
    columns: Map<TypedColumn, Column>
}

type TypedColumn = "todo" | "inprogress" | "done";

interface Column{
    id: TypedColumn,
    todos: Todo[]
}

interface Todo {
    $id: string;
    $createdAt: string;
    title: string;
    status: TypedColumn;
    image?: Image;
    data?: ProjData;
}

interface Image {
    bucketId: string;
    fileId: string;
}

interface ProjData{
    bucketId: string;
    fileId: string;
}