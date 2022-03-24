import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class updateCidDto {
  @IsString()
  @IsNotEmpty()
  cid: string;

  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  walletAddress: string;
}
