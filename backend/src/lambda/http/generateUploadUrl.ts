import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda";
import { S3Helper } from "../../utils/s3Helper";
import { TodoDataLayer } from "../../dataLayer/TodoDataLayer";
import { createLogger } from "../../utils/logger";
import {
  errorResponse,
  successResponse,
  getUserId
} from "../../utils/utils";

const todosAccess = new TodoDataLayer();
const logger = createLogger("todos");

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const authHeader = event.headers["Authorization"];
  const userId = getUserId(authHeader);

  const item = await todosAccess.getTodoById(todoId);
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
    return errorResponse(
      400,
      "TODO does not belong to authorized user"
    );
  }

  const url = new S3Helper().getPresignedUrl(todoId);
  return successResponse(200, "uploadUrl", url);
};
