import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { BearerStrategy } from "passport-azure-ad";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "../auth.service";

@Injectable()
export class AzureStrategy extends PassportStrategy(
  BearerStrategy,
  "azure-ad",
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      identityMetadata: `https://login.microsoftonline.com/${configService.get("AZURE_TENANT_ID")}/v2.0/.well-known/openid_configuration`,
      clientID: configService.get("AZURE_CLIENT_ID"),
      validateIssuer: true,
      loggingLevel: "info",
      passReqToCallback: false,
    });
  }

  async validate(profile: any): Promise<any> {
    const user = await this.authService.validateAzureUser(profile);
    return user;
  }
}
