import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! GTF Flat-Earthers!!!!';
  }
}
