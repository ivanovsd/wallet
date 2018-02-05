import {Component, NgZone, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Accounts } from 'meteor/accounts-base';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

// import template from './reset.component.html';

@Component({
  selector: 'reset',
  templateUrl: 'reset.component.html'
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup;
  token: string;
  error: string;

  constructor(private route: ActivatedRoute, private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    });

    this.route.params
      .map(params => params['token'])
      .subscribe(token => this.token = token);

    this.error = '';
  }

  isNotEmpty(value) {
    return true;
  }

  areValidPasswords(password, passwordConfirm) {
    return true;
  }

  reset() {
    let token = this.token;
    let password = this.resetForm.value.password;
    let passwordConfirm = this.resetForm.value.passwordConfirm;
    if (this.resetForm.valid && this.isNotEmpty(password) && this.areValidPasswords(password, passwordConfirm)) {
      Accounts.resetPassword(token, password, (err) => {
        if (err) {
          this.zone.run(() => {
            this.error = err;
          });
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }
}