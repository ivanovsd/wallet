import * as Client from 'bitcore-wallet-client';
import * as CryptoJS from 'crypto-js';

import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { GlobalData } from '../../global-data';
import {InjectUser} from "angular2-meteor-accounts-ui";
import { LogoutBlock } from '../../blocks/logout/logout';
import { MeteorObservable } from 'meteor-rxjs';
import { NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Secure } from '../../../../imports/collections/client';

// import template from './restore.html';

@Component({
  templateUrl: 'restore.html'
})
// @NgModule({
//   declarations: [ LogoutBlock ]
// })
@InjectUser('user')

export class AccountRestorePage implements OnInit {
  restoreForm: FormGroup;
  error: string;
  bwsService;

  constructor(private formBuilder: FormBuilder,
    private router: Router) {
    this.restoreForm = this.formBuilder.group({
      mnemonic: ['', Validators.required]
    });
    this.error = '';
    this.bwsService = new Client({
      baseUrl: 'https://bws.csgo.group/bws/api',
      timeout: 100000,
      transports: ['polling'],
    });
  }

  ngOnInit() {
  }

  restore() {
    if (this.restoreForm.valid) {
      let mnemonic = this.restoreForm.value.mnemonic;
      mnemonic = mnemonic.replace(/[\s\n\t\r]+/g, ' ')
        .replace(/(^[\s\n\t\r]+|[\s\n\t\r]+$)/g, '');

      this.bwsService.seedFromMnemonic(mnemonic);
      GlobalData.secure = this.bwsService.getKeys();
      console.log(GlobalData.secure);
      Meteor.call('getSecure', function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        let row = {
          secret: CryptoJS.AES.encrypt(GlobalData.secure.mnemonic, data.secret).toString()
        };
        // TODO: check that decryption is correct
        Secure.update({
          owner: Meteor.userId()
        }, {
          $set: row
        }, {
          upsert: true
        });
      });
    }
  }
}
