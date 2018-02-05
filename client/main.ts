import 'angular2-meteor-polyfills';
import 'zone.js';
import 'reflect-metadata';

import { AppModule } from './imports/app/app.module';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

Meteor.startup(() => {
  const subscription = MeteorObservable.autorun().subscribe(() => {
    if (Meteor.loggingIn()) {
      return;
    }
    setTimeout(() => subscription.unsubscribe());
    platformBrowserDynamic().bootstrapModule(AppModule);
  });
});