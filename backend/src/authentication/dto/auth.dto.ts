import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsAlphanumeric,
  IsEthereumAddress,
  IsOptional,
} from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEthereumAddress()
  @IsOptional()
  walletAddress: string;
}
