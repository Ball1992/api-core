import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { SettingsService } from "./settings.service";
import { Public } from "../common/decorators/public.decorator";

@ApiTags("Settings")
@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Get system settings" })
  async getSettings() {
    return this.settingsService.getSettings();
  }
}
