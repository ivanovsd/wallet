import * as Client from 'bitcore-wallet-client';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { GlobalData } from '../../global-data';
import {InjectUser} from "angular2-meteor-accounts-ui";
import { MeteorObservable } from 'meteor-rxjs';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Wallet } from '../../../../imports/models';
import { Wallets } from '../../../../imports/collections/client';

// import { localWallets } from '../../../../imports/client/collections';

// import template from './';

// import { WalletClient } from 'bitcore-wallet-client';

@Component({
  templateUrl: 'create-personal.html'
})
@InjectUser('user')

export class CreatePersonalWalletPage implements OnInit {
  title: string;
  default: Object;
  setupForm: FormGroup;
  user: Meteor.User;
  wallet;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.setupForm = this.formBuilder.group({
      walletName: ['', Validators.required],
    });
    this.wallet = new Client({
      baseUrl: 'https://bws.csgo.group/bws/api',
      timeout: 100000,
      transports: ['polling'],
    });
    // this.wallet = new walletClient({
    //     baseUrl: 'https://bws.csgo.group/bws/api',
    //     timeout: 100000,
    //     transports: ['polling'],
    // });
    this.default = {
      bwsurl: 'https://bws.csgo.group/bws/api',
    };
  }

  ngOnInit() {
  }

  create() {
    var opts = {
      name: this.setupForm.value.walletName,
      m: 1, // requiredCopayers
      n: 1, // totalCopayers
      myName: '',
      network: 'testnet',
      // bwsurl: 'https://bws.csgo.group/bws/api',
      // singleAddress: false,
      // coin: 'btc'
    };
    var wallet = this.wallet;
    // Wallets.insert({
    //   xPrivKey: 'test'
    // });
    wallet.seedFromRandomWithMnemonic(opts);
    wallet.createWallet(opts.name, opts.myName, opts.m, opts.n, {
      network: opts.network
    }, function(err, secret) {
      if (err) {
        console.log('error: ',err);
        return
      };
      console.log('Wallet Created. Share this secret with your copayers: ' + secret);
      try {
        Wallets.insert(JSON.parse(wallet.export()));
      } catch(e) {}
    });
  }
}

/*
    $scope.create = function() {

      var opts = {
        name: $scope.formData.walletName,
        m: $scope.formData.requiredCopayers,
        n: $scope.formData.totalCopayers,
        myName: $scope.formData.totalCopayers > 1 ? $scope.formData.myName : null,
        networkName: $scope.formData.testnetEnabled && $scope.formData.coin != 'bch' ? 'testnet' : 'livenet',
        bwsurl: $scope.formData.bwsurl,
        singleAddress: $scope.formData.singleAddressEnabled,
        walletPrivKey: $scope.formData._walletPrivKey, // Only for testing
        coin: $scope.formData.coin
      };

      var setSeed = $scope.formData.seedSource.id == 'set';
      if (setSeed) {

        var words = $scope.formData.privateKey || '';
        if (words.indexOf(' ') == -1 && words.indexOf('prv') == 1 && words.length > 108) {
          opts.extendedPrivateKey = words;
        } else {
          opts.mnemonic = words;
        }
        opts.passphrase = $scope.formData.passphrase;

        var pathData = derivationPathHelper.parse($scope.formData.derivationPath);
        if (!pathData) {
          popupService.showAlert(gettextCatalog.getString('Error'), gettextCatalog.getString('Invalid derivation path'));
          return;
        }

        opts.account = pathData.account;
        opts.networkName = pathData.networkName;
        opts.derivationStrategy = pathData.derivationStrategy;

      } else {
        opts.passphrase = $scope.formData.createPassphrase;
      }

      if (setSeed && !opts.mnemonic && !opts.extendedPrivateKey) {
        popupService.showAlert(gettextCatalog.getString('Error'), gettextCatalog.getString('Please enter the wallet recovery phrase'));
        return;
      }

      if ($scope.formData.seedSource.id == walletService.externalSource.ledger.id || $scope.formData.seedSource.id == walletService.externalSource.trezor.id || $scope.formData.seedSource.id == walletService.externalSource.intelTEE.id) {
        if ($scope.formData.coin == 'bch') {
          popupService.showAlert(gettextCatalog.getString('Error'), gettextCatalog.getString('Hardware wallets are not yet supported with Bitcoin Cash'));
          return;
        }

        var account = $scope.formData.account;
        if (!account || account < 1) {
          popupService.showAlert(gettextCatalog.getString('Error'), gettextCatalog.getString('Invalid account number'));
          return;
        }

        if ($scope.formData.seedSource.id == walletService.externalSource.trezor.id || $scope.formData.seedSource.id == walletService.externalSource.intelTEE.id)
          account = account - 1;

        opts.account = account;
        ongoingProcess.set('connecting ' + $scope.formData.seedSource.id, true);

        var src;
        switch ($scope.formData.seedSource.id) {
          case walletService.externalSource.ledger.id:
            src = ledger;
            break;
          case walletService.externalSource.trezor.id:
            src = trezor;
            break;
          case walletService.externalSource.intelTEE.id:
            src = intelTEE;
            break;
          default:
            popupService.showAlert(gettextCatalog.getString('Error'), 'Invalid seed source id');
            return;
        }

        src.getInfoForNewWallet(opts.n > 1, account, opts.networkName, function(err, lopts) {
          ongoingProcess.set('connecting ' + $scope.formData.seedSource.id, false);
          if (err) {
            popupService.showAlert(gettextCatalog.getString('Error'), err);
            return;
          }
          opts = lodash.assign(lopts, opts);
          _create(opts);
        });
      } else {
        _create(opts);
      }
    };

    function _create(opts) {
      ongoingProcess.set('creatingWallet', true);
      $timeout(function() {
        profileService.createWallet(opts, function(err, client) {
          ongoingProcess.set('creatingWallet', false);
          if (err) {
            $log.warn(err);
            popupService.showAlert(gettextCatalog.getString('Error'), err);
            return;
          }

          walletService.updateRemotePreferences(client);
          pushNotificationsService.updateSubscription(client);

          if ($scope.formData.seedSource.id == 'set') {
            profileService.setBackupFlag(client.credentials.walletId);
          }

          $ionicHistory.removeBackView();

          if (!client.isComplete()) {
            $ionicHistory.nextViewOptions({
              disableAnimate: true
            });
            $state.go('tabs.home');
            $timeout(function() {
              $state.transitionTo('tabs.copayers', {
                walletId: client.credentials.walletId
              });
            }, 100);
          } else $state.go('tabs.home');
        });
      }, 300);
    }
*/