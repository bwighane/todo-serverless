import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda";
import { createLogger } from "../../utils/logger";
import {
  errorResponse,
  errorSuccessResponse,
  getUserId
} from "../../utils/utils";
import { deleteTodo } from "../../businessLogic/todos";

const logger = createLogger("todos");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  if (!todoId) {
    logger.error("invalid delete attempt without todo id");
    return errorResponse(400, "invalid parameters");
  }

  const authHeader = event.headers["Authorization"];
  const userId = getUserId(authHeader);
  const response = await deleteTodo(todoId, userId);
  if (response instanceof Object) return response;
  return errorSuccessResponse(204);
};
