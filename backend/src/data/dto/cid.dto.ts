import { IsString, IsNotEmpty } from 'class-validator';

export class CidDto {
  @IsString()
  @IsNotEmpty()
  cid: string;
}
