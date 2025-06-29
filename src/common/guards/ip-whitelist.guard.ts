import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { adminIpWhitelist } from "../security/security-config";

@Injectable()
export class IpWhitelistGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiresWhitelist = this.reflector.get<boolean>(
      "requiresIpWhitelist",
      context.getHandler(),
    );

    if (!requiresWhitelist) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const clientIp = this.getClientIp(request);

    if (!this.isIpWhitelisted(clientIp)) {
      throw new ForbiddenException(`Access denied from IP: ${clientIp}`);
    }

    return true;
  }

  private getClientIp(request: any): string {
    // Check for various headers that might contain the real IP
    const forwardedFor = request.headers["x-forwarded-for"];
    if (forwardedFor) {
      // x-forwarded-for may contain multiple IPs, take the first one
      return forwardedFor.split(",")[0].trim();
    }

    // Check other common headers
    return (
      request.headers["x-real-ip"] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip
    );
  }

  private isIpWhitelisted(ip: string): boolean {
    // Handle IPv6 localhost
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      return (
        adminIpWhitelist.includes("127.0.0.1") ||
        adminIpWhitelist.includes("::1")
      );
    }

    // Direct IP check
    return adminIpWhitelist.includes(ip);
  }
}

// Decorator to mark endpoints that require IP whitelist
export function RequireIpWhitelist() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata("requiresIpWhitelist", true, descriptor.value);
    return descriptor;
  };
}
