import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class uCidDto {
  @IsString()
  @IsNotEmpty()
  cid: string;

  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  walletAddress: string;
}
