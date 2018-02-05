import { Component, OnInit } from '@angular/core';
import { SecureReady, Wallets, WalletsObs } from '../../../../imports/collections/client';

import { ActivatedRoute } from '@angular/router';
import {InjectUser} from "angular2-meteor-accounts-ui";
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Wallet } from '../../../../imports/models';

// import template from './wallet-settings.html';

@Component({
  templateUrl: 'wallet-settings.html'
})
@InjectUser('user')

export class WalletSettingsPage implements OnInit {
  ready: boolean = false;
  title: string;
  walletId: string;
  wallets: Observable<Wallet[]>;
  walletsSub: Subscription;
  // picture: string;
  // wallets: Observable<Wallet[]>;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params
      .map(params => params['walletId'])
      .subscribe(walletId => {
        this.walletId = walletId;
        this.wallets = WalletsObs.find({
          walletId: this.walletId
        }, {
          fields: {
            walletId: 1,
            walletName: 1,
            xPrivKey: 1,
          }
        }).zone();
        let self = this;
        this.walletsSub = MeteorObservable.subscribe('wallet', walletId)
          .subscribe(function() {
            self.ready = true;
          });
      });
  }

  ngOnDestroy() {
    this.ready = false;
    this.walletsSub.unsubscribe();
  }
}