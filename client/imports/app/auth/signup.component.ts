import {Component, NgZone, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Accounts } from 'meteor/accounts-base';
import { Router } from '@angular/router';

// import template from './signup.component.html';

@Component({
  selector: 'signup',
  templateUrl: 'signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  error: string;

  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.error = '';
  }

  signup() {
    console.log('signup', this.signupForm.valid, this.signupForm.value.email)
    if (this.signupForm.valid) {
      Accounts.createUser({
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      }, (err) => {
        if (err) {
          this.zone.run(() => {
            this.error = err;
          });
        } else {
          this.router.navigate(['/wallets']);
        }
      });
    }
  }
}