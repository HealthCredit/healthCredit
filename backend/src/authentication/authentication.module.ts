import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies/index';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthenticationService, AtStrategy, RtStrategy],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
