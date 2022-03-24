import { IsString, IsNotEmpty, IsEthereumAddress } from 'class-validator';

export class approveProjectDto {
  @IsNotEmpty()
  projectId: number;
}
