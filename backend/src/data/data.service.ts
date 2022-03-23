import { Injectable } from '@nestjs/common';
import { Web3Storage, getFilesFromPath } from 'web3.storage';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../prisma/prisma.service';
import { AuthDto } from '../authentication/dto';
import { writeFileSync, readdir, readFileSync } from 'fs';
import { projectIdDto, uCidDto, CidDto } from './dto';
@Injectable()
export class DataService {
  constructor(private config: ConfigService, private prisma: PrismaService) {}

  /**
   * @param walletAddress: wallet address of the user.
   * @returns image_uri for to be stored in the metadata
   *
   * */
  async modifyMetadata(walletAddress: string) {
    // check that user exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });

    // fetch files uploaded to a folder
    const files: any = await getFilesFromPath(
      `folder/${walletAddress}/LYS.png`,
    );
    const cid = await this.uploadToFilecoin(files, existingUser);

    const image = `https://${cid}.ipfs.dweb.link/LYS.png`;

    readdir(`folder/${walletAddress}`, (err, files) => {
      if (err) console.log(err);
      else {
        files.forEach((file) => {
          if (file === 'metadata.json') {
            const content = readFileSync(`folder/${walletAddress}/${file}`, {
              encoding: 'utf8',
              flag: 'r',
            });

            const dataL = JSON.parse(content);
            const data = { image };

            const contentNew = Object.assign(dataL, data);
            // console.log(contentNew);

            writeFileSync(
              `folder/${walletAddress}/${file}`,
              JSON.parse(JSON.stringify(contentNew)),
              'utf-8',
            );
          }
        });
      }
    });

    return image;
  }

  /**
   *  @param dto: user wallet address
   *  @returns projectUri for project files uploaded to filecoin
   * */
  async storeFiles(dto: AuthDto): Promise<any> {
    // check that user exists
    const existingUser = await this.prisma.user.findUnique({
      where: {
        walletAddress: dto.walletAddress,
      },
    });

    // if user cid does not exist...
    if (!existingUser.cid) {
      // create imageUri for metadata and add it to metadata.json
      await this.modifyMetadata(dto.walletAddress);

      // fetch files uploaded to a folder
      const files: any = await getFilesFromPath(`folder/${dto.walletAddress}`);
      const cid = await this.uploadToFilecoin(files, existingUser);

      // variable for upload link
      const projectUri = `https://${cid}.ipfs.dweb.link/${dto.walletAddress}`;

      return { projectUri };
    } else {
      throw new Error('Files already uploaded!');
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
    const metadata_uri = `https://${cid}.ipfs.dweb.link/${walletAddress}/metadata.json`;
    const uri = metadata_uri;

    return uri;
  }

  /**
   *
   * @returns file links for all project devlopers with their wallet addresses as a point of reference
   * */
  async fetchProjects(): Promise<any> {
    const load = await this.fetchAllCIDsAndWallets();
    let d;
    const data = [];
    // let data_array = [];
    for (const dt in load) {
      d = load[dt].map((item) => {
        return item;
      });
    }
    for (const i in d) {
      data.push(
        await this.retrieveFiles(d[i].cid, d[i].walletAddress, d[i].status),
      );
    }

    return data;
  }

  /**
   * @param userId: the user unqiue Identifier on the database
   * @param cid: the Content Identifier for projects saved on filecoin
   *
   * @summary saved CID to the database for the respective user.
   * */
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

  // update cid and set status to false
  async updateCid(dto: uCidDto): Promise<string> {
    await this.prisma.user.update({
      where: {
        walletAddress: dto.walletAddress,
      },
      data: {
        cid: dto.cid,
      },
    });

    return 'done';
  }

  // update projectId
  async updateProjectId(dto: projectIdDto) {
    await this.prisma.user.update({
      where: {
        walletAddress: dto.walletAddress,
      },
      data: {
        projectId: dto.projectId,
      },
    });
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
   *  @returns new Web3Storage instance
   */
  async makeStorageClient() {
    const token = await this.getAccessToken();
    return new Web3Storage({ token });
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
   * @param file instance
   * @returns cid
   * */
  async uploadToFilecoin(files: any, existingUser: any) {
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

    return cid;
  }

  /**
   *
   * @returns all user records
   * */
  async fetchAllCIDsAndWallets() {
    const users = await this.prisma.user.findMany({
      where: {
        cid: {
          not: null,
        },
      },
    });

    const data = {};
    const key = 'data';
    data[key] = [];

    for (const user in users) {
      const input = {
        walletAddress: users[user].walletAddress,
        cid: users[user].cid,
        status: users[user].status,
      };
      console.log(data);
      data[key].push(input);
    }

    return JSON.parse(JSON.stringify(data));
  }

  async retrieveFiles(cid: string, walletAddress: string, status: boolean) {
    const client = await this.makeStorageClient();
    const res = await client.get(cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}`);
    if (!res.ok) {
      throw new Error(
        `failed to get ${cid} - [${res.status}] ${res.statusText}`,
      );
    }

    const data = new Object();
    const key = walletAddress;
    data[key] = [];

    // unpack File objects from the response
    const files = await res.files();
    for (const file of files) {
      data[key].push(
        JSON.parse(
          JSON.stringify(`https://${cid}.ipfs.dweb.link/${file.name}`),
        ),
      );
    }
    data[key].push(status);

    console.log(data);
    // return res.files();
    return data;
  }
}
