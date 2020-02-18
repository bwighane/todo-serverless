import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";
import { UpdateTodoRequest } from "../../requests/UpdateTodoRequest";
import {
  errorSuccessResponse,
  getUserId
} from "../../utils/utils";

import { updateTodo } from "../../businessLogic/todos";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
  const authHeader = event.headers["Authorization"];
  const userId = getUserId(authHeader);

  await updateTodo(updatedTodo, todoId, userId);

  return errorSuccessResponse(204);
};
