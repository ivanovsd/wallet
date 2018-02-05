import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ROUTES_PROVIDERS, routes } from './app.routes';

import { AUTH_DECLARATIONS } from "./auth/index";
import { AccountBackupPage } from '../pages/account/backup';
import { AccountRestorePage } from '../pages/account/restore';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { BrowserModule } from '@angular/platform-browser';
import {BwcService} from "../services/bwc";
import { CreatePersonalWalletPage } from '../pages/wallets/create-personal';
import { LandingPage } from '../pages/landing/landing';
import { LogoutBlock } from '../blocks/logout/logout';
import { MomentModule } from 'angular2-moment';
import { MyApp } from './app.component';
import { NewWalletPage } from '../pages/wallets/new-wallet';
import { RouterModule } from '@angular/router';
import { SettingsPage } from '../pages/settings/settings';
import {TitleService} from "../services/title";
import {TxActivityPage} from "../pages/tx/activity";
import { TxReceivePage } from '../pages/tx/receive';
import { TxSendAmountPage } from '../pages/tx/send-amount';
import { TxSendAmountWalletPage } from '../pages/tx/send-amount-wallet';
import { TxSendConfirmPage } from '../pages/tx/send-confirm';
import { TxSendConfirmWalletPage } from '../pages/tx/send-confirm-wallet';
import { TxSendPage } from '../pages/tx/send';
import { UserFooter } from '../layouts/user-footer';
import { UserHeader } from '../layouts/user-header';
import { WalletBackupPage } from '../pages/wallets/wallet-backup';
import { WalletDeletePage } from '../pages/wallets/wallet-delete';
import { WalletImportPage } from '../pages/wallets/wallet-import';
import { WalletSettingsPage } from '../pages/wallets/wallet-settings';
import { WalletViewPage } from '../pages/wallets/wallet-view';
import { WalletsPage } from '../pages/wallets/wallets';
import {WalletsService} from "../services/wallets";

@NgModule({
  declarations: [
    MyApp,
    LandingPage,
    NewWalletPage,
    WalletsPage,
    SettingsPage,
    WalletViewPage,
    WalletSettingsPage,
    WalletBackupPage,
    WalletImportPage,
    WalletDeletePage,
    AccountBackupPage,
    AccountRestorePage,
    TxActivityPage,
    TxReceivePage,
    TxSendPage,
    TxSendAmountPage,
    TxSendAmountWalletPage,
    TxSendConfirmPage,
    TxSendConfirmWalletPage,
    LogoutBlock,
    UserHeader,
    UserFooter,
    CreatePersonalWalletPage,
    AUTH_DECLARATIONS
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    RouterModule.forRoot(routes)
    // AccountsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LandingPage
  ],
  providers: [
    // walletClient,
    { provide: WalletsService, useClass: WalletsService },
    { provide: BwcService, useClass: BwcService },
    { provide: TitleService, useClass: TitleService },
    { provide: ErrorHandler, useClass: IonicErrorHandler }, ROUTES_PROVIDERS
  ]
})

export class AppModule {}