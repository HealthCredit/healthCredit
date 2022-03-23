import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class projectIdDto {
  @IsNotEmpty()
  projectId: number;

  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  walletAddress: string;
}
