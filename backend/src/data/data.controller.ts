import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthDto } from '../authentication/dto';
import { AtGuard } from '../common/guards';
import { DataService } from './data.service';
import { CidDto } from './dto/cid.dto';
import { uCidDto } from './dto/uCid.dto';

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

  @UseGuards(AtGuard)
  @Post('updateCid')
  async updateCid(@Body() dto: uCidDto): Promise<string> {
    return this.dataService.updateCid(dto);
  }
}
