import { Injectable } from '@nestjs/common';
import { Blob } from 'buffer';
import { Web3Storage, getFilesFromPath } from 'web3.storage';
import { ConfigService } from '@nestjs/config';
import { appendFile, readFileSync, createReadStream } from 'fs';
import { CarReader } from '@ipld/car';

import { encode } from 'multiformats/block';
import * as cbor from '@ipld/dag-cbor';
import { sha256 } from 'multiformats/hashes/sha2';
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

  async makeFileObjects() {
    const obj = { hello: 'world' };
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
    const file = await blob.text();

    const files = [
      await appendFile(
        'plain-utf8.txt',
        'content-of-file-1',
        'utf-8',
        (err) => {
          if (err) throw err;
          console.log('data uploaded');
        },
      ),
      // new File([file], 'hello.json'),
      await appendFile('hello.json', file, (err) => {
        if (err) throw err;
        console.log('data uploaded');
      }),
    ];
    return files;
  }

  async encodeCborBlock(value) {
    return encode({ value, codec: cbor, hasher: sha256 });
  }

  async makeCar(rootCID, ipldBlocks) {
    return new CarReader(rootCID, ipldBlocks);
  }

  async storeFiles() {
    const files: any = await getFilesFromPath('file');
    for (const f of files) {
      console.log(f);
      // { name: '/path/to/me', stream: [Function: stream] }
    }

    const web3Storage = await this.makeStorageClient();
    const cid = await web3Storage.put(files);
    console.log(`stored ${files.length} files. cid: ${cid}`);
  }

  async checkStatus() {
    const client = await this.makeStorageClient();
    const status = await client.status(
      'bafybeieg7qchsucyqdei7flw7bzgfoqyostkfvjfoo4u6fc4ipmiqpiuim',
    );

    console.log(status);
  }

  async retrieve() {
    const cid = 'bafybeieg7qchsucyqdei7flw7bzgfoqyostkfvjfoo4u6fc4ipmiqpiuim'
    const client = await this.makeStorageClient();
    const res = await client.get(cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}`);
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`);
    }
    console.log(res);
  }
}
