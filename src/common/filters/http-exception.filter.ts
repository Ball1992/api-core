import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "เกิดข้อผิดพลาดภายในระบบ";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || message;

        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(", ");
        }
      }
    }

    const errorResponse = {
      responseStatus: status,
      responseMessage: this.getErrorMessage(status, message),
      data: null,
    };

    response.status(status).json(errorResponse);
  }

  private getErrorMessage(status: number, originalMessage: string): string {
    switch (status) {
      case 400:
        return "ข้อมูลไม่ถูกต้อง";
      case 401:
        return "ไม่ได้รับอนุญาตให้เข้าใช้งาน";
      case 403:
        return "ไม่มีสิทธิ์เข้าถึง";
      case 404:
        return "ไม่พบข้อมูลที่ต้องการ";
      case 409:
        return "ข้อมูลซ้ำกัน";
      case 422:
        return "ข้อมูลไม่ถูกต้อง";
      case 500:
        return "เกิดข้อผิดพลาดภายในระบบ";
      default:
        return originalMessage;
    }
  }
}
