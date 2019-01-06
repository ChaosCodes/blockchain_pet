const MongoClient = require('mongodb').MongoClient;
const md5 = require('md5')
const Web3 = require("web3")

const truffle_connect = require("../connection/app")

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myPetUser';

module.exports = {
  userReg: async function(username, password) {
    const self = this
    const existed = await self.userExist(username)
    if (existed) {
      return false
    }
    const accounts_address = await self.getAddress();
    const client = new MongoClient(url);
    try {
      // Use connect method to connect to the Server
      await client.connect();
      const db = client.db(dbName);
      db.collection('userInfo').insertOne({
        username: username,
        password: md5(password).toString(),
        address: accounts_address
      }, {
        w: 'majority',
        wtimeout: 10000
      });
    } catch (err) {
      console.log(err.stack);
    }
    client.close()
    await truffle_connect.createpet(accounts_address, 0, username)
    return true
  },

  userLogin: async function(username, password) {
    const client = new MongoClient(url);
    let userinfo;
    try {
      // Use connect method to connect to the Server
      await client.connect();
      const db = client.db(dbName);

      userinfo = await db.collection('userInfo').findOne({username: username})
    } catch (err) {
      console.log(err.stack);
    }
    client.close()
    if (!userinfo) return null
    if (md5(password) == userinfo.password) {
      return {
        username: username,
        address: userinfo.address
      }
    }
    return null
  },

  userExist: async function(username) {
    const client = new MongoClient(url);
    let userinfo;
    try {
      // Use connect method to connect to the Server
      await client.connect();
      const db = client.db(dbName);

      userinfo = await db.collection('userInfo').findOne({username: username})
    } catch (err) {
      console.log(err.stack);
    }
    client.close()
    return !!userinfo
  },
  getAddress: async function() {

    const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    const accounts = await web3.eth.getAccounts();
    const client = new MongoClient(url);
    let i = 0;
    try {
      // Use connect method to connect to the Server
      await client.connect();
      const db = client.db(dbName);
      while(true) {
        userinfo = await db.collection('userInfo').findOne({address: accounts[i]})
        if (userinfo == null) {
          break
        }
        i++;
      }
    } catch (err) {
      console.log(err.stack);
    }
    client.close()

    return accounts[i];
  }
}