import { Component, OnInit } from '@angular/core';

import {InjectUser} from "angular2-meteor-accounts-ui";
import { MeteorObservable } from 'meteor-rxjs';
import { NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';

// import { Wallet } from '../../../../imports/models';
// import { Wallets } from '../../../../imports/collections';

// import template from './landing.html';

@Component({
  templateUrl: 'landing.html'
})
@InjectUser('user')

export class LandingPage implements OnInit {
  title: string;

  constructor() {
  }

  ngOnInit() {
  }
}