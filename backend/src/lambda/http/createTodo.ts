import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";
import { CreateTodoRequest } from "../../requests/createTodoRequest";
import { TodoDataLayer } from "../../dataLayer/TodoDataLayer";
import { successResponse, getUserId } from "../../utils/utils";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);

  const authHeader = event.headers["Authorization"];
  const userId = getUserId(authHeader);
  const item = await new TodoDataLayer().createTodo(newTodo, userId);

  return successResponse(201, "item", item);
};
