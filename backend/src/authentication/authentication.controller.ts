import {
  Body,
  Get,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Nonce, Tokens } from './types/index';
import { WalletDto, SignatureDto, AuthDto } from './dto/index';
import { AuthenticationService } from './authentication.service';
import { AtGuard, RtGuard } from '../common/guards';
import { GetCurrentUserId } from '../common/decorator';

@Controller('api')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Get('nonce')
  generateNonce(@Body() walletData: WalletDto): Promise<object> {
    return this.authService.generateNonce(walletData);
  }

  @Post('signature')
  verifySignature(@Body() signatureDto: SignatureDto): Promise<boolean> {
    return this.authService.verifySignature(signatureDto);
  }

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  authenticate(@Body() dto: AuthDto): Promise<object> {
    return this.authService.authenticate(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }
}
