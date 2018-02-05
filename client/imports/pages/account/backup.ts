import { Component, OnInit } from '@angular/core';

import { GlobalData } from '../../global-data';
import {InjectUser} from "angular2-meteor-accounts-ui";
import { MeteorObservable } from 'meteor-rxjs';
import { NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

// import template from './backup.html';

@Component({
  templateUrl: 'backup.html'
})
@InjectUser('user')

export class AccountBackupPage implements OnInit {
  title: string;
  mnemonic: string = '';

  constructor(private router: Router) {
  }

  ngOnInit() {
    let self = this;
    let n = 0;
    let updateMnemonicCode = function() {
      if (GlobalData && GlobalData.secure && GlobalData.secure.mnemonic) {
        self.mnemonic = GlobalData.secure.mnemonic;
      } else {
        n++;
        if (n < 20) {
          setTimeout(updateMnemonicCode, 100);
        }
      }
    }
    setTimeout(updateMnemonicCode, 100);
  }

  toggle() {
    console.log('toggle');
    // console.log(GlobalData, GlobalData.secure);
  }
}