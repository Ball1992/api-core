import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "../common/interfaces/user.interface";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.sys_user.findUnique({
      where: { email, is_active: true },
      include: { role: true },
    });

    if (
      user &&
      user.password_hash &&
      (await bcrypt.compare(password, user.password_hash))
    ) {
      const { password_hash: _password_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Update last login date
    await this.prisma.sys_user.update({
      where: { id: user.id },
      data: { last_login_date: new Date() },
    });

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role_id: user.role_id,
      login_method: user.login_method,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN"),
    });

    // Store refresh token
    await this.prisma.sys_refresh_token.create({
      data: {
        token: refreshToken,
        user_id: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.sys_user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Get default user role
    const defaultRole = await this.prisma.sys_role.findFirst({
      where: { name: "User" },
    });

    if (!defaultRole) {
      throw new BadRequestException("Default role not found");
    }

    const user = await this.prisma.sys_user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password_hash: hashedPassword,
        first_name: registerDto.first_name,
        last_name: registerDto.last_name,
        phone_number: registerDto.phone_number,
        login_method: "local",
        role_id: defaultRole.id,
        created_by_name: "Self Registration",
      },
      include: { role: true },
    });

    const { password_hash: _password_hash, ...result } = user;
    return result;
  }

  async refreshToken(refreshToken: string) {
    try {
      const _payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
      });

      const storedToken = await this.prisma.sys_refresh_token.findUnique({
        where: { token: refreshToken, is_active: true },
        include: { user: { include: { role: true } } },
      });

      if (!storedToken || storedToken.expires_at < new Date()) {
        throw new UnauthorizedException("Invalid refresh token");
      }

      // Invalidate old refresh token (token rotation)
      await this.prisma.sys_refresh_token.update({
        where: { id: storedToken.id },
        data: { is_active: false },
      });

      const newPayload: JwtPayload = {
        sub: storedToken.user.id,
        email: storedToken.user.email,
        role_id: storedToken.user.role_id,
        login_method: storedToken.user.login_method,
      };

      const newAccessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
        expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN"),
      });

      // Store new refresh token
      await this.prisma.sys_refresh_token.create({
        data: {
          token: newRefreshToken,
          user_id: storedToken.user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: storedToken.user.id,
          email: storedToken.user.email,
          firstName: storedToken.user.first_name,
          lastName: storedToken.user.last_name,
          role: storedToken.user.role,
        },
      };
    } catch (error) {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }

  async logout(refreshToken: string) {
    await this.prisma.sys_refresh_token.updateMany({
      where: { token: refreshToken },
      data: { is_active: false },
    });

    return { message: "Logout successful" };
  }

  async validateAzureUser(profile: any): Promise<any> {
    const email =
      profile.emails?.[0]?.value || profile.mail || profile.userPrincipalName;

    if (!email) {
      throw new BadRequestException("Email not found in Azure profile");
    }

    let user = await this.prisma.sys_user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      // Get default user role
      const defaultRole = await this.prisma.sys_role.findFirst({
        where: { name: "User" },
      });

      if (!defaultRole) {
        throw new BadRequestException("Default role not found");
      }

      // Create new user from Azure profile
      user = await this.prisma.sys_user.create({
        data: {
          email,
          azure_id: profile.id || profile.oid,
          first_name: profile.givenName || profile.given_name,
          last_name: profile.surname || profile.family_name,
          login_method: "azure",
          role_id: defaultRole.id,
          created_by_name: "Azure AD",
        },
        include: { role: true },
      });
    } else if (user.login_method !== "azure") {
      throw new BadRequestException("User exists with different login method");
    }

    return user;
  }
}
