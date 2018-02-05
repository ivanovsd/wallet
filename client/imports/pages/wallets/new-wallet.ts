import { Component, OnInit } from '@angular/core';

import {InjectUser} from "angular2-meteor-accounts-ui";
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Wallet } from '../../../../imports/models';
import { Wallets } from '../../../../imports/collections/client';

// import template from './';

@Component({
  templateUrl: 'new-wallet.html'
})
@InjectUser('user')

export class NewWalletPage implements OnInit {
  title: string;
  // picture: string;
  // wallets: Observable<Wallet[]>;

  constructor(private router: Router) {
  }

  ngOnInit() {
    // this.wallets = Wallets.find({});
  }
}