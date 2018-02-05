import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

// import template from './wallet-delete.html';

@Component({
  templateUrl: 'wallet-delete.html'
})
@InjectUser('user')

export class WalletDeletePage implements OnInit {
  deleteForm: FormGroup;
  mnemonic: string = '';
  walletId: string;
  wallets: Observable<Wallet[]>;
  walletsSub: Subscription;
  ready: boolean = false;
  error: string = '';

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
    private router: Router) {
    this.deleteForm = this.formBuilder.group({
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

  delete() {
    if (this.deleteForm.valid) {
      let mnemonic = this.deleteForm.value.mnemonic;
      mnemonic = mnemonic.replace(/[\s\n\t\r]+/g, ' ')
        .replace(/(^[\s\n\t\r]+|[\s\n\t\r]+$)/g, '');

      let row: any = Wallets.findOne({ walletId: this.walletId }, { fields: {mnemonic: 1}});
      if (row && row.mnemonic && row.mnemonic === mnemonic) {
        Wallets.remove({ _id: row._id });
        this.router.navigate(['/settings']);
      }
    }
  }

  goBack() {
    this.router.navigate(['/wallet-settings', this.walletId]);
  }
}