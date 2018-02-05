import { ActivatedRoute, Router } from '@angular/router';

import { Component } from '@angular/core';
import {InjectUser} from "angular2-meteor-accounts-ui";
import {TitleService} from "../services/title";

// import template from './user-footer.html';

@Component({
  selector: 'user-footer',
  templateUrl: 'user-footer.html'
})
@InjectUser('user')

export class UserFooter {

  constructor(private route: ActivatedRoute, private titleService: TitleService,
    private router: Router) {
  }
  ngOnInit() {
  }
}