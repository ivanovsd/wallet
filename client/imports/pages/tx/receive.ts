import { Component, OnInit } from '@angular/core';
import { SecureReady, Wallets, WalletsObs } from '../../../../imports/collections/client';

import { ActivatedRoute } from '@angular/router';
import { BwcService } from '../../services/bwc';
import { GlobalData } from '../../global-data';
import {InjectUser} from "angular2-meteor-accounts-ui";
import { MeteorObservable } from 'meteor-rxjs';
import { NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Wallet } from '../../../../imports/models';

// import template from './receive.html';

@Component({
  templateUrl: 'receive.html'
})
@InjectUser('user')

export class TxReceivePage implements OnInit {
  walletId: string;
  walletName: string;
  wallets: Observable<Wallet[]>;
  walletsSub: Subscription;
  ready: boolean = false;
  error: string = '';
  address: string = '';
  n: number = 0;
  opts;
  selectOptions;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private bwcService: BwcService) {
    // this.route.params
    //   .map(params => params['walletId'])
    //   .subscribe(walletId => {
    //     this.walletId = walletId;
    let self = this;

    this.opts = {
      // name: this.importForm.value.walletName,
      // m: 1, // requiredCopayers
      // n: 1, // totalCopayers
      // myName: '',
      network: 'testnet',
      doNotVerify: false,
      limit: 1,
      reverse: false,
      // passphrase: '',
      // derivationStrategy: 'BIP44',
      account: 0,
    };

    this.selectOptions = {
      title: '',
      subTitle: '',
      mode: 'md'
    };

    // this.bwcService.client.seedFromMnemonic(mnemonic, opts);
    this.wallets = WalletsObs.find({
      // walletId: this.walletId
    }, {
      fields: {
        walletId: 1,
        walletName: 1,
      }
    }).zone();
    this.walletsSub = MeteorObservable.subscribe('wallets')
      .subscribe(function() {
        self.startCheck();
      });
    //   });
  }

  startCheck = function() {
    this.n = 0;
    this.check();
  }

  check = function() {
    let self = this;
    let n = this.n;
    let q = {};
    if (self.walletId) {
      q = {
        walletId: self.walletId
      }
    };
    let rows = Wallets.find(q, {
      fields: {
        walletId: 1,
        walletName: 1,
        mnemonic: 1,
        lastAddress: 1,
      }
    }).fetch();
    let w: any;
    for (var k in rows) {
      w = rows[k];
      break;
    }
    if (!w || !w.mnemonic || typeof w.mnemonic !== "string") {
      n++;
      if (n < 50) {
        setTimeout(self.check, 100);
      }
      return;
    }
    self.walletId = w.walletId;
    self.walletName = w.walletName;
    if (w.lastAddress) {
      self.address = w.lastAddress;
      self.ready = true;
      return;
    }
    let updateLastAddress = function(_id: string, address: string) {
      Wallets.update({
        _id: _id
      }, {
        $set: {
          lastAddress: address
        }
      });
    };
    self.bwcService.client.importFromMnemonic(w.mnemonic, self.opts, function(err, data) {
      self.bwcService.client.createAddress(self.opts, function(err, data) {
        if (err) {
          console.log(err);
          if (err.message.match(/Maximum number/)) {
            self.bwcService.client.getMainAddresses(self.opts, function(err, data) {
              if (err) {
                console.log(err);
                return;
              }
              for (var k in data) {
                self.address = data[k].address;
                break;
              }
              self.ready = true;
              updateLastAddress(w._id, self.address);
            });
          }
          return;
        }
        self.address = data.address;
        self.ready = true;
        updateLastAddress(w._id, self.address);
      });
    });
  }

  change(event) {
    this.startCheck();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ready = false;
    this.walletsSub.unsubscribe();
  }
}