import {AccountBackupPage} from "../pages/account/backup";
import {AccountRestorePage} from "../pages/account/restore";
import {CreatePersonalWalletPage} from "../pages/wallets/create-personal";
import {LandingPage} from "../pages/landing/landing";
import {LoginComponent} from "./auth/login.component";
import {NewWalletPage} from "../pages/wallets/new-wallet";
import {RecoverComponent} from "./auth/recover.component";
import {ResetComponent} from "./auth/reset.component";
import { Route } from '@angular/router';
import {SettingsPage} from "../pages/settings/settings";
import {SignupComponent} from "./auth/signup.component";
import {TxActivityPage} from "../pages/tx/activity";
import {TxReceivePage} from "../pages/tx/receive";
import {TxSendAmountPage} from "../pages/tx/send-amount";
import {TxSendAmountWalletPage} from "../pages/tx/send-amount-wallet";
import {TxSendConfirmPage} from "../pages/tx/send-confirm";
import {TxSendConfirmWalletPage} from "../pages/tx/send-confirm-wallet";
import {TxSendPage} from "../pages/tx/send";
import {WalletBackupPage} from "../pages/wallets/wallet-backup";
import {WalletDeletePage} from "../pages/wallets/wallet-delete";
import {WalletImportPage} from "../pages/wallets/wallet-import";
import {WalletSettingsPage} from "../pages/wallets/wallet-settings";
import {WalletViewPage} from "../pages/wallets/wallet-view";
import {WalletsPage} from "../pages/wallets/wallets";

export const routes: Route[] = [
  { path: '', component: LandingPage },
  {
    path: 'wallets',
    component: WalletsPage,
    // canActivate: ['canActivateForLoggedIn']
  },
  {
    path: 'wallet/:walletId',
    component: WalletViewPage,
    // canActivate: ['canActivateForLoggedIn']
  },
  {
    path: 'wallet-settings/:walletId',
    component: WalletSettingsPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Wallet Settings',
      back: ['/wallets']
    }
  },
  {
    path: 'wallet-backup/:walletId',
    component: WalletBackupPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Backup Wallet',
      back: ['/settings']
    }
  },
  {
    path: 'wallet-delete/:walletId',
    component: WalletDeletePage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Delete Wallet',
      back: ['/settings']
    }
  },
  {
    path: 'activity',
    component: TxActivityPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Recent Transactions',
      back: ['/wallets']
    }
  },
  {
    path: 'receive',
    component: TxReceivePage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Receive',
      back: ['/wallets']
    }
  },
  {
    path: 'send',
    component: TxSendPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Send',
      back: ['/wallets']
    }
  },
  {
    path: 'send-amount/:address',
    component: TxSendAmountPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Enter Amount',
      back: ['/send']
    }
  },
  {
    path: 'send-amount-wallet/:walletId',
    component: TxSendAmountWalletPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Enter Amount',
      back: ['/send']
    }
  },
  {
    path: 'send-confirm/:address/:amount',
    component: TxSendConfirmPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Confirm',
      back: ['/send']
    }
  },
  {
    path: 'send-confirm-wallet/:walletId/:amount',
    component: TxSendConfirmWalletPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Confirm',
      back: ['/send']
    }
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'recover', component: RecoverComponent },
  {
    path: 'account-backup',
    component: AccountBackupPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Backup Account',
      back: ['/settings']
    }
  },
  {
    path: 'account-restore',
    component: AccountRestorePage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Restore Account',
      back: ['/settings']
    }
  },
  {
    path: 'settings',
    component: SettingsPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Settings',
      back: ['/wallets']
    }
  },
  { path: 'reset-password/:token', component: ResetComponent },
  {
    path: 'new-wallet',
    component: NewWalletPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Add Wallet',
      back: ['/wallets']
    }
  },
  {
    path: 'create-personal',
    component: CreatePersonalWalletPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Create Personal Wallet',
      back: ['/new-wallet']
    }
  },
  {
    path: 'create-shared',
    component: NewWalletPage,
    // canActivate: ['canActivateForLoggedIn']
  },
  {
    path: 'join-shared',
    component: NewWalletPage,
    // canActivate: ['canActivateForLoggedIn']
  },
  {
    path: 'wallet-import',
    component: WalletImportPage,
    // canActivate: ['canActivateForLoggedIn'],
    data: {
      title: 'Import Wallet',
      back: ['/new-wallet']
    }
  }
];

export const ROUTES_PROVIDERS = [];
// {
//   provide: 'canActivateForLoggedIn',
//   useValue: true, // () => !! Meteor.userId()
// }, {
//   provide: 'canActivateForLoggedOut',
//   useValue: true, // () => Meteor.userId()
// }];