export interface TodoItem {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateTodoRequest {
  title: string;
}

export interface UpdateTodoRequest {
  title: string;
  isCompleted: boolean;
}