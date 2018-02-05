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

// import template from './activity.html';

@Component({
  templateUrl: 'activity.html'
})
@InjectUser('user')

export class TxActivityPage implements OnInit {
  title: string = 'Recent Transactions';
  ready: boolean = true;
  error: string = '';

  constructor(private route: ActivatedRoute,
    private router: Router, private titleService: TitleService,
    private bwcService: BwcService) {
      this.titleService.setTitle(this.title);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.ready = false;
  }
}