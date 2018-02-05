import { ActivatedRoute, Router } from '@angular/router';

import { Component } from '@angular/core';
import {GlobalData} from '../global-data';
import {InjectUser} from "angular2-meteor-accounts-ui";
import {TitleService} from "../services/title";

// import template from './user-header.html';

@Component({
  selector: 'user-header',
  templateUrl: 'user-header.html'
})
@InjectUser('user')

export class UserHeader {
  title: string;

  constructor(private route: ActivatedRoute, private titleService: TitleService,
    private router: Router) {
  }
  ngOnInit() {
    var x: any = this.route.snapshot.data;
    if (x.title) {
      this.titleService.setTitle(x.title);
    }
    this.title = this.titleService.getTitle();
    console.log(this.title);
  }
  goBack() {
    let component = GlobalData.component;
    console.log(this.route.snapshot);
    if (component.goBack) {
      return component.goBack();
    }
    console.log(this.route.component);
    let x: any = this.route.snapshot.data;
    if (x.back) {
      this.router.navigate(x.back);
    }
  }
}