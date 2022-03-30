import { Injectable } from '@nestjs/common';
import { Web3Storage } from 'web3.storage';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './../prisma/prisma.service';
import { AuthDto } from '../authentication/dto';
import {
  projectIdDto,
  projectDto,
  approveProjectDto,
  updateCidDto,
  CidDto,
} from './dto';
@Injectable()
export class DataService {
  constructor(private config: ConfigService, private prisma: PrismaService) {}

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
  async retrieveMetadataAndProjectId(dto: AuthDto): Promise<any> {
    const client = await this.makeStorageClient();
    const [cid, projectId, lysamount] = await this.fetchCidandProjectId(
      dto.walletAddress,
    );

    const res = await client.get(cid.toString());
    // console.log(`Got a response! [${res.status}] ${res.statusText}`);
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`);
    }

    // variables to hold metadat uri
    const metadata_uri = `https://${cid}.ipfs.dweb.link/metadata.json`;
    const uri = JSON.parse(
      JSON.stringify({ metadata_uri, projectId, lysamount }),
    );

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
        await this.retrieveFiles(
          d[i].cid,
          d[i].walletAddress,
          d[i].status,
          d[i].projectId,
        ),
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

  /**
   * @param updateCidDto: wallet address and project cid
   * @yields: save cid and set status to false on database
   * */
  async updateCid(dto: updateCidDto): Promise<string> {
    const cid = dto.cid;

    await this.prisma.user.update({
      where: {
        walletAddress: dto.walletAddress,
      },
      data: {
        cid,
      },
    });
    // console.log('cid', dto.cid);

    return 'done';
  }

  // <!---------------------------------- START Project LYS amount and ID --------------------------------------->
  /**
   * @param projectDto: wallet address and lys amount from frontend
   * @yields: save lysamount to database
   * */
  async updateProject(dto: projectDto) {
    await this.prisma.user.update({
      where: {
        walletAddress: dto.walletAddress,
      },
      data: {
        lysamount: dto.lysamount,
      },
    });

    return `updated lys amonut with: ${dto.lysamount}`;
  }

  /**
   * @param projectIdDto: wallet address and projectId from frontend
   * @yields: save projectId to database
   * */
  async updateProjectId(dto: projectIdDto) {
    await this.prisma.user.update({
      where: {
        walletAddress: dto.walletAddress,
      },
      data: {
        projectId: dto.projectId,
      },
    });

    return `updated projectId with: ${dto.projectId}`;
  }
  // <------------------------------------ END OF Project LYS Amount and ID ---------------------------------------------->

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
  async fetchCidandProjectId(walletAddress: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        walletAddress,
      },
    });

    return [user.cid, user.projectId, user.lysamount];
  }

  /**
   * @param file instance
   * @returns cid
   * */
  async uploadToFilecoin(files: any, existingUser: any) {
    const web3Storage = await this.makeStorageClient();
    // console.log(`🤖 Storing simple CBOR object...`);

    // save files to filecoin via web3.storage with
    const cid = await web3Storage.put(files);

    // store the cid to the repective address on postgres database
    await this.saveCid(existingUser.id, cid);
    // console.log(`🎉 Done storing simple CBOR object. CID: ${cid}`);
    // console.log(`💡 If you have ipfs installed, try: ipfs dag get ${cid}\n`);
    // console.log(`stored ${files.length} files. cid: ${cid}`);

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
        status: false,
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
        projectId: users[user].projectId,
      };
      // console.log(data);
      data[key].push(input);
    }

    return JSON.parse(JSON.stringify(data));
  }

  async retrieveFiles(
    cid: string,
    walletAddress: string,
    status: boolean,
    projectId: number,
  ) {
    const client = await this.makeStorageClient();
    const res = await client.get(cid);
    // console.log(`Got a response! [${res.status}] ${res.statusText}`);
    // if (!res.ok) {
    //   throw new Error(
    //     `failed to get ${cid} - [${res.status}] ${res.statusText}`,
    //   );
    // }

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
    data[key].push(projectId);

    return data;
  }

  /**
   * @param AuthDto: wallet address
   * @returns: metadataUri for the project.
   * */
  async getMetadata(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        walletAddress: dto.walletAddress,
      },
    });

    const metadataUri = `https://${user.cid}.ipfs.dweb.link/metadata.json`;

    return metadataUri;
  }

  /**
   * @param approveProjectDto: projectId
   * @yields: set project status to true on database. NB: false = not approved, true = approved
   * */
  async approveProject(dto: approveProjectDto) {
    await this.prisma.user.update({
      where: {
        projectId: dto.projectId,
      },
      data: {
        status: true,
      },
    });
  }

  /*------------------------------------------------------END OF PURE FUNCTIONS------------------------------------------------*/
}
