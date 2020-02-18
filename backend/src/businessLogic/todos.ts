import { TodoDataLayer } from "../dataLayer/TodoDataLayer";
import { TodoItem } from "../models/todoItem";
import { CreateTodoRequest } from "../requests/createTodoRequest";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { getUserId, errorResponse } from "../utils/utils";
import { createLogger } from "../utils/logger";
import { S3Helper } from "../utils/s3Helper";

const todoDataLayer = new TodoDataLayer();
const logger = createLogger("todos");

export async function getUserTodos(userId: string): Promise<TodoItem[]> {
  return todoDataLayer.getUserTodos(userId);
}

export async function createTodo(
  request: CreateTodoRequest,
  authHeader: string
): Promise<TodoItem> {
  const userId = getUserId(authHeader);
  return todoDataLayer.createTodo(request, userId);
}

export async function deleteTodo(todoId: string, userId: string): Promise<any> {
  const item = await todoDataLayer.getTodoById(todoId);
  if (item.Count == 0) {
    logger.error(
      `user ${userId} requesting delete for non exists todo with id ${todoId}`
    );
    return errorResponse(400, "TODO not exists");
  }

  if (item.Items[0].userId !== userId) {
    logger.error(
      `user ${userId} requesting delete todo does not belong to his account with id ${todoId}`
    );
    return errorResponse(400, "TODO does not belong to authorized user");
  }

  logger.info(`User ${userId} deleting todo ${todoId}`);
  await todoDataLayer.deleteTodoById(todoId);
}

export async function updateTodo(
  updatedTodo: UpdateTodoRequest,
  todoId: string,
  userId: string
): Promise<any> {
  const item = await todoDataLayer.getTodoById(todoId);

  if (item.Count == 0) {
    logger.error(
      `user ${userId} requesting update for non exists todo with id ${todoId}`
    );
    return errorResponse(400, "TODO not exists");
  }

  if (item.Items[0].userId !== userId) {
    logger.error(
      `user ${userId} requesting update todo does not belong to his account with id ${todoId}`
    );
    return errorResponse(400, "TODO does not belong to authorized user");
  }

  logger.info(`User ${userId} updating group ${todoId} to be ${updatedTodo}`);
  await todoDataLayer.updateTodo(updatedTodo, todoId);
}

export async function generateUploadUrl(
  todoId: string,
  userId: string
): Promise<any> {
  const item = await todoDataLayer.getTodoById(todoId);
  if (item.Count == 0) {
    logger.error(
      `user ${userId} requesting put url for non exists todo with id ${todoId}`
    );
    return errorResponse(400, "TODO not exists");
  }

  if (item.Items[0].userId !== userId) {
    logger.error(
      `user ${userId} requesting put url todo does not belong to his account with id ${todoId}`
    );
    return errorResponse(400, "TODO does not belong to authorized user");
  }

  const url = new S3Helper().getPresignedUrl(todoId);
  return url;
}
