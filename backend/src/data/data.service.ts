import { Injectable } from '@nestjs/common';
import { Web3Storage, getFilesFromPath } from 'web3.storage';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../prisma/prisma.service';
import { AuthDto } from '../authentication/dto';
import { CidDto } from './dto/cid.dto';
@Injectable()
export class DataService {
  constructor(private config: ConfigService, private prisma: PrismaService) {}

  async saveCid(userId: number, cid: string) {
    const _cid = cid;

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        cid: _cid,
      },
    });
  }

  async storeFiles(dto: AuthDto) {
    // check that user exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        walletAddress: dto.walletAddress,
      },
    });

    if (existingUser) {
      const files: any = await getFilesFromPath(`folder/${dto.walletAddress}`);

      const web3Storage = await this.makeStorageClient();
      console.log(`🤖 Storing simple CBOR object...`);
      const cid = await web3Storage.put(files);

      // store the cid to the repective address
      await this.saveCid(existingUser.id, cid);
      console.log(`🎉 Done storing simple CBOR object. CID: ${cid}`);
      console.log(`💡 If you have ipfs installed, try: ipfs dag get ${cid}\n`);
      console.log(`stored ${files.length} files. cid: ${cid}`);

      return 'Done';
    } else {
      throw new Error('Unauthorized access!');
    }
  }

  async checkStatus(dto: CidDto): Promise<any> {
    const client = await this.makeStorageClient();
    const status = await client.status(dto.cid);

    return { status };
  }

  async retrieve(dto: CidDto): Promise<any> {
    const client = await this.makeStorageClient();
    const res = await client.get(dto.cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}`);
    if (!res.ok) {
      throw new Error(`failed to get ${dto.cid}`);
    }

    return { res };
  }

  /*------------------------------------------------------PURE FUNCTIONS------------------------------------------------*/

  async getAccessToken(): Promise<string> {
    return this.config.get<string>('web3Storage');
  }

  async makeStorageClient() {
    const token = await this.getAccessToken();
    return new Web3Storage({ token });
  }
}
