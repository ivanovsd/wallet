import { Component, OnInit } from '@angular/core';
import { SecureReady, Wallets, WalletsObs } from '../../../../imports/collections/client';

import { ActivatedRoute } from '@angular/router';
import { GlobalData } from '../../global-data';
import {InjectUser} from "angular2-meteor-accounts-ui";
import { MeteorObservable } from 'meteor-rxjs';
import { NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Wallet } from '../../../../imports/models';

// import template from './wallet-backup.html';

@Component({
  templateUrl: 'wallet-backup.html'
})
@InjectUser('user')

export class WalletBackupPage implements OnInit {
  title: string;
  mnemonic: string = '';
  walletId: string;
  wallets: Observable<Wallet[]>;
  walletsSub: Subscription;
  ready: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router) {
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
            mnemonic: 1,
          }
        }).zone();
        let self = this;
        this.walletsSub = MeteorObservable.subscribe('wallet', walletId)
          .subscribe(function() {
            self.ready = true;
          });
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ready = false;
  }

  goBack() {
    this.router.navigate(['/wallet-settings', this.walletId]);
  }
}