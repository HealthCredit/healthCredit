import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthDto } from '../authentication/dto';
import { AtGuard } from '../common/guards';
import { DataService } from './data.service';
import { projectIdDto, updateCidDto, CidDto } from './dto';
import { approveProjectDto } from './dto/approveProject.dto';

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
  @Post('retrieveDetails')
  async retrieve(@Body() dto: AuthDto): Promise<any> {
    return this.dataService.retrieveMetadataAndProjectId(dto);
  }

  @UseGuards(AtGuard)
  @Get('fetchProjects')
  async fetchProjects(): Promise<any> {
    return this.dataService.fetchProjects();
  }

  @UseGuards(AtGuard)
  @Post('updateCid')
  async updateCid(@Body() dto: updateCidDto): Promise<string> {
    return this.dataService.updateCid(dto);
  }

  @UseGuards(AtGuard)
  @Post('saveProjectId')
  async saveProjectId(@Body() dto: projectIdDto) {
    return this.dataService.updateProjectId(dto);
  }

  @UseGuards(AtGuard)
  @Post('approveProject')
  async approveProject(@Body() dto: approveProjectDto) {
    return this.dataService.approveProject(dto);
  }
}
