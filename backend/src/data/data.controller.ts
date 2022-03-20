import { Controller, Get, Post } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('upload')
  storeFiles() {
    return this.dataService.storeFiles();
  }

  @Get('check')
  async checkStatus() {
    return this.dataService.checkStatus();
  }

  @Get('retrieve')
  async retrieve() {
    return this.dataService.retrieve();
  }
}
