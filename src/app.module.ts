import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { RoleModule } from "./role/role.module";
import { MenuModule } from "./menu/menu.module";
import { CategoryModule } from "./category/category.module";
import { ContentModule } from "./content/content.module";
import { LabelModule } from "./label/label.module";
import { SettingsModule } from "./settings/settings.module";
import { NotificationModule } from "./notification/notification.module";
import { AuditModule } from "./audit/audit.module";
import { AuditInterceptor } from "./common/interceptors/audit.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 10, // 10 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    RoleModule,
    MenuModule,
    CategoryModule,
    ContentModule,
    LabelModule,
    SettingsModule,
    NotificationModule,
    AuditModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
