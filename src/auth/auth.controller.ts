import { Controller, Post, Body, UseGuards, Get, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { LogoutDto } from "./dto/logout.dto";
import { Public } from "../common/decorators/public.decorator";
import { User } from "../common/decorators/user.decorator";
import { RequestUser } from "../common/interfaces/user.interface";

@ApiTags("Authentication")
@Controller("auth")
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Login with email and password" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post("register")
  @ApiOperation({ summary: "Register new user" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 400, description: "User already exists" })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post("refresh")
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({ status: 200, description: "Token refreshed successfully" })
  @ApiResponse({ status: 401, description: "Invalid refresh token" })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post("logout")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Logout user" })
  @ApiResponse({ status: 200, description: "Logout successful" })
  async logout(@Body() logoutDto: LogoutDto) {
    if (logoutDto.refreshToken) {
      await this.authService.logout(logoutDto.refreshToken);
    }
    return { message: "Logout successful" };
  }

  @Get("profile")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "Profile retrieved successfully" })
  async getProfile(@User() user: RequestUser) {
    return user;
  }

  @Public()
  @Get("azure")
  @UseGuards(AuthGuard("azure-ad"))
  @ApiOperation({ summary: "Azure AD OAuth login" })
  async azureLogin() {
    // This endpoint initiates Azure AD OAuth flow
  }

  @Public()
  @Get("azure/callback")
  @UseGuards(AuthGuard("azure-ad"))
  @ApiOperation({ summary: "Azure AD OAuth callback" })
  async azureCallback(@Req() req: any) {
    // Handle Azure AD callback and generate JWT tokens
    const user = req.user;

    // Generate JWT tokens for Azure user
    const _payload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
      loginMethod: user.loginMethod,
    };

    // You would implement token generation here similar to local login
    return {
      message: "Azure login successful",
      user: user,
    };
  }
}
