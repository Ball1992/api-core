import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const user = request.user;

    // Skip if no user or if it's a public route
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!user || isPublic) {
      return next.handle();
    }

    // Skip audit endpoints to prevent infinite loops
    const skipPaths = ['/api/v1/audit/activity', '/api/v1/audit/logs'];
    if (skipPaths.some(path => request.path.includes(path))) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async () => {
        // Only log successful responses
        if (response.statusCode >= 200 && response.statusCode < 300) {
          try {
            const action = this.getActionFromMethod(request.method);
            const module = this.getModuleFromPath(request.path);
            
            console.log(`[AuditInterceptor] Logging activity: ${action} ${module} by ${user.email}`);
            
            await this.prisma.sys_log_activity.create({
              data: {
                user_id: user.id,
                action,
                module,
                target_id: this.extractTargetId(request.path, request.body),
                description: `${action} ${module}`,
                ip_address: request.ip || '::1',
                user_agent: request.get('User-Agent') || 'Unknown',
                created_by: user.id,
                created_by_name: `${user.first_name} ${user.last_name}`,
              },
            });
            
            console.log(`[AuditInterceptor] Activity logged successfully`);
          } catch (error) {
            console.error('[AuditInterceptor] Failed to log activity:', error);
          }
        }
      }),
    );
  }

  private getActionFromMethod(method: string): any {
    switch (method) {
      case 'POST':
        return 'create';
      case 'PUT':
      case 'PATCH':
        return 'update';
      case 'DELETE':
        return 'delete';
      default:
        return 'view';
    }
  }

  private getModuleFromPath(path: string): string {
    const segments = path.split('/').filter(Boolean);
    // Skip 'api' and 'v1' prefixes
    const moduleIndex = segments.findIndex(s => s !== 'api' && s !== 'v1');
    return segments[moduleIndex] || 'unknown';
  }

  private extractTargetId(path: string, body: any): string | null {
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
}
