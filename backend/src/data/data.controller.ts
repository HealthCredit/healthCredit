import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthDto } from '../authentication/dto';
import { AtGuard } from '../common/guards';
import { DataService } from './data.service';
import { CidDto } from './dto/cid.dto';

@Controller('api/data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('check')
  async checkStatus(@Body() dto: CidDto): Promise<any> {
    return this.dataService.checkStatus(dto);
  }

  @UseGuards(AtGuard)
  @Post('upload')
  storeFiles(@Body() dto: AuthDto): Promise<any> {
    return this.dataService.storeFiles(dto);
  }

  @UseGuards(AtGuard)
  @Post('retrieveMetadata')
  async retrieve(@Body() dto: AuthDto): Promise<any> {
    return this.dataService.retrieveMetadata(dto);
  }

  @UseGuards(AtGuard)
  @Get('fetchProjects')
  async fetchProjects(): Promise<any> {
    return this.dataService.fetchProjects();
  }
}
