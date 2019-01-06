const contract = require('truffle-contract');
const pet_artifact = require('../build/contracts/pet.json');

var pet_contract = contract(pet_artifact);

pet_contract.defaults({
  from : "0xbefc1942822bc2f00a389da8ad496bb944f81c64",
  gas: 4712388, gasPrice: 100000000000
});

module.exports = {
  start: function(callback) {
    var self = this;
    
    // Bootstrap the MetaCoin abstraction for Use.
    pet_contract.setProvider(self.web3.currentProvider);
    pet_contract.currentProvider.sendAsync = function () {
      return pet_contract.currentProvider.send.apply(pet_contract.currentProvider, arguments);
    };

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });
  },
  getpet: async function(account) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    pet_contract.setProvider(self.web3.currentProvider);
    pet_contract.currentProvider.sendAsync = function () {
      return pet_contract.currentProvider.send.apply(pet_contract.currentProvider, arguments);
    };
    const meta = await pet_contract.deployed();
    meta.getThePet.sendTransaction(account, {from: account});
    const detail = await meta.getThePet.call(account, {from: account});
    if (detail) return detail;
    else {
      return [null, null, null, null, null]
    }
   
  },
  Getfood: async function(account) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    pet_contract.setProvider(self.web3.currentProvider);
    pet_contract.currentProvider.sendAsync = function () {
      return pet_contract.currentProvider.send.apply(pet_contract.currentProvider, arguments);
    };
    const meta = await pet_contract.deployed();
    return await meta.purchase.sendTransaction(false, {from: account, value: 10000});
  },
  medicine: async function(account) {
    var self = this;
    
    // Bootstrap the MetaCoin abstraction for Use.
    pet_contract.setProvider(self.web3.currentProvider);
    pet_contract.currentProvider.sendAsync = function () {
      return pet_contract.currentProvider.send.apply(pet_contract.currentProvider, arguments);
    };
    const meta = await pet_contract.deployed();
    return await meta.purchase.sendTransaction(true, {from: account, value: 10000});
   
  },
  getfriendspet: async function(otheraccount, account) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    pet_contract.setProvider(self.web3.currentProvider);

    const meta = await pet_contract.deployed();
    return meta.getFriendPet.call(otheraccount, {from: account});
    
  },
  
  getfriends: async function(account) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    pet_contract.setProvider(self.web3.currentProvider);
    pet_contract.currentProvider.sendAsync = function () {
      return pet_contract.currentProvider.send.apply(pet_contract.currentProvider, arguments);
    };

    const meta = await pet_contract.deployed();
    return await meta.getfriendlist.call({from: account});
   
  },
  askforfriends: async function(account, friend) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    pet_contract.setProvider(self.web3.currentProvider);

    const meta = await pet_contract.deployed();
    return meta.askforfriend.sendTransaction(friend, {from: account});
   
  },
  receivefriends: async function(account, friend) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    pet_contract.setProvider(self.web3.currentProvider);

    const meta = await pet_contract.deployed();
    return meta.acceptfriend.sendTransaction(friend, {from: account});
   
  },
  exercise: async function(account) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    pet_contract.setProvider(self.web3.currentProvider);
    pet_contract.currentProvider.sendAsync = function () {
      return pet_contract.currentProvider.send.apply(pet_contract.currentProvider, arguments);
    };
    console.log('exi')
    const meta = await pet_contract.deployed();
    return meta.exercise.sendTransaction({from: account});
   
  },
  feedforFriend: async function(account, friend) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    pet_contract.setProvider(self.web3.currentProvider);

    const meta = await pet_contract.deployed();
    return meta.feedforFriend.sendTransaction(friend, {from: account, value: 10000});
   
  },
  createpet: async function(account, kind, name) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    pet_contract.setProvider(self.web3.currentProvider);
    pet_contract.currentProvider.sendAsync = function () {
      return pet_contract.currentProvider.send.apply(pet_contract.currentProvider, arguments);
    };

    let meta;
    pet_contract.deployed().then(function(instance) {
      meta = instance;
      return meta.createPet.sendTransaction(kind, name, {from: account});
    }).then(function(value) {
        console.log(value.valueOf());
    }).catch(function(e) {
        console.log(e);
    });
   
  }
}
