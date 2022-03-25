import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class projectDto {
  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  walletAddress: string;

  @IsNotEmpty()
  lysamount: number;
}
