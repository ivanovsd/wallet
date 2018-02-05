import * as Client from 'bitcore-wallet-client';

import { Component, OnInit } from '@angular/core';
import { Wallets, WalletsObs } from '../../../../imports/collections/client';

import {InjectUser} from "angular2-meteor-accounts-ui";
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Wallet } from '../../../../imports/models';

// import { localWallets } from '../../../../imports/client/collections';

// import template from './wallets.html';

@Component({
  templateUrl: 'wallets.html'
})
@InjectUser('user')

export class WalletsPage implements OnInit {
  title: string;
  ready: boolean = false;
  user: Meteor.User;
  wallets: Observable<Wallet[]>;
  walletsSub: Subscription;
  txProposals: Observable<Object[]>;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.wallets = WalletsObs.find({},{
      fields: {
        walletId: 1,
        walletName: 1,
        totalAmount: 1,
      }
    }).zone();
    let self = this;
    this.walletsSub = MeteorObservable.subscribe('wallets').subscribe(function() {
      self.ready = true;
    });
  }
  ngOnDestroy() {
    this.ready = false;
    this.walletsSub.unsubscribe();
  }
}

