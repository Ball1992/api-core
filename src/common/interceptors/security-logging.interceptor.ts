import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {
  suspiciousPatterns,
  SecurityEventType,
} from "../security/security-config";

@Injectable()
export class SecurityLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("SecurityLogging");

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params, ip, headers } = request;
    const userAgent = headers["user-agent"] || "";
    const now = Date.now();

    // Check for suspicious patterns
    const requestData = JSON.stringify({ body, query, params });
    this.checkSuspiciousPatterns(requestData, ip, userAgent, url);

    return next.handle().pipe(
      tap({
        next: (_data) => {
          const responseTime = Date.now() - now;
          if (responseTime > 5000) {
            this.logger.warn(
              `Slow response detected: ${method} ${url} - ${responseTime}ms`,
            );
          }
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logSecurityEvent({
            type: this.getSecurityEventType(error),
            method,
            url,
            ip,
            userAgent,
            responseTime,
            error: error.message,
          });
        },
      }),
    );
  }

  private checkSuspiciousPatterns(
    data: string,
    ip: string,
    userAgent: string,
    url: string,
  ): void {
    // Check for SQL injection patterns
    if (suspiciousPatterns.sqlInjection.test(data)) {
      this.logSecurityEvent({
        type: SecurityEventType.SQL_INJECTION_ATTEMPT,
        ip,
        userAgent,
        url,
        pattern: "SQL Injection",
        data: data.substring(0, 200), // Log first 200 chars
      });
    }

    // Check for XSS patterns
    if (suspiciousPatterns.xss.test(data)) {
      this.logSecurityEvent({
        type: SecurityEventType.XSS_ATTEMPT,
        ip,
        userAgent,
        url,
        pattern: "XSS",
        data: data.substring(0, 200),
      });
    }

    // Check for path traversal
    if (suspiciousPatterns.pathTraversal.test(data)) {
      this.logSecurityEvent({
        type: SecurityEventType.SUSPICIOUS_REQUEST,
        ip,
        userAgent,
        url,
        pattern: "Path Traversal",
        data: data.substring(0, 200),
      });
    }

    // Check for command injection
    if (suspiciousPatterns.commandInjection.test(data)) {
      this.logSecurityEvent({
        type: SecurityEventType.SUSPICIOUS_REQUEST,
        ip,
        userAgent,
        url,
        pattern: "Command Injection",
        data: data.substring(0, 200),
      });
    }
  }

  private getSecurityEventType(error: any): SecurityEventType {
    if (error.status === 401) {
      return SecurityEventType.UNAUTHORIZED_ACCESS;
    }
    if (error.status === 429) {
      return SecurityEventType.RATE_LIMIT_EXCEEDED;
    }
    return SecurityEventType.SUSPICIOUS_REQUEST;
  }

  private logSecurityEvent(event: any): void {
    this.logger.error(`[SECURITY EVENT] ${JSON.stringify(event)}`);

    // Here you could also:
    // - Send to external logging service (e.g., Sentry, LogRocket)
    // - Store in database for audit trail
    // - Send alerts for critical events
    // - Block IP after multiple violations
  }
}
