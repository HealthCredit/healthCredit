import { Injectable } from '@nestjs/common';
import { Web3Storage } from 'web3.storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DataService {
  constructor(private config: ConfigService) {}

  async getAccessToken(): Promise<string> {
    return this.config.get<string>('web3Storage');
  }

  async makeStorageClient() {
    const token = await this.getAccessToken();
    return new Web3Storage({ token });
  }
}
