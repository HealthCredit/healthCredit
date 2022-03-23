import { ethers } from 'ethers';
import { SIGNING_MESSAGE } from './constants/constant';
import { WalletDto, SignatureDto } from './dto/index';
import { Logger, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * walletAddress: user wallet address passed in from frontend
   *
   * @param AuthDto payload containing user wallet address
   *
   * @implements if user exists: fetch access and refresh tokens
   *             else creates new user
   *
   * @returns tokens
   *          byte32 hash from solidityKeccak256 = byte32Hash
   *          bcrypt hash of byte32Hash = hash
   **/

  // eslint-disable-next-line @typescript-eslint/ban-types
  async authenticate(dto: AuthDto): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        walletAddress: dto.walletAddress,
      },
    });

    if (existingUser) {
      const tokens = await this.getTokens(
        existingUser.id,
        existingUser.walletAddress,
      );
      await this.updateRtHash(existingUser.id, tokens.refresh_token);

      return tokens;
    } else {
      const byte32Hash = await this.generateNonce(dto);
      const hash = await this.hashData(byte32Hash.value);
      const address = dto.walletAddress.toLowerCase();
      const user = await this.prisma.user.create({
        data: {
          walletAddress: address,
          hash,
        },
      });
      const tokens = await this.getTokens(user.id, user.walletAddress);
      await this.updateRtHash(user.id, tokens.refresh_token);

      return {
        byte32Hash,
        hash,
        tokens,
      };
    }
  }

  /**
   * userId: User unique id
   * rt: refresh tokens
   *
   * @param {userId, rt}
   *
   * updates refresh tokens tied to a user
   **/
  async updateRtHash(userId: number, rt: string) {
    const hashRt = await this.hashData(rt);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hashRt,
      },
    });
  }

  /**
   * @param userId
   *
   * Clears refresh tokens tied to user
   **/

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
      },
    });
  }

  /*-------------------------------------------------Pure Functions-------------------------------------------------*/

  /**
   * Generate byte32 hash from user wallet and nonce
   *
   * @param walletAddress The wallet address of the user
   *
   * @returns Byte32 Hash after packing the wallet and nonce using solidityKeccak256
   * */

  async generateNonce(walletData: WalletDto): Promise<any> {
    const nonce = ethers.utils.hexlify(new Date().getTime());
    const wallet = walletData.walletAddress;
    const hash = ethers.utils.solidityKeccak256(
      ['string', 'string'],
      [nonce, wallet],
    );

    return {
      message: SIGNING_MESSAGE.replace('{NONCE_VALUE}', hash),
      value: hash,
    };
  }

  /**
   * Hash: Byte32 message created using solidityKeccak256
   * address: User wallet address
   * Signature: Signed message by user (Byte32)
   *
   * @param signatureDto The payload containing Address, Hash and Signature
   * @returns true if address is successfully recovered from signature @else false
   *
   */

  async verifySignature(signatureDto: SignatureDto): Promise<boolean> {
    Logger.verbose(
      `"[verifySignature]: address "${signatureDto.walletAddress}", signature "${signatureDto.signature}"`,
    );

    const recoveredAddress = ethers.utils.verifyMessage(
      signatureDto.nonce.message,
      signatureDto.signature,
    );

    Logger.verbose(`[verifySignature]: recoveredAddress "${recoveredAddress}"`);

    return recoveredAddress === signatureDto.walletAddress;
  }

  /**
   * data: any form
   *
   * @param data The payload for any kind of data
   *
   * @returns hash
   **/
  hashData(data: any) {
    return bcrypt.hash(data, 10);
  }

  /**
   * userId: uniqueId of the user in the database
   * info: reference data of the userId on the database
   *
   * @param {userId, info}
   *
   * @returns access and refresh tokens
   **/
  async getTokens(userId: number, info: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          info,
        },
        {
          secret: this.config.get<string>('AT_SECRET'),
          expiresIn: 60 * 10,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          info,
        },
        {
          secret: this.config.get<string>('RT_SECRET'),
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
