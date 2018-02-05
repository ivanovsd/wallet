import { Directive, HostListener } from '@angular/core';

import {InjectUser} from "angular2-meteor-accounts-ui";
import { Router } from '@angular/router';

// import template from './logout.html';

@Directive({
  selector: '[logout]'
})
@InjectUser('user')

export class LogoutBlock {

  constructor(private router: Router) {
  }

  @HostListener('click') onClick() {
    console.log('directive logout');
    Meteor.logout();
    this.router.navigate(['/']);
  }
}