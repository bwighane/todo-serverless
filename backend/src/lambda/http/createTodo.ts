import "source-map-support/register";

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from "aws-lambda";
import { CreateTodoRequest } from "../../requests/createTodoRequest";
import { successResponse } from "../../utils/utils";
import { createTodo } from "../../businessLogic/todos";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body);
  const authHeader = event.headers["Authorization"];
  const item = await createTodo(newTodo, authHeader);

  return successResponse(201, "item", item);
};
