import * as Client from 'bitcore-wallet-client';

import { Injectable } from '@angular/core';
import { Wallets } from '../../../imports/collections/client';

@Injectable()
export class WalletsService {
  wallets = {};
  imported = {};
  cursor;

  constructor() {
    let self = this;
    console.log('Wallets service: init');

   this.cursor = Wallets.find();

    this.cursor.observeChanges({
      added: function (id, doc: any) {
        console.log('Wallets service: added', id, doc);
        if (!self.wallets[id]) {
          self.wallets[id] = new Client({
            baseUrl: 'https://bws.csgo.group/bws/api',
            timeout: 100000,
            transports: ['polling'],
          });
        }
      },
      changed: function (id, doc) {
        let local: any = Wallets;
        // console.log('Wallets service: changed', id, doc);
        if (doc.mnemonic && typeof doc.mnemonic === 'string') {
          var opts = {
            // name: this.importForm.value.walletName,
            // m: 1, // requiredCopayers
            // n: 1, // totalCopayers
            // myName: '',
            network: 'testnet',
            // passphrase: '',
            // derivationStrategy: 'BIP44',
            account: 0,
          };
          if (!self.imported[id]) {
            self.wallets[id].importFromMnemonic(doc.mnemonic, opts, function(err, data) {
              if (!err) {
                console.log('imported', doc.mnemonic);
                self.imported[id] = true;
                local._collection.update({_id: id}, {
                  $set: {
                    opened: true
                  }
                });
              }
            });
          }
        }
        if (doc.opened) {
          let opts = {
            limit: 3,
            includeExtendedInfo: false
          };
          self.wallets[id].getTxHistory(opts, function(err, data) {
            if (!err) {
              console.log(data);
              local.update({_id: id}, {
                $set: {
                  txHistory: data
                }
              });
            } else {
              console.log(err);
            }
          });
        }
        if (doc.updateBalance || doc.opened) {
          if (self.imported[id]) {
            self.wallets[id].getBalance({
              twoStep: true
            }, function(err, data) {
              console.log(err, data);
              Wallets.update({_id: id}, {
                $set: data
              });
              // totalAmount, lockedAmount, totalConfirmedAmount, lockedConfirmedAmount,
              // availableAmount, availableConfirmedAmount
            });
          }
        }
        if (doc.currentTxp) {
          if (self.imported[id]) {
            if (!doc.currentTxp.txp) {
              self.wallets[id].createTxProposal(doc.currentTxp, function(err, txp) {
                if (!err) {
                  doc.currentTxp.txp = txp;
                  local._collection.update({_id: id}, {
                    $set: {
                      currentTxp: doc.currentTxp
                    }
                  });
                } else {
                  console.log(err);
                }
              });
            } else
            if (doc.currentTxp.txp.status === 'temporary') {
              self.wallets[id].publishTxProposal(doc.currentTxp, function(err, txp) {
                if (!err) {
                  doc.currentTxp.txp = txp;
                  local._collection.update({_id: id}, {
                    $set: {
                      currentTxp: doc.currentTxp
                    }
                  });
                } else {
                  console.log(err);
                }
              });
            } else
            if (doc.currentTxp.txp.status === 'pending') {
              self.wallets[id].signTxProposal(doc.currentTxp.txp, function(err, txp) {
                if (!err) {
                  doc.currentTxp.txp = txp;
                  local._collection.update({_id: id}, {
                    $set: {
                      currentTxp: doc.currentTxp
                    }
                  });
                } else {
                  console.log(err);
                }
              });
            } else
            if (doc.currentTxp.txp.status === 'accepted') {
              self.wallets[id].broadcastTxProposal(doc.currentTxp.txp, function(err, txp) {
                if (!err) {
                  doc.currentTxp.txp = txp;
                  local._collection.update({_id: id}, {
                    $set: {
                      currentTxp: doc.currentTxp
                    }
                  });
                } else {
                  console.log(err);
                }
              });
            }
          }
        }
      }
    });
  }

}