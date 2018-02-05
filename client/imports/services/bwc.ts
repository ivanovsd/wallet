import * as Client from 'bitcore-wallet-client';

import { Injectable } from '@angular/core';

@Injectable()
export class BwcService {
  client;

  constructor() {
    this.client = new Client({
      baseUrl: 'https://bws.csgo.group/bws/api',
      timeout: 100000,
      transports: ['polling'],
    });
  }
}