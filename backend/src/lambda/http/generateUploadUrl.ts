import "source-map-support/register";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda";
import { successResponse, getUserId } from "../../utils/utils";
import { generateUploadUrl } from "../../businessLogic/todos";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const authHeader = event.headers["Authorization"];
  const userId = getUserId(authHeader);
  const response = generateUploadUrl(todoId, userId);

  if (typeof response == "string")
    return successResponse(200, "uploadUrl", response);
  return response;
};
