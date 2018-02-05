import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

// import template from './wallet-import.html';

@Component({
  templateUrl: 'wallet-import.html'
})
@InjectUser('user')

export class WalletImportPage implements OnInit {
  importForm: FormGroup;
  mnemonic: string = '';
  walletId: string;
  wallets: Observable<Wallet[]>;
  walletsSub: Subscription;
  ready: boolean = false;
  error: string = '';

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router, private titleService: TitleService,
    private bwcService: BwcService) {
    this.importForm = this.formBuilder.group({
      // walletName: ['', Validators.required],
      mnemonic: ['', Validators.required]
    });
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

  import() {
    if (this.importForm.valid) {
      let mnemonic = this.importForm.value.mnemonic;
      mnemonic = mnemonic.replace(/[\s\n\t\r]+/g, ' ')
        .replace(/(^[\s\n\t\r]+|[\s\n\t\r]+$)/g, '');

      var opts = {
        // name: this.importForm.value.walletName,
        // m: 1, // requiredCopayers
        // n: 1, // totalCopayers
        // myName: '',
        network: 'testnet',
        mnemonic: mnemonic,
        // passphrase: '',
        // derivationStrategy: 'BIP44',
        account: 0,
      };

      // this.bwcService.client.seedFromMnemonic(mnemonic, opts);
      var self = this;
      this.bwcService.client.importFromMnemonic(mnemonic, opts, function(err, data) {
        if (err) {
          console.log('error: ',err);
          return
        };
        console.log('Wallet Created. Share this secret with your copayers: ', data, data.wallet);
        // console.log(self.bwcService.client.export());
        try {
          Wallets.insert(JSON.parse(self.bwcService.client.export()));
          // Wallets.insert({
          //   walletId: data.wallet.id,
          //   walletName: data.wallet.name,
          //   coin: data.wallet.coin,
          //   network: data.wallet.network,
          //   xPrivKey: '',
          //   xPubKey: data.wallet.copayers[0].xPubKey,
          //   requestPrivKey: '', // data.copayers[0].id,
          //   requestPubKey: data.wallet.copayers[0].requestPubKeys,
          //   copayerId: data.wallet.copayers[0].id,
          //   publicKeyRing: data.wallet.publicKeyRing,
          //   m: data.wallet.m,
          //   n: data.wallet.n,
          //   walletPrivKey: data.customData.walletPrivKey,
          //   personalEncryptingKey: '',
          //   sharedEncryptingKey: '',
          //   mnemonic: mnemonic,
          //   entropySource: '',
          //   mnemonicHasPassphrase: false,
          //   derivationStrategy: data.wallet.derivationStrategy,
          //   account: opts.account,
          //   compliantDerivation: '',
          //   addressType: data.wallet.addressType
          // });
        } catch(e) {
          console.log(e.stack);
        }
      });
    }
  }
}