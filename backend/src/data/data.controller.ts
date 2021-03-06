import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthDto } from '../authentication/dto';
import { AtGuard } from '../common/guards';
import { DataService } from './data.service';
import { projectIdDto, projectDto, updateCidDto, CidDto } from './dto';
import { approveProjectDto } from './dto/approveProject.dto';

@Controller('api/data')
export class DataController {
  constructor(private readonly dataService: DataService) {}

  @Post('check')
  async checkStatus(@Body() dto: CidDto): Promise<any> {
    return this.dataService.checkStatus(dto);
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
  @Post('getMetadata')
  async getMetadata(@Body() dto: AuthDto) {
    return this.dataService.getMetadata(dto);
  }

  @UseGuards(AtGuard)
  @Post('updateCid')
  async updateCid(@Body() dto: updateCidDto): Promise<string> {
    return this.dataService.updateCid(dto);
  }

  @UseGuards(AtGuard)
  @Post('saveProject')
  async saveProject(@Body() dto: projectDto) {
    return this.dataService.updateProject(dto);
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
