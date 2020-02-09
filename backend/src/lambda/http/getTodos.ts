import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda";
import { TodoDataLayer } from "../../dataLayer/TodoDataLayer";
import { S3Helper } from "../../utils/s3Helper";
import { successResponse, getUserId } from "../../utils/utils";

const s3Helper = new S3Helper();

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authHeader = event.headers["Authorization"];
  const userId = getUserId(authHeader);
  const result = await new TodoDataLayer().getUserTodos(userId);

  for (const record of result) {
    record.attachmentUrl = await s3Helper.getTodoAttachmentUrl(record.todoId);
  }

  return successResponse(200, "items", result);
};
