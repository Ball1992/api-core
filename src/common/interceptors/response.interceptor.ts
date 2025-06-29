import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { format } from "date-fns";

export interface Response<T> {
  responseStatus: number;
  responseMessage: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        responseStatus: response.statusCode,
        responseMessage: this.getSuccessMessage(response.statusCode),
        data: this.transformData(data),
      })),
    );
  }

  private transformData(data: any): any {
    if (data === null || data === undefined) {
      return "";
    }

    if (data instanceof Date) {
      return format(data, "dd/MM/yyyy HH:mm:ss");
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.transformData(item));
    }

    if (typeof data === "object" && data !== null) {
      const transformed: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          transformed[key] = this.transformData(data[key]);
        }
      }
      return transformed;
    }

    return data;
  }

  private getSuccessMessage(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return "ดำเนินการสำเร็จ";
      case 201:
        return "สร้างข้อมูลสำเร็จ";
      case 204:
        return "ลบข้อมูลสำเร็จ";
      default:
        return "ดำเนินการสำเร็จ";
    }
  }
}
