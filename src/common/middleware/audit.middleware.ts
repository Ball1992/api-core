import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log(`[AuditMiddleware] Request: ${req.method} ${req.path}`);

    const user = req.user as any;
    console.log(`[AuditMiddleware] User:`, user ? user.email : "No user");

    // Include GET requests for view actions
    if (
      user &&
      ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(req.method)
    ) {
      const originalSend = res.send;

      const prisma = this.prisma; // Capture prisma instance

      res.send = function (data) {
        // Log activity after successful response
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setImmediate(async () => {
            try {
              const action = getActionFromMethod(req.method);
              const module = getModuleFromPath(req.path);

              // Skip logging for certain paths
              const skipPaths = [
                "/api/v1/audit/activity",
                "/api/v1/audit/logs",
              ];
              if (skipPaths.some((path) => req.path.includes(path))) {
                return;
              }

              console.log(
                `[AuditMiddleware] Logging activity: ${action} ${module} by ${user.email}`,
              );

              await prisma.sys_log_activity.create({
                data: {
                  user_id: user.id,
                  action,
                  module,
                  target_id: extractTargetId(req.path, req.body),
                  description: `${action} ${module}`,
                  ip_address: req.ip || "::1",
                  user_agent: req.get("User-Agent") || "Unknown",
                  created_by: user.id,
                  created_by_name: `${user.first_name} ${user.last_name}`,
                },
              });

              console.log(`[AuditMiddleware] Activity logged successfully`);
            } catch (error) {
              console.error("[AuditMiddleware] Failed to log activity:", error);
            }
          });
        }

        return originalSend.call(this, data);
      };
    }

    next();
  }
}

function getActionFromMethod(method: string): any {
  switch (method) {
    case "POST":
      return "create";
    case "PUT":
    case "PATCH":
      return "update";
    case "DELETE":
      return "delete";
    default:
      return "view";
  }
}

function getModuleFromPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  // Skip 'api' and 'v1' prefixes
  const moduleIndex = segments.findIndex((s) => s !== "api" && s !== "v1");
  return segments[moduleIndex] || "unknown";
}

function extractTargetId(path: string, body: any): string | null {
  // Extract ID from path like /users/123
  const pathMatch = path.match(/\/([^\/]+)\/([a-zA-Z0-9-]+)$/);
  if (pathMatch) {
    return pathMatch[2];
  }

  // Extract ID from body
  if (body && body.id) {
    return body.id;
  }

  return null;
}
