import { NextRequest, NextResponse } from "next/server";

type HandleFunction = (req: NextRequest, params: any) => Promise<NextResponse>;
interface IValidationError {
  message: string;
}

export const catchAsyncErrors =
  (handler: HandleFunction) => async (req: NextRequest, params: any) => {
    try {
      return await handler(req, params);
    } catch (error: any) {
      if (error?.name === "CastError") {
        error.message = `Resource not found. Invalid ${error?.path}`;
        error.statusCode = 404;
      }
      if (error?.name === "ValidationError") {
        error.message = Object.values<IValidationError>(error.errors).map(
          (value) => value.message
        );
        error.statusCode = 400;
      }
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.statusCode || 500,
        }
      );
    }
  };
