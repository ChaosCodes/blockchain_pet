const router = require('koa-router')()
const truffle_connect = require("../connection/app.js")
const Web3 = require("web3")

router.prefix('/api')

router.use(hasLogined)

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get("/getBalance", async (ctx, next) => {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  let balance = 0;
  if (ctx.session.user) {
    const addr = ctx.session.user.address
    balance = await web3.eth.getBalance(addr);
  }
  ctx.body = balance
});

router.post('/createPet', async (ctx, next) => {
  console.log(ctx.session.user.address)
  ctx.body = await truffle_connect.createpet(ctx.session.user.address, 0, 'pipi')
})

router.get('/petInfo', async (ctx, next) => {
  ctx.body = await truffle_connect.getpet(ctx.session.user.address)
})

router.post('/exercise', async (ctx, next) => {
  const addr = ctx.session.user.address;
  return await truffle_connect.exercise(addr);
})
router.post('/food', async (ctx, next) => {
  const addr = ctx.session.user.address;
  return await truffle_connect.Getfood(addr);
})



router.post('/medicine', async (ctx, next) => {
  const addr = ctx.session.user.address;
  return await truffle_connect.medicine(addr);
})

router.get("/getAccounts", async (ctx, next) => {
  console.log("**** GET /getAccounts ****");
  truffle_connect.start(function(answer) {
    console.log(answer);
  });
});

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})


async function hasLogined(ctx, next) {
  if (!ctx.session.user) {
    ctx.body = {
      value: false,
      msg: "has no login"
    }
    return;
  }
  await next()
}

module.exports = router
