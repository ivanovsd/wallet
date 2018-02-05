import * as Client from 'bitcore-wallet-client';
import * as CryptoJS from 'crypto-js';

import { Secure, SecureReady } from '../../../imports/collections/client';
import { Splashscreen, StatusBar } from 'ionic-native';

import { Component } from '@angular/core';
import { GlobalData } from '../global-data';
import {InjectUser} from "angular2-meteor-accounts-ui";
import { LandingPage } from '../pages/landing/landing';
import { Platform } from 'ionic-angular';
import { Router } from '@angular/router';
import { WalletsService } from '../services/wallets';
import {enableProdMode} from '@angular/core';

// import { Ground } from 'meteor/ground:db';
// import template from "./app.html";

enableProdMode();

@Component({
  templateUrl: 'app.html'
})
@InjectUser('user')

export class MyApp {
  rootPage = LandingPage;
  first: boolean = true;
  secure: any;
  bwsService;

  constructor(platform: Platform, private router: Router,
  private walletsService: WalletsService) {
    GlobalData.walletsService = walletsService;

    platform.ready().then(() => {
      if (platform.is('cordova')) {
        StatusBar.styleDefault();
        Splashscreen.hide();
      }
    });

    this.bwsService = new Client({
      baseUrl: 'https://bws.csgo.group/bws/api',
      timeout: 100000,
      transports: ['polling'],
    });
    let self = this;
    var m: number = 0;

    let updateSecure = () => {
      if (!Meteor.userId()) {
        setTimeout(updateSecure, 100);
        return;
      }

      let row = Secure.findOne({
        owner: Meteor.userId()
      });
      if (!row) {
        m++;
        if (m < 50) {
          setTimeout(updateSecure, 100);
          return;
        }
      }
      if (row) {
        Secure.remove({
          owner: Meteor.userId(),
          _id: {$ne: row._id}
        });
      }
      let n = Secure.find({
        owner: Meteor.userId()
      }).count();
      Meteor.call('getSecure', function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        if (!row) {
          if (data.canCreate) {
            self.bwsService.seedFromRandomWithMnemonic();
            GlobalData.secure = self.bwsService.getKeys();
            row = {
              owner: Meteor.userId(),
              secret: CryptoJS.AES.encrypt(GlobalData.secure.mnemonic, data.secret).toString()
            };
            Secure.insert(row);
          }
        } else {
          let mnemonic = CryptoJS.AES.decrypt(row.secret, data.secret).toString(CryptoJS.enc.Utf8);
          self.bwsService.seedFromMnemonic(mnemonic);
          GlobalData.secure = self.bwsService.getKeys();
        }
      });
      // });
    };
    Accounts.onLogin(function() {
      console.log('login');
      if (SecureReady.ready) {
        updateSecure();
      } else {
        Secure.on('loaded', function() {
          updateSecure();
        });
      }
    });
    Accounts.onLogout(function() {
      console.log('logout');
      GlobalData.secure = {};
    });
    if (Meteor.userId()) {
      if (SecureReady.ready) {
        updateSecure();
      } else {
        Secure.on('loaded', function() {
          updateSecure();
        });
      }
    } else {
      GlobalData.secure = {};
    }
    let x: any = Meteor;
    x.default_connection._stream.on('disconnect', function() {
      // window.location.reload();
    });
  }

  logout() {
    Meteor.logout();
    this.router.navigate(['/']);
  }
  onActivate(event) {
    GlobalData.component = event;
  }
}