const router = require('koa-router')()
const authmodle = require('../model/auth')


router.prefix('/auth')

router.post('/logout', async (ctx, next) => {
  ctx.session.user = null
  ctx.body = `success logout`
})

router.use(hasLogined)

router.post('/login', async (ctx, next) => {
  // console.log(ctx.request.body)
  const parameter = ctx.request.body
  const value = await authmodle.userLogin(parameter.username, parameter.password)
  if (value) {
    ctx.session.user = {
      username: parameter.username,
      address: value.address
    };
    ctx.body = {
      value: true,
      msg: `success login`
    }
    
  } else {
    ctx.body = {
      value: false,
      msg: `password wrong`
    }
  }
})



router.post('/register', async (ctx, next) => {
  const parameter = ctx.request.body
  const value = await authmodle.userReg(parameter.username, parameter.password)
  console.log(value)
  ctx.body = value
})




async function hasLogined(ctx, next) {
  if (ctx.session.user) {
    ctx.body = {
      value: false,
      msg: `has logined`
    }
    return
  }
  await next()
}

module.exports = router
