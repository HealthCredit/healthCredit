import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class projectIdDto {
  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  walletAddress: string;

  @IsNotEmpty()
  projectId: number;
}
