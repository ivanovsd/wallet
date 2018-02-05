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
import { TitleService } from '../../services/title';
import { Wallet } from '../../../../imports/models';

// import template from './send-confirm.html';

@Component({
  templateUrl: 'send-confirm.html'
})
@InjectUser('user')

export class TxSendConfirmPage implements OnInit {
  wallet: Wallet;
  walletId: string;
  walletName: string;
  wallets: Observable<Wallet[]>;
  walletsSub: Subscription;
  ready: boolean = false;
  error: string = '';
  amount: number = 0;
  opts;
  n: number = 0;
  address: string = '';
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

    this.route.params
      .map(params => params['address'])
      .subscribe(address => {
        console.log(address);
        this.address = address;
      });

    this.route.params
      .map(params => params['amount'])
      .subscribe(amount => {
        console.log(amount);
        this.amount = amount;
      });

    // this.bwcService.client.seedFromMnemonic(mnemonic, opts);
    this.wallets = WalletsObs.find({
      // walletId: this.walletId
    }, {
      fields: {
        walletId: 1,
        walletName: 1,
        opened: 1
      }
    }).zone();
    this.walletsSub = MeteorObservable.subscribe('wallets')
      .subscribe(function() {
        self.openWallet();
      });
    //   });
  }

  ngOnInit() {
  }

  send() {
    let opts: any = {};
    let sendMaxInfo = false;
    opts.outputs = [{
      'toAddress': this.address,
      'amount': Math.round(this.amount*100*1000*1000),
      'message': ''
    }];
    opts.paypro = false;
    opts.doNotVerifyPayPro = true;
    opts.message = '';

    if (sendMaxInfo) {
      // txp.inputs = tx.sendMaxInfo.inputs;
      // txp.fee = tx.sendMaxInfo.fee;
    } else {
      // opts.feePerKb = 0.0001;
      // if (usingCustomFee) {
      //   txp.feePerKb = tx.feeRate;
      // } else txp.feeLevel = tx.feeLevel;
    }

    let local: any = Wallets;
    local._collection.update({_id: this.wallet._id}, {
      $set: {
        currentTxp: opts
      }
    });

    // let self: any = this;

    // this.bwcService.client.createTxProposal(opts, function(err, ctxp) {
    //   console.log(err, ctxp);
    //   if (!err) {
    //     opts.txp = ctxp;
    //     self.bwcService.client.publishTxProposal(opts, function(err, publishedTx) {
    //       console.log(err, publishedTx);
    //       if (!err) {
    //         // setTimeout(function() {
    //         self.bwcService.client.signTxProposal(publishedTx, function(err, signedTx) {
    //           console.log(err, signedTx);
    //           if (!err) {
    //             self.bwcService.client.broadcastTxProposal(signedTx, function(err, txp) {
    //               console.log(err, txp);
    //             });
    //           }
    //         });
    //         // }, 10000);
    //       }
    //     });
    //   }
    // });

    // if (tx.paypro) {
    //   txp.payProUrl = tx.paypro.url;
    // }
    // txp.excludeUnconfirmedUtxos = !tx.spendUnconfirmed;
    // txp.dryRun = dryRun;

    // walletService.createTx(wallet, txp, function(err, ctxp) {

    // .createTxProposal(opts, opts.outputs, opts.outputs[].toAddress,
    // opts.outputs[].amount, opts.outputs[].message, opts.message,
    // opts.fee, opts.feePerKb, opts.changeAddress, opts.payProUrl,
    // opts.excludeUnconfirmedUtxos, opts.customData, opts.inputs,
    // opts.outputs, opts.utxosToExclude)
  }

  openWallet() {
    this.n = 0;
    this._openWallet();
  }

  _openWallet() {
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
    self.wallet = w;
    // if (!w || !w.mnemonic || typeof w.mnemonic !== "string") {
    //   n++;
    //   if (n < 50) {
    //     setTimeout(self._openWallet, 100);
    //   }
    //   return;
    // }
    self.walletId = w.walletId;
    self.walletName = w.walletName;
    // if (w.lastAddress) {
    //   self.address = w.lastAddress;
    //   self.ready = true;
    //   return;
    // }
    // self.bwcService.client.importFromMnemonic(w.mnemonic, self.opts, function(err, data) {
    self.ready = true;
    //   console.log('wallet opened');
    // });
  }

  change() {
    this.ready = false;
    this.openWallet();
  }

  ngOnDestroy() {
    this.ready = false;
    this.walletsSub.unsubscribe();
  }
}