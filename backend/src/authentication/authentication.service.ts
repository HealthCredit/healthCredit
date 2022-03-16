import { ethers } from 'ethers'
import { SIGNING_MESSAGE } from './constants/constant';
import { WalletDto, SignatureDto } from './dto/index'
import { Nonce } from './types';
import { ForbiddenException, Logger, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async authenticate(dto: AuthDto): Promise<Object> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        walletAddress: dto.walletAddress
      }
    });

    if(existingUser) {
      
      const tokens = await this.getTokens(existingUser.id, existingUser.walletAddress);
      await this.updateRtHash(existingUser.id, tokens.refresh_token)
      
      return tokens
 
    } else {
      const byte32Hash = await this.generateNonce(dto)
      const hash = await this.hashData(byte32Hash.value);
      const user = await this.prisma.user.create({
        data: {
          walletAddress: dto.walletAddress,
          hash
        }
      })
      const tokens = await this.getTokens(user.id, user.walletAddress);
      await this.updateRtHash(user.id, tokens.refresh_token)
      
      return {
        byte32Hash, hash
      }
    }
  }


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
      const wallet = walletData.walletAddress
      const hash = ethers.utils.solidityKeccak256(["string", "string"], [nonce, wallet]);
  
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
      Logger.verbose(`"[verifySignature]: address "${signatureDto.walletAddress}", signature "${signatureDto.signature}"`)

      const recoveredAddress = ethers.utils.verifyMessage(signatureDto.nonce.message, signatureDto.signature)

      Logger.verbose(`[verifySignature]: recoveredAddress "${recoveredAddress}"`)

      return recoveredAddress === signatureDto.walletAddress
  }


  // ?: hash function to salt the byte32 hash gotten from the signed message (make sure this comment is correct)
  hashData(data: any) {
    return bcrypt.hash(data, 10)
  }

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
