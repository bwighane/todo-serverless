import { APIGatewayProxyResult } from "aws-lambda";
import { Jwt } from "../auth/Jwt";
import { decode } from "jsonwebtoken";

export function successResponse(
  statusCode: number,
  key: string,
  items: any
): APIGatewayProxyResult {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      [key]: items
    })
  };
}

export function errorSuccessResponse(
  statusCode: number
): APIGatewayProxyResult {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: null
  };
}

export function errorResponse(
  statusCode: number,
  message: string
): APIGatewayProxyResult {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({
      message
    })
  };
}

//Auth

export function getUserId(authHeader: string): string {
  console.log("authHeader", authHeader);
  const token = getToken(authHeader);
  const jwt: Jwt = decode(token, { complete: true }) as Jwt;
  console.log("jwt", jwt.payload);
  return jwt.payload.sub;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}
