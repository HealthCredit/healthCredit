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

  /**
   *  @param dto: user wallet address
   *  @returns projectUri
   * */
  async storeFiles(dto: AuthDto): Promise<any> {
    // check that user exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        walletAddress: dto.walletAddress,
      },
    });

    // if user exists...
    if (existingUser) {
      // fetch files uploaded to a folder
      const files: any = await getFilesFromPath(`folder/${dto.walletAddress}`);
      const web3Storage = await this.makeStorageClient();
      console.log(`🤖 Storing simple CBOR object...`);

      // save files to filecoin via web3.storage with
      // same structure -> cid/walletAddress/file/[...project files...]
      const cid = await web3Storage.put(files);

      // store the cid to the repective address on postgres database
      await this.saveCid(existingUser.id, cid);
      console.log(`🎉 Done storing simple CBOR object. CID: ${cid}`);
      console.log(`💡 If you have ipfs installed, try: ipfs dag get ${cid}\n`);
      console.log(`stored ${files.length} files. cid: ${cid}`);

      // variable for upload link
      const projectUri = `https://${cid}.ipfs.dweb.link/${dto.walletAddress}`;

      return { projectUri };
    } else {
      throw new Error('Unauthorized access!');
    }
  }

  /**
   *  @param CID
   *  @returns CID status
   * */
  async checkStatus(dto: CidDto): Promise<any> {
    const client = await this.makeStorageClient();
    const status = await client.status(dto.cid);

    return { status };
  }

  /**
   *  @param dto: user wallet Address
   *  @returns metadata uri from CID
   *
   * */
  async retrieveMetadata(dto: AuthDto): Promise<any> {
    const client = await this.makeStorageClient();
    const [cid, walletAddress] = await this.fetchCidWallet(dto.walletAddress);
    const res = await client.get(cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}`);
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`);
    }

    // variables to hold metadat uri
    const metadata_uri = `https://${cid}.ipfs.dweb.link/${walletAddress}/file/metadata.json`;
    const uri = { metadata_uri };

    const files = await res.files();
    for (const file of files) {
      console.log(`${file.cid} -- ${file.name} -- ${file.size}`);
    }

    return uri;
  }

  /*------------------------------------------------------PURE FUNCTIONS------------------------------------------------*/

  /**
   *
   * @returns web3.storage access token
   */
  async getAccessToken(): Promise<string> {
    return this.config.get<string>('web3Storage');
  }

  /**
   *  @param walletAddress: user wallet address.
   *  @returns user CID and wallet address
   * */
  async fetchCidWallet(walletAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });

    return [user.cid, user.walletAddress];
  }

  /**
   *  @returns new Web3Storage instance
   */
  async makeStorageClient() {
    const token = await this.getAccessToken();
    return new Web3Storage({ token });
  }
}
