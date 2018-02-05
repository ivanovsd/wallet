import {Component, NgZone, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Accounts } from 'meteor/accounts-base';
import { Router } from '@angular/router';

// import template from './recover.component.html';

@Component({
  selector: 'recover',
  templateUrl: 'recover.component.html'
})
export class RecoverComponent implements OnInit {
  recoverForm: FormGroup;
  error: string;

  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.recoverForm = this.formBuilder.group({
      email: ['', Validators.required]
    });

    this.error = '';
  }

  recover() {
    if (this.recoverForm.valid) {
      Accounts.forgotPassword({
        email: this.recoverForm.value.email
      }, (err) => {
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