import { Component, OnInit } from '@angular/core';
import { SecureReady, Wallets, WalletsObs } from '../../../../imports/collections/client';

import { ActivatedRoute } from '@angular/router';
import { BwcService } from '../../services/bwc';
import {InjectUser} from "angular2-meteor-accounts-ui";
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Wallet } from '../../../../imports/models';
import { WalletsService } from '../../services/wallets';

// import { localWallets } from '../../../../imports/client/collections';

// import template from './wallet-view.html';

@Component({
  templateUrl: 'wallet-view.html'
})
@InjectUser('user')

export class WalletViewPage implements OnInit {
  ready: boolean = false;
  title: string;
  wallet: Wallet;
  walletId: string;
  wallets: Observable<Wallet[]>;
  walletsSub: Subscription;
  // picture: string;
  // wallets: Observable<Wallet[]>;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private bwcService: BwcService) {}

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
            totalAmount: 1,
            totalConfirmedAmount: 1,
            lockedAmount: 1,
            availableAmount: 1,
            availableConfirmedAmount: 1,
            xPrivKey: 1,
            txHistory: 1,
          }
        }).zone();
        let self = this;

        this.wallet = Wallets.findOne({
          walletId: walletId
        });

        this.walletsSub = MeteorObservable.subscribe('wallet', walletId)
          .subscribe(function() {
            var w: any = Wallets.findOne({
              walletId: walletId
            });
            if (w) {
              let local: any = Wallets;
              local._collection.update({_id: w._id}, {
                $set: {
                  updateBalance: new Date()
                }
              });
            }
            self.ready = true;
            // self.checkBalance();
          });
      });
  }

  checkBalance() {
    this.bwcService.client.getBalance({
      twoStep: true
    }, function(err, data) {
      console.log(err, data);
      // totalAmount, lockedAmount, totalConfirmedAmount, lockedConfirmedAmount,
      // availableAmount, availableConfirmedAmount
    });
  }

  ngOnDestroy() {
    this.ready = false;
    this.walletsSub.unsubscribe();
  }
}