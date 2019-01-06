const router = require('koa-router')()

const truffle_connect = require("../connection/app")


router.get('/', async (ctx, next) => {
  let username, addr, friendlist;
  if (ctx.session.user) {
    username = ctx.session.user.username
    addr = ctx.session.user.address;
    friendlist = await truffle_connect.getfriends(addr);
  } else {
    username = null
    friendlist = [[], [], []]
  }


  await ctx.render('index', {
    title: 'PetKeep',
    firends: friendlist[0],
    askfirends: friendlist[1],
    receivefirends: friendlist[2],
    username: username
  })
  // ctx.body = ;
  // res.sendFile(__dirname + "/public_static/pet.html");
});

router.get('/signup', async (ctx, next) => {
  if (ctx.session.user) {
    await ctx.render('index', {
      title: 'PetKeep',
      firends: ['firend_A', 'firend_B'],
      askfirends: ['askfriend_1', 'askfriend_2'],
      receivefirends: ['receivefirend_1', 'receivefirend_2'],
      healthValue: 0,
      fullValue: 0
    })
    return;
  }
  await ctx.render('signup', {
    title: 'signup'
  })
});





module.exports = router
