import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthDto } from '../authentication/dto';
import { DataService } from './data.service';
import { CidDto } from './dto/cid.dto';

@Controller('api/data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('upload')
  storeFiles(@Body() dto: AuthDto): Promise<any> {
    return this.dataService.storeFiles(dto);
  }

  @Get('check')
  async checkStatus(@Body() dto: CidDto): Promise<any> {
    return this.dataService.checkStatus(dto);
  }

  @Get('retrieveMetadata')
  async retrieve(@Body() dto: AuthDto): Promise<any> {
    return this.dataService.retrieveMetadata(dto);
  }
}
