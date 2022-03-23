import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class projectIdDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  walletAddress: string;
}
