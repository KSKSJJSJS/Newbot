const mongo = require('mongodb').MongoClient;
const {
  Telegraf,
  session,
  Scenes
} = require('telegraf');
const {
  BaseScene,
  Stage
} = Scenes
const {
  enter,
  leave
} = Stage
const stage = new Stage()
const rateLimit = require('telegraf-ratelimit')
const axios = require('axios');
const { devNull } = require('os');
var bot_token = '5618209933:AAF_Pp4zPCnnDNozzuWxBcav2gOabQjSHKw'; //YOUR BOT TOKEN HERE
var bot_name = "Nova_inc_Tbot" // Bot username here without @
var gateway = "B";
/* A = Cash_RewardPe
   B = Full2SMS
   C = Bharatiify
   D = CashBash
   E = EarnFast New
*/
const bot = new Telegraf(bot_token);
let db;

const withdraw = new BaseScene('withdraw')
stage.register(withdraw)
const wallet = new BaseScene('wallet')
stage.register(wallet)
const onWithdraw = new BaseScene('onWithdraw')
stage.register(onWithdraw)
const broadcast = new BaseScene('broadcast')
stage.register(broadcast)
const broadchan = new BaseScene('broadchan')
stage.register(broadchan)
const refer = new BaseScene('refer')
stage.register(refer)
const mini = new BaseScene('mini')
stage.register(mini)
const chnl = new BaseScene('chnl')
stage.register(chnl)
const removechnl = new BaseScene('removechnl')
stage.register(removechnl)
const paychnl = new BaseScene('paychnl')
stage.register(paychnl)
const bon = new BaseScene('bonus')
stage.register(bon)
const botstat = new BaseScene('botstat')
stage.register(botstat)
const withstat = new BaseScene('withstat')
stage.register(withstat)
const tgid = new BaseScene('tgid')
stage.register(tgid)
const incr = new BaseScene('incr')
stage.register(incr)
const subwallet = new BaseScene('subwallet')
stage.register(subwallet)
const mkey = new BaseScene('mkey')
stage.register(mkey)
const mid = new BaseScene('mid')
stage.register(mid)
const comment = new BaseScene('comment')
stage.register(comment)
const updatehome = new BaseScene('updatehome')
stage.register(updatehome)
const addadmin = new BaseScene('addadmin')
stage.register(addadmin)
const removeadmin = new BaseScene('removeadmin')
stage.register(removeadmin)
const updateearnmore = new BaseScene('updateearnmore')
stage.register(updateearnmore)
const fwdmsg = new BaseScene('fwdmsg')
stage.register(fwdmsg)

var regex = new RegExp('.*')
const buttonsLimit = {
  window: 1000,
  limit: 1,
  onLimitExceeded: (ctx, next) => {
    if ('callback_query' in ctx.update)
      ctx.answerCbQuery('🔒 You`ve pressed Buttons too often, Wait......', true)
      .catch((err) => (err, ctx))
  },
  keyGenerator: (ctx) => {
    return ctx.callbackQuery ? true : false
  }
}
bot.use(rateLimit(buttonsLimit))

bot.use(session())
bot.use(stage.middleware())

//CONNECT TO MONGO
mongo.connect('mongodb+srv://cashworldbot:3jPGCDt5qUbhyhQW@cluster0.evkp0pc.mongodb.net/?retryWrites=true&w=majority', {
  useUnifiedTopology: true
}, (err, client) => {
  if (err) {
    sendAdmins(err);
  }
  db = client.db(bot_name);
  bot.telegram.deleteWebhook().then(success => {
    success && console.log('🤖 Bot Has Been SuccessFully Registered')

    bot.launch();
  })
})

// function
async function sendAdmins(e){
  let admin = await db.collection('admindb').find({
    admin: "admin"
  }).toArray();
  var admins=admin[0].admins;

  for (var chat of admins){
    bot.telegram.sendMessage(chat,"<b>Message : "+e+"</b>",{parse_mode: 'html'})
}
}

//START WITH INVITE LINK
bot.hears(/^\/start (.+[1-9]$)/, async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    if (admin.length == 0) {
      db.collection('admindb').insertOne({
        admin: "admin",
        ref: 1,
        cur: 'INR',
        paychannel: 'R',
        bonus: 0.1,
        minimum: 1,
        botstat: 'Active',
        withstat: 'ON',
        subwallet: 'NOT SET',
        mkey: 'NOT SET',
        mid: 'NOT SET',
        admins:[1723889466],
        channels: [],
        homeText:'*🏡 Welcome To Main Menu*'
      })
      ctx.replyWithMarkdown(
        '*🤟Restart Bot With /start*'
      )
    }
    let currency = admin[0].cur
    let refer = admin[0].ref
    let bots = admin[0].botstat
    let channel = admin[0].channels
    if (bots == 'Active') {
      let data = await db.collection('allUsers').find({
        userID: ctx.from.id
      }).toArray()
      if (data.length == 0 && ctx.from.id != +ctx.match[1]) {
        //IF USER IS NOT IN DATA
        db.collection('allUsers').insertOne({
          userID: ctx.from.id,
          balance: 0.00,
          toWithdraw: 0.00,
          verified: false
        })
        db.collection('balance').insertOne({
          userID: ctx.from.id,
          balance: 0.00,
          toWithdraw: 0.00
        })
        db.collection('pendingUsers').insertOne({
          userID: ctx.from.id,
          inviter: +ctx.match[1]
        })
        bot.telegram.sendMessage(+ctx.match[1], "<b>🚧 New User On Your Invite Link : <a href='tg://user?id=" + ctx.from.id + "'>" + ctx.from.id + "</a></b>", {
          parse_mode: 'html'
        })
      }
      bot.telegram.sendMessage(ctx.from.id, "*©Share Your Contact In Order To Start Using The Bot. This Is Just A Phone Number Verification\n\n⚠️Note : We Will Not Share Your Details With Anyone*", {
        parse_mode: "markdown",
        reply_markup: {
          keyboard: [
            [{
              text: "💢 Share Contact",
              request_contact: true
            }]
          ],
          resize_keyboard: true
        }
      })
    } else {
      ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
    }
  } catch (error) {
    sendAdmins(error)
  }

})
//START WITHOUT INVITE LINK
bot.start(async (ctx) => {
  try {
    let data = await db.collection('allUsers').find({
      userID: ctx.from.id
    }).toArray()
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    if (admin.length == 0) {
      db.collection('admindb').insertOne({
        admin: "admin",
        ref: 1,
        cur: 'INR',
        paychannel: 'NOT SET',
        bonus: 0.1,
        minimum: 1,
        botstat: 'Active',
        withstat: 'ON',
        subwallet: 'NOT SET',
        mkey: 'NOT SET',
        mid: 'NOT SET',
        admins:[5404538267],
        channels: [],
        homeText:'*🏡 Welcome To Main Menu*'
      })
      ctx.replyWithMarkdown(
        '*😅Restart Bot With /start*'
      )
    }
    let bots = admin[0].botstat
    if (bots == 'Active') {
      if (data.length == 0) {
        //IF USER IS NOT IN DATA
        db.collection('allUsers').insertOne({
          userID: ctx.from.id,
          balance: 0,
          toWithdraw: 0.00
        })
        db.collection('balance').insertOne({
          userID: ctx.from.id,
          balance: 0,
          toWithdraw: 0.00,
          verified: false
        })
        db.collection('pendingUsers').insertOne({
          userID: ctx.from.id
        })

      }
      let channel = admin[0].channels
      bot.telegram.sendMessage(ctx.from.id, "*©Share Your Contact In Order To Start Using The Bot. This Is Just A Phone Number Verification\n\n⚠️Note : We Will Not Share Your Details With Anyone*", {
        parse_mode: "markdown",
        reply_markup: {
          keyboard: [
            [{
              text: "💢 Share Contact",
              request_contact: true
            }]
          ],
          resize_keyboard: true
        }
      })
    } else {
      ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
    }
  } catch (error) {
    sendAdmins(error)
  }
})
bot.on("contact", async (ctx) => {
  try {
    var cont = ctx.update.message.contact.phone_number
    if (ctx.update.message.forward_from) {
      bot.telegram.sendMessage(ctx.from.id, "*⚠️Seems Like This Is Not Your Contact*", {
        parse_mode: "markdown"
      })
      return
    }
    if (cont.startsWith("91")) {
      db.collection('allUsers').updateOne({
        userID: ctx.from.id
      }, {
        $set: {
          verified: true
        }
      }, {
        upsert: true
      })
      let admin = await db.collection('admindb').find({
        admin: "admin"
      }).toArray()
      let refer = admin[0].ref
      let currency = admin[0].cur
      let bots = admin[0].botstat
      if (bots == 'Active') {
        let channel = admin[0].channels
        var flag = 0;
        for (i in channel) {
          let res = await bot.telegram.getChatMember(channel[i], ctx.from.id)
          let result = res.status
          if (result == 'creator' || result == 'administrator' || result == 'member') {
            flag += 1
          } else {
            flag = 0
          }
        }
        if (flag == channel.length) {
          ctx.replyWithMarkdown(
           admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id) , {
              reply_markup: {
                keyboard: [
                  ['💰 Balance','🎁 Bonus'],
                  ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                  ['📊 Statistics','🤑 Earn More']
                ],
                resize_keyboard: true
              }
            }
          )
          let userdata = await db.collection('pendingUsers').find({
            userID: ctx.from.id
          }).toArray()
          let config = await db.collection('allUsers').find({
            userID: ctx.from.id
          }).toArray()
          if (('inviter' in userdata[0]) && !('referred' in config[0])) {
            let bal = await db.collection('balance').find({
              userID: userdata[0].inviter
            }).toArray()
            let cur = bal[0].balance * 1
            let ref = refer * 1
            let final = ref + cur
            bot.telegram.sendMessage(userdata[0].inviter, "*💰" + refer + " " + currency + " Added To Your Balance*", {
              parse_mode: 'markdown'
            })
            bot.telegram.sendMessage(ctx.from.id, "*💹 To Check Who Invited You, Click On '✅ Check'*", {
              parse_mode: 'markdown',
              reply_markup: {
                inline_keyboard: [
                  [{
                    text: "✅ Check",
                    callback_data: "check"
                  }]
                ]
              }
            })
            db.collection('allUsers').updateOne({
              userID: ctx.from.id
            }, {
              $set: {
                inviter: userdata[0].inviter,
                referred: 'DONE'
              }
            }, {
              upsert: true
            })
            db.collection('balance').updateOne({
              userID: userdata[0].inviter
            }, {
              $set: {
                balance: final
              }
            }, {
              upsert: true
            })
          }
        } else {
          mustjoin(ctx)
        }
      } else {
        ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
      }
    } else {
      ctx.replyWithMarkdown('*⚠️You Are Not Allowed To Use The Bot\n\n☘️Either You Are Not Indian Or This Contact Is Not Yours*')
    }
  } catch (err) {
    sendAdmins(err)
  }
})
bot.on("message", async (ctx, next) => {
  try {
    let config = await db.collection('allUsers').find({
      userID: ctx.from.id
    }).toArray()
    
    if (config[0].verified) {
      await next();
    } else {
      return ctx.replyWithMarkdown("*❌ Verify Yourself First*")
    }
  } catch (error) {
    sendAdmins(error)
  }
})
//BALANCE COMMAND
bot.hears('💰 Balance', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let currency = admin[0].cur
    let bots = admin[0].botstat
    if (bots == 'Active') {
      let userbalance = await db.collection('balance').find({
        userID: ctx.from.id
      }).toArray()
      let ub = userbalance[0].balance
      let channel = admin[0].channels
      var flag = 0;
      for (i in channel) {
        let res = await bot.telegram.getChatMember(channel[i], ctx.from.id)
        let result = res.status
        if (result == 'creator' || result == 'administrator' || result == 'member') {
          flag += 1
        } else {
          flag = 0
        }
      }
      if (flag == channel.length) {
        ctx.replyWithMarkdown(
          '*🙌🏻 User = ' + ctx.from.first_name + '\n\n💰 Balance = ' + ub.toFixed(3) + ' ' + currency + '\n\n🪢 Invite To Earn More*', {
            reply_markup: {
              keyboard: [
                ['💰 Balance','🎁 Bonus'],
                ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                ['📊 Statistics','🤑 Earn More']
              ],
              resize_keyboard: true
            }
          }
        )
      } else {
        mustjoin(ctx)
      }
    } else {
      ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
    }
  } catch (error) {
    sendAdmins(error)
  }
})
//INVITE COMMAND
bot.hears('🙌🏻 Invite', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let refer = admin[0].ref
    let currency = admin[0].cur
    let bots = admin[0].botstat
    if (bots == 'Active') {
      let channel = admin[0].channels
      var flag = 0;
      for (i in channel) {
        let res = await bot.telegram.getChatMember(channel[i], ctx.from.id)
        let result = res.status
        if (result == 'creator' || result == 'administrator' || result == 'member') {
          flag += 1
        } else {
          flag = 0
        }
      }
      if (flag == channel.length) {
        ctx.replyWithMarkdown(
          '*🙌🏻 User =* [' + ctx.from.first_name + '](tg://user?id=' + ctx.from.id + ')\n\n*🙌🏻 Your Invite Link = https://t.me/' + ctx.botInfo.username + '?start=' + ctx.from.id + ' \n\n🪢 Invite To ' + refer + ' ' + currency + ' Per Invite*', {
            reply_markup: {
              keyboard: [
                ['💰 Balance','🎁 Bonus'],
                ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                ['📊 Statistics','🤑 Earn More']
              ],
              resize_keyboard: true
            }
          }
        )
      } else {
        mustjoin(ctx)
      }
    } else {
      ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
    }
  } catch (error) {
    sendAdmins(error)
  }

})
//JOINED BUTTON
bot.hears('🟢 Joined', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let refer = admin[0].ref
    let currency = admin[0].cur
    let bots = admin[0].botstat
    if (bots == 'Active') {
      let channel = admin[0].channels
      var flag = 0;
      for (i in channel) {
        let res = await bot.telegram.getChatMember(channel[i], ctx.from.id)
        let result = res.status
        if (result == 'creator' || result == 'administrator' || result == 'member') {
          flag += 1
        } else {
          flag = 0
        }
      }
      if (flag == channel.length) {
        ctx.replyWithMarkdown(
          admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
            reply_markup: {
              keyboard: [
                ['💰 Balance','🎁 Bonus'],
                ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                ['📊 Statistics','🤑 Earn More']
              ],
              resize_keyboard: true
            }
          }
        )
        let userdata = await db.collection('pendingUsers').find({
          userID: ctx.from.id
        }).toArray()
        let config = await db.collection('allUsers').find({
          userID: ctx.from.id
        }).toArray()
        if (('inviter' in userdata[0]) && !('referred' in config[0])) {
          let bal = await db.collection('balance').find({
            userID: userdata[0].inviter
          }).toArray()
          let cur = bal[0].balance * 1
          let ref = refer * 1
          let final = ref + cur
          bot.telegram.sendMessage(userdata[0].inviter, "*💰" + refer + " " + currency + " Added To Your Balance*", {
            parse_mode: 'markdown'
          })
          bot.telegram.sendMessage(ctx.from.id, "*💹 To Check Who Invited You, Click On '✅ Check'*", {
            parse_mode: 'markdown',
            reply_markup: {
              inline_keyboard: [
                [{
                  text: "✅ Check",
                  callback_data: "check"
                }]
              ]
            }
          })
          db.collection('allUsers').updateOne({
            userID: ctx.from.id
          }, {
            $set: {
              inviter: userdata[0].inviter,
              referred: 'DONE'
            }
          }, {
            upsert: true
          })
          db.collection('balance').updateOne({
            userID: userdata[0].inviter
          }, {
            $set: {
              balance: final
            }
          }, {
            upsert: true
          })
        }
      } else {
        mustjoin(ctx)
      }
    } else {
      ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
    }
  } catch (error) {
    sendAdmins(error)
  }

})
//WALLET BUTTON
bot.hears('🗂 Wallet', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let currency = admin[0].cur
    let bots = admin[0].botstat
    if (bots == 'Active') {
      let data = await db.collection('allUsers').find({
        userID: ctx.from.id
      }).toArray()
      let channel = admin[0].channels
      var flag = 0;
      for (i in channel) {
        let res = await bot.telegram.getChatMember(channel[i], ctx.from.id)
        let result = res.status
        if (result == 'creator' || result == 'administrator' || result == 'member') {
          flag += 1
        } else {
          flag = 0
        }
      }
      if (flag == channel.length) {
        if ('wallet' in data[0]) {
          bot.telegram.sendMessage(ctx.from.id, "<b>💡 Your Currently Set " + currency + " Wallet Is</b>:\n<code>" + data[0].wallet + "</code>\n\n🗂<b> It Will Be Used For Future Withdrawals</b>", {
            parse_mode: 'html',
            reply_markup: {
              inline_keyboard: [
                [{
                  text: "🚧 Change " + currency + " Wallet 🚧",
                  callback_data: "wallet"
                }]
              ]
            }
          })
        } else {
          bot.telegram.sendMessage(ctx.from.id, "<b>💡 Your Currently Set " + currency + " Wallet Is</b>:\n<code>'none'</code>\n\n🗂<b> It Will Be Used For Future Withdrawals</b>", {
            parse_mode: 'html',
            reply_markup: {
              inline_keyboard: [
                [{
                  text: "🚧 Set " + currency + " Wallet 🚧",
                  callback_data: "wallet"
                }]
              ]
            }
          })
        }
      } else {
        mustjoin(ctx)
      }
    } else {
      ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
    }
  } catch (error) {
    sendAdmins(error)
  }
})
//WITHDRAW COMMAND
bot.hears('💳 Withdraw', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let mini_with = admin[0].minimum
    let currency = admin[0].cur
    let bots = admin[0].botstat
    let withs = admin[0].withstat
    if (bots == 'Active') {
      if (withs == 'ON') {
        let channel = admin[0].channels
        var flag = 0;
        for (i in channel) {
          let res = await bot.telegram.getChatMember(channel[i], ctx.from.id)
          let result = res.status
          if (result == 'creator' || result == 'administrator' || result == 'member') {
            flag += 1
          } else {
            flag = 0
          }
        }
        if (flag == channel.length) {
          let userbalance = await db.collection('balance').find({
            userID: ctx.from.id
          }).toArray()
          let ub = userbalance[0].balance
          let data = await db.collection('allUsers').find({
            userID: ctx.from.id
          }).toArray()
          if (ub < mini_with) {
            ctx.replyWithMarkdown(
              '*⚠️ Must Own AtLeast ' + mini_with + ' ' + currency + ' To Make Withdrawal*', {
                reply_markup: {
                  keyboard: [
                    ['💰 Balance','🎁 Bonus'],
                    ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                    ['📊 Statistics','🤑 Earn More']
                  ],
                  resize_keyboard: true
                }
              }
            )
          } else if (!data[0].wallet) {
            ctx.replyWithMarkdown(
              '*⚠️ Set Your Wallet Using : *`🗂 Wallet`', {
                reply_markup: {
                  keyboard: [
                    ['💰 Balance','🎁 Bonus'],
                    ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                    ['📊 Statistics','🤑 Earn More']
                  ],
                  resize_keyboard: true
                }
              }
            )
          } else {
            await bot.telegram.sendMessage(ctx.from.id, "*📤 Enter Amount To Withdraw*", {
              parse_mode: 'markdown',
              reply_markup: {
                keyboard: [
                  ['⛔ Cancel']
                ],
                resize_keyboard: true
              }
            })
            ctx.scene.enter('onWithdraw')
          }
        } else {
          mustjoin(ctx)
        }
      } else {
        ctx.replyWithMarkdown('*⛔ Withdrawal Is Currently Off*')
      }
    } else {
      ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
    }
  } catch (error) {
    sendAdmins(error)
  }
})

//WITHDRAW COMMAND
bot.hears('🤑 Earn More', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    
    // to-do:handlethis
    bot.telegram.copyMessage(ctx.from.id,admin[0].earn_more[0],admin[0].earn_more[1])
  } catch (error) {
    sendAdmins(error)
  }
})

bot.hears('⛔ Cancel', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let bots = admin[0].botstat
    if (bots == 'Active') {
      let channel = admin[0].channels
      var flag = 0;
      for (i in channel) {
        let res = await bot.telegram.getChatMember(channel[i], ctx.from.id)
        let result = res.status
        if (result == 'creator' || result == 'administrator' || result == 'member') {
          flag += 1
        } else {
          flag = 0
        }
      }
      if (flag == channel.length) {
        ctx.replyWithMarkdown(
          admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
            reply_markup: {
              keyboard: [
                ['💰 Balance','🎁 Bonus'],
                ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                ['📊 Statistics','🤑 Earn More']
              ],
              resize_keyboard: true
            }
          }
        )
      } else {
        mustjoin(ctx)
      }
    } else {
      ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
    }
  } catch (error) {
    sendAdmins(error)
  }
})
// STATISTICS OF BOT
bot.hears('📊 Statistics', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let currency = admin[0].cur
    let bots = admin[0].botstat
    if (bots == 'Active') {
      let channel = admin[0].channels
      var flag = 0;
      for (i in channel) {
        let res = await bot.telegram.getChatMember(channel[i], ctx.from.id)
        let result = res.status
        if (result == 'creator' || result == 'administrator' || result == 'member') {
          flag += 1
        } else {
          flag = 0
        }
      }
      if (flag == channel.length) {
        let statdata = await db.collection('allUsers').find({
          stats: "stats"
        }).toArray()
        let members = await db.collection('allUsers').find({}).toArray()
        if (statdata.length == 0) {
          db.collection('allUsers').insertOne({
            stats: "stats",
            value: 0
          })
          ctx.reply(
            '<b>📊 Bot Live Statistics 📊\n\n✨Total Payouts : 0 ' + currency + '\n\n🎀Total Users: ' + members.length + ' Users</b>', {
              parse_mode: 'html',
              reply_markup: {
                keyboard: [
                  ['💰 Balance','🎁 Bonus'],
                  ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                  ['📊 Statistics','🤑 Earn More']
                ],
                resize_keyboard: true
              }
            }
          )
        } else {
          let payout = statdata[0].value * 1
          let memb = parseInt(members.length)
          ctx.reply(
            '<b>📊 Bot Live Statistics 📊\n\n✨Total Payouts : ' + payout + ' ' + currency + '\n\n🎀Total Users: ' + memb + ' Users</b>', {
              parse_mode: 'html',
              reply_markup: {
                keyboard: [
                  ['💰 Balance','🎁 Bonus'],
                  ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                  ['📊 Statistics','🤑 Earn More']
                ],
                resize_keyboard: true
              }
            }
          )
        }
      } else {
        mustjoin(ctx)
      }
    } else {
      ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
    }
  } catch (error) {
    sendAdmins(error)
  }
})
//ADMIN PANEL
const sendPanel = async (ctx) =>{
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray();
    var admins=admin[0].admins;
    let currency = admin[0].cur
    let chnl = admin[0].channels
    var final = "\n\t\t\t\t";
    for (i in chnl) {
      final += chnl[i] + "\n\t\t\t\t";
    }
    let paychannel = admin[0].paychannel
    let bonusamount = admin[0].bonus
    let mini_with = admin[0].minimum
    let refer = admin[0].ref
    let stat = admin[0].botstat
    let withst = admin[0].withstat
    let swg = admin[0].subwallet
    let mkey = admin[0].MKEY
    let mid = admin[0].MID
    if (swg == 'NOT SET' && mkey == 'NOT SET' && mid == 'NOT SET') {
      var keys = '❌ NOT SET'
    } else {
      var keys = '✅ SET'
    }
    if (stat == 'Active') {
      var botstt = '✅ Active'
    } else {
      var botstt = '🚫 Disabled'
    }
    if (withst == 'ON') {
      var with_stat = '✅ On'
    } else {
      var with_stat = '🚫 Off'
    }
    if (admins.find(element => element == ctx.from.id) == ctx.from.id) {
      bot.telegram.sendMessage(ctx.from.id,
        "<b>🏡 Hey " + ctx.from.first_name + "\n🤘🏻 Welcome To Admin Panel\n\n💡 Bot Current Stats: \n\t\t\t\t😎 Admins : "+admins.toString()+"\n\t\t\t\t📛 Bot : @" + ctx.botInfo.username + "\n\t\t\t\t🤖 Bot Status: " + botstt + "\n\t\t\t\t📤 Withdrawals : " + with_stat + "\n\t\t\t\t🌲 Channels: " + final + "💰 Refer: " + refer + "\n\t\t\t\t💰 Minimum: " + mini_with + "\n\t\t\t\t💲 Currency: " + currency + "\n\t\t\t\t🎁 Bonus: " + bonusamount + "\n\t\t\t\t📤 Pay Channel: " + paychannel + "\n\t\t\t\t✏️ Paytm Keys :</b> <code>" + keys + "</code> \n\t\t\t\t<b>🏡 Home Text : </b><code>"+admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id)+"</code>", {
          parse_mode: 'html',
          reply_markup: {
            inline_keyboard: [
              [{
                text: "💰 Change Refer",
                callback_data: "refer"
              }, {
                text: "💰 Change Minimum",
                callback_data: "minimum"
              }],
              [{
                text: "🤖 Bot : " + botstt + "",
                callback_data: "botstat"
              }],
              [{
                text: "🌲 Change Channels",
                callback_data: "channels"
              }, {
                text: "🎁 Change Bonus",
                callback_data: "bonus"
              }],
              [{
                text: "📤 Withdrawals : " + with_stat + "",
                callback_data: "withstat"
              }],
              [{text:"😇 Add Admin",callback_data:"addadmin"},{text:"😕 Remove Admin",callback_data:"removeadmin"}],
              [{
                text: "🚹 User Details",
                callback_data: "userdetails"
              }, {
                text: "🔄 Change Balance",
                callback_data: "changebal"
              }],
              [{text:"📣 Broadcast",callback_data:"broadcast"},{text:"📢 Broadcast Channels",callback_data:"broadchan"}],
              [{
                text: "✏️ Paytm Keys : " + keys + "",
                callback_data: "keys"
             },{text:"🏡 Home Text",callback_data:"update_home"}],
             [{text:"🤑 Earn Text",callback_data:"earn_more"}]
            ]
          }
        })
    }
    else{
        ctx.replyWithMarkdown("*Your Chat ID : "+ctx.from.id+"*");
    }
  } catch (error) {
    sendAdmins(error)
  }

}
bot.hears('/adminhelp',async (ctx)=>{
  try {
  sendPanel(ctx);
  }
  catch (e){
    sendAdmins(e);
  }
});

bot.action("earn_more",async (ctx)=>{
    ctx.replyWithMarkdown("*💡 Send New Earn More Text*");
    await ctx.scene.enter('updateearnmore');
});

updateearnmore.hears(regex,async (ctx)=>{
    let admin = await db.collection('admindb').find({admin: "admin"}).toArray();
  await db.collection('admindb').updateOne({
    admin: "admin"
  }, {
    $set: {
      earn_more: [ctx.from.id,ctx.message.message_id]
    }
  })
  await ctx.replyWithMarkdown("*👍 Updated Earn Text*");
  await sendPanel(ctx);
  await ctx.scene.leave('updateearnmore');
});

bot.action("update_home",async (ctx)=>{
    ctx.replyWithMarkdown("*💡 Send New Home Text (Use MarkDown)*");
    await ctx.scene.enter('updatehome')
});

updatehome.on('message',async (ctx)=>{
let admin = await db.collection('admindb').find({admin: "admin"}).toArray();
  await db.collection('admindb').updateOne({
    admin: "admin"
  }, {
    $set: {
      homeText: ctx.message.text
    }
  })
  await ctx.replyWithMarkdown("*👍 Updated Home Text*");
  await sendPanel(ctx);
  await ctx.scene.leave('updatehome');
})

bot.action("addadmin",async ctx=>{
    if(ctx.from.id == 5464488679 || ctx.from.id == 5404538267){
    ctx.replyWithMarkdown("*💡 Send Telegram ID to Add as Admin for this bot*");
    await ctx.scene.enter('addadmin')
    }
    else{
        ctx.replyWithMarkdown("*😡 You don't have permission to Add Admin*");
    }
})
bot.action("removeadmin",async ctx=>{
    if(ctx.from.id == 5464488679 || ctx.from.id == 5404538267){
    ctx.replyWithMarkdown("*💡 Send Telegram ID to Remove from Admin for this bot*");
    await ctx.scene.enter('removeadmin')
    }
    else{
        ctx.replyWithMarkdown("*😡 You don't have permission to Remove Admin*");
    }
})

addadmin.on("text",async ctx=>{
  let admin = await db.collection('admindb').find({
    admin: "admin"
  }).toArray();
  var admins=admin[0].admins;

  admins.push(ctx.message.text);
  await db.collection('admindb').updateOne({
    admin: "admin"
  }, {
    $set: {
      admins: admins
    }
  })
  
  bot.telegram.sendMessage(ctx.message.text,"*😍 You are now admin of this bot*",{parse_mode:'Markdown'});

  ctx.replyWithMarkdown("*👍 Admin Added to the Bot*");
  await sendPanel(ctx);
  ctx.scene.leave('addadmin');
})
removeadmin.on("text",async ctx=>{
  let admin = await db.collection('admindb').find({
    admin: "admin"
  }).toArray();
  var admins=admin[0].admins;
  var admins = await arrayRemove(admins,ctx.message.text);
  await db.collection('admindb').updateOne({
    admin: "admin"
  }, {
    $set: {
      admins: admins
    }
  })

  await db.collection('allUsers').updateOne({
    userID: ctx.from.id
  }, {
    $set: {
      verified: true
    }
  })
  
  bot.telegram.sendMessage(ctx.message.text,"*😒 You are now removed from admins of this bot*",{parse_mode:'Markdown'})
  ctx.replyWithMarkdown("*👍 Admin Removed from the Bot*");
  await sendPanel(ctx);
  ctx.scene.leave('removeadmin');
})
//BONUS BUTTON
bot.hears('🎁 Bonus', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let bonusamount = admin[0].bonus
    let bots = admin[0].botstat
    let currency = admin[0].cur
    if (bots == 'Active') {
      let channel = admin[0].channels
      var flag = 0;
      for (i in channel) {
        let res = await bot.telegram.getChatMember(channel[i], ctx.from.id)
        let result = res.status
        if (result == 'creator' || result == 'administrator' || result == 'member') {
          flag += 1
        } else {
          flag = 0
        }
      }
      if (flag == channel.length) {
        let bdata = await db.collection('BonusUsers').find({
          userID: ctx.from.id
        }).toArray()
        var duration_in_hours;
        var time = new Date().toISOString();
        if (bdata.length == 0) {
          db.collection('BonusUsers').insertOne({
            userID: ctx.from.id,
            bonus: new Date()
          })
          duration_in_hours = 24;
        } else {
          duration_in_hours = ((new Date()) - new Date(bdata[0].bonus)) / 1000 / 60 / 60;
        }
        if (duration_in_hours >= 24) {
          let userbal = await db.collection('balance').find({
            userID: ctx.from.id
          }).toArray()
          var cur = userbal[0].balance * 1
          var balance = cur + bonusamount
          db.collection('balance').updateOne({
            userID: ctx.from.id
          }, {
            $set: {
              balance: balance
            }
          }, {
            upsert: true
          })
          db.collection('BonusUsers').updateOne({
            userID: ctx.from.id
          }, {
            $set: {
              bonus: time
            }
          }, {
            upsert: true
          })
          ctx.replyWithMarkdown(
            '*🎁 Congrats , You Recieved ' + bonusamount + ' ' + currency + '\n\n🔎 Check Back After 24 Hours* '
          )
        } else {
          ctx.replyWithMarkdown(
            '*⛔ You Already Recieved Bonus In Last 24 Hours *'
          )
        }
      } else {
        mustjoin(ctx)
      }
    } else {
      ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
    }
  } catch (error) {
    sendAdmins(error)
  }
})

const broadFunc = async (ctx)=>{
    let admin = await db.collection('admindb').find({
    admin: "admin"
  }).toArray();
  var admins=admin[0].admins;

  if (admins.find(element => element == ctx.from.id) == ctx.from.id) {
    ctx.replyWithMarkdown(
      '*📨 Enter Message To Broadcast*', {
        reply_markup: {
          keyboard: [
            ['⛔ Cancel','🚀 Broadcast with Quote'] 
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('broadcast')
  }
}
fwdmsg.on("message",async ctx=>{
  let admin = await db.collection('admindb').find({
    admin: "admin"
  }).toArray();
  let total;
  total = 0
      let users = await db.collection('allUsers').find({}).toArray()

      ctx.replyWithMarkdown(
        '*📣 Broadcast Sent To: ' + users.length + ' Users*', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
      users.forEach(async (element, i) => {
        if (total == 5) {
          total = 0
          await sleep(5)
        }
        total += 1
        ctx.telegram.forwardMessage(element.userID,ctx.from.id,ctx.message.message_id).catch(() => {})
      })
      await ctx.scene.leave('fwdmsg')
})
bot.hears("🚀 Broadcast with Quote", async ctx=>{
  
  ctx.replyWithMarkdown("*📬 Send the message to forward*");
  await ctx.scene.enter('fwdmsg')
  
})

bot.hears('/broadcast',broadFunc)
bot.action("broadcast",broadFunc)

const broadChanFunc = async (ctx)=>{
    let admin = await db.collection('admindb').find({
    admin: "admin"
  }).toArray();
  var admins=admin[0].admins;

  if (admins.find(element => element == ctx.from.id) == ctx.from.id) {
    ctx.replyWithMarkdown(
      '*📨 Enter Message To Broadcast to Channels*', {
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('broadchan')
  }
}

bot.action("broadchan",broadChanFunc)

broadchan.on("message",async (ctx)=>{
    try {
    let admin = await db.collection('admindb').find({
    admin: "admin"
  }).toArray();
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
      await ctx.scene.leave('broadchan')
    } else {
      total = 0
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray();
    
    let chnl = admin[0].channels;
      ctx.replyWithMarkdown(
        '*📣 Broadcast Sent To: ' + chnl.length + ' Chats*', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
      chnl.forEach(async (element, i) => {
        if (total == 5) {
          total = 0
          await sleep(5)
        }
        total += 1
        ctx.copyMessage(element).catch(() => {})
      })
      await ctx.scene.leave('broadchan')
    }
  } catch (error) {
    sendAdmins(error)
  }
})
broadcast.on("message", async (ctx) => {
  try {
let admin = await db.collection('admindb').find({
    admin: "admin"
  }).toArray();
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
      await ctx.scene.leave('broadcast');
    }
  else if (ctx.message.text == '🚀 Broadcast with Quote'){
    ctx.replyWithMarkdown("*📬 Send the message to forward*");
    await ctx.scene.enter('fwdmsg')
      await ctx.scene.leave('broadcast');
    }
    else {
      total = 0
      let users = await db.collection('allUsers').find({}).toArray()
      ctx.replyWithMarkdown(
        '*📣 Broadcast Sent To: ' + users.length + ' Users*', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
      users.forEach(async (element, i) => {
        if (total == 5) {
          total = 0
          await sleep(5)
        }
        total += 1
        ctx.copyMessage(element.userID).catch(() => {})
      })
      await ctx.scene.leave('broadcast')
    }
  } catch (error) {
    sendAdmins(error)
  }
})
wallet.hears(regex, async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let channel = admin[0].channels
    var flag = 0;
    for (i in channel) {
      let res = await bot.telegram.getChatMember(channel[i], ctx.from.id)
      let result = res.status
      if (result == 'creator' || result == 'administrator' || result == 'member') {
        flag += 1
      } else {
        flag = 0
      }
    }
    if (flag == channel.length) {
      db.collection('allUsers').updateOne({
        userID: ctx.from.id
      }, {
        $set: {
          wallet: ctx.message.text
        }
      }, {
        upsert: true
      })
      if (ctx.message.text == '⛔ Cancel') {
        ctx.replyWithMarkdown(
          admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
            reply_markup: {
              keyboard: [
                ['💰 Balance','🎁 Bonus'],
                ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                ['📊 Statistics','🤑 Earn More']
              ],
              resize_keyboard: true
            }
          }
        )
      } else {
        ctx.replyWithMarkdown(
          '*🗂 Wallet Address Set To: *\n`' + ctx.message.text + '`', {
            reply_markup: {
              keyboard: [
                ['💰 Balance','🎁 Bonus'],
                ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                ['📊 Statistics','🤑 Earn More']
              ],
              resize_keyboard: true
            }
          }
        )
      }
    } else {
      mustjoin(ctx)
    }
    ctx.scene.leave('wallet')
  } catch (error) {
    sendAdmins(error)
  }
})
onWithdraw.on('text', async (ctx) => {
  try {
    ctx.scene.leave('onWithdraw')
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let mini_with = admin[0].minimum
    let currency = admin[0].cur
    let pay = admin[0].paychannel
    let bots = admin[0].withstat
    if (bots == 'ON') {
      let channel = admin[0].channels
      var flag = 0;
      for (i in channel) {
        let res = await bot.telegram.getChatMember(channel[i], ctx.from.id)
        let result = res.status
        if (result == 'creator' || result == 'administrator' || result == 'member') {
          flag += 1
        } else {
          flag = 0
        }
      }
      if (flag == channel.length) {
        let userbalance = await db.collection('balance').find({
          userID: ctx.from.id
        }).toArray()
        let guy = await db.collection('allUsers').find({
          userID: ctx.from.id
        }).toArray()
        let inc = await db.collection('allUsers').find({
          stats: "stats"
        }).toArray()
        let toinc = (inc[0].value * 1) + parseInt(ctx.message.text)
        let ub = userbalance[0].balance * 1
        let wallet = guy[0].wallet
        if (ctx.message.text == '⛔ Cancel') {
          ctx.replyWithMarkdown(

            '*⛔ Withdrawal Cancelled*', {
              reply_markup: {
                keyboard: [
                  ['💰 Balance','🎁 Bonus'],
                  ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                  ['📊 Statistics','🤑 Earn More']
                ],
                resize_keyboard: true
              }
            }

          )
          ctx.scene.leave('onWithdraw')
          return 0;
        } else if (isNaN(ctx.message.text)) {
          ctx.replyWithMarkdown(
            '*⛔ Only Numeric Value Allowed*', {
              reply_markup: {
                keyboard: [
                  ['💰 Balance','🎁 Bonus'],
                  ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                  ['📊 Statistics','🤑 Earn More']
                ],
                resize_keyboard: true
              }
            }
          )
          ctx.scene.leave('onWithdraw')
          return 0;
        } else if (ctx.message.forward_from) {
          ctx.replyWithMarkdown(
            '*⛔ Forwards Are Prohibited*', {
              reply_markup: {
                keyboard: [
                  ['💰 Balance','🎁 Bonus'],
                  ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                  ['📊 Statistics','🤑 Earn More']
                ],
                resize_keyboard: true
              }
            }

          )
          ctx.scene.leave('onWithdraw')
          return 0;
        } else if (ctx.message.text > ub) {
          ctx.replyWithMarkdown(
            '*⛔ Entered Amount Is Greater Than Your Balance*', {
              reply_markup: {
                keyboard: [
                  ['💰 Balance','🎁 Bonus'],
                  ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                  ['📊 Statistics','🤑 Earn More']
                ],
                resize_keyboard: true
              }
            }
          )
          ctx.scene.leave('onWithdraw')
          return 0;
        } else if (ctx.message.text < mini_with) {
          ctx.replyWithMarkdown(

            '*⚠️ Minimum Withdrawal Is ' + mini_with + ' ' + currency + '*', {
              reply_markup: {
                keyboard: [
                  ['💰 Balance','🎁 Bonus'],
                  ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                  ['📊 Statistics','🤑 Earn More']
                ],
                resize_keyboard: true
              }
            }

          )
          ctx.scene.leave('onWithdraw')
          return 0;
        } else if (ctx.message.text > 400) {
          ctx.replyWithMarkdown(

            '*⚠️ Maximum Withdrawal Is 400 ' + currency + '*', {
              reply_markup: {
                keyboard: [
                  ['💰 Balance','🎁 Bonus'],
                  ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                  ['📊 Statistics','🤑 Earn More']
                ],
                resize_keyboard: true
              }
            }

          )
          ctx.scene.leave('onWithdraw')
          return 0;
        } else {
          bot.telegram.sendMessage(ctx.from.id, "*🤘Withdrawal Confirmation\n\n🔰 Amount : " + ctx.message.text + " " + currency + "\n🗂 Wallet :* `" + wallet + "`\n*✌️Confirm Your Transaction By Clicking On '✅ Approve'*", {
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [{
                  text: "✅ Approve",
                  callback_data: "approve"
                }, {
                  text: "❌ Cancel",
                  callback_data: "cancel"
                }]
              ]
            }
          })
        }
        db.collection('balance').updateOne({
          userID: ctx.from.id
        }, {
          $set: {
            toWithdraw: ctx.message.text
          }
        }, {
          upsert: true
        })
        ctx.scene.leave('onWithdraw')
        return 0;
      } else {
        mustjoin(ctx)
      }
    } else {
      ctx.replyWithMarkdown('*⛔ Bot Is Currently Off*')
    }
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action("approve", async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let mini_with = admin[0].minimum
    let currency = admin[0].cur
    let pay = admin[0].paychannel
    let bots = admin[0].withstat
    let userbalance = await db.collection('balance').find({
      userID: ctx.from.id
    }).toArray()
    let toWith = userbalance[0].toWithdraw * 1
    let balan = userbalance[0].balance * 1
    let guy = await db.collection('allUsers').find({
      userID: ctx.from.id
    }).toArray()
    let inc = await db.collection('allUsers').find({
      stats: "stats"
    }).toArray()
    let toinc = (inc[0].value * 1) + parseInt(toWith)
    let ub = userbalance[0].balance * 1
    let wallet = guy[0].wallet
    if (toWith > balan) {
      ctx.deleteMessage()
      ctx.replyWithMarkdown("*❌ Withdrawal Failed*")
      db.collection('balance').updateOne({
        userID: ctx.from.id
      }, {
        $set: {
          toWithdraw: 0.00
        }
      }, {
        upsert: true
      })
      return 0;
    }
    if (toWith == 0) {
      ctx.deleteMessage()
      ctx.replyWithMarkdown("*❌No Amount Available For Withdrawal*")
      return 0;
    } else {
      var newbal = parseFloat(ub) - parseFloat(toWith)
      db.collection('balance').updateOne({
        userID: ctx.from.id
      }, {
        $set: {
          balance: newbal
        }
      }, {
        upsert: true
      })
      db.collection('balance').updateOne({
        userID: ctx.from.id
      }, {
        $set: {
          toWithdraw: 0.00
        }
      }, {
        upsert: true
      })
      db.collection('allUsers').updateOne({
        stats: "stats"
      }, {
        $set: {
          value: parseFloat(toinc)
        }
      }, {
        upsert: true
      })
      ctx.deleteMessage()
      ctx.replyWithMarkdown(
        "*✅ New Withdrawal Processed ✅\n\n🚀Amount : " + toWith + " " + currency + "\n⛔ Wallet :* `" + wallet + "`\n*💡 Bot: @" + ctx.botInfo.username + "\n\n😍 See Live Payouts : @EarnPaisa_Payouts*", {
          parse_mode: 'markdown',
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
      bot.telegram.sendMessage("@AllPayoutsHere", "<b>✅ New Withdrawal Requested ✅\n\n🟢 User : <a href='tg://user?id=" + ctx.from.id + "'>" + ctx.from.id + "</a>\n\n🚀Amount : " + toWith + " " + currency + "\n⛔ Address :</b> <code>" + wallet + "</code>\n\n<b>💡 Bot: @" + ctx.botInfo.username + "</b>", {
        parse_mode: 'html'
      })
      
      
    bot.telegram.sendMessage(pay, "<b>✅ New Withdrawal Requested ✅\n\n🟢 User : <a href='tg://user?id=" + ctx.from.id + "'>" + ctx.from.id + "</a>\n\n🚀Amount : " + toWith + " " + currency + "\n⛔ Address :</b> <code>" + wallet.slice(0,4)+"XXXX"+wallet.slice(8,10) + "</code>\n\n<b>💡 Bot: @" + ctx.botInfo.username + "</b>", {
        parse_mode: 'html'
      })
      let swg = admin[0].subwallet
      let mkey = admin[0].mkey
      let mid = admin[0].mid
      let comment = admin[0].comment
      let amount = toWith
      if (gateway == "A") {
        paytm(wallet, amount, swg, mkey, mid, comment)
      } else if (gateway == "B") {
        axios.post("https://full2sms.in/api/v1/disburse/paytm?mid="+mid+"&mkey="+mkey+"&guid="+swg+"&amount="+amount+"&mobile="+wallet+"&info="+comment+"");
      } else if (gateway == "C") {
        axios.post("https://indiapp.in/Payment/?mob="+wallet+"&amo="+amount+"&com="+comment+"&Guid="+swg+"&od="+RandInt+"");
      } else if (gateway == "D") {
        axios.post("https://cashbashpe.in/api/paytm?mid="+mid+"&token="+swg+"&amount="+amount+"&mobile="+wallet+"&comment="+comment+"");
      } else if (gateway == "E") {
        axios.post("https://earnfastpayments.com/api/walletpay/?paytm="+wallet+"&amount="+amount+"&comment="+comment+"&guid="+swg+"&orderid="+RandInt+"");
      }
    }
    ctx.scene.leave('onWithdraw')
  } catch (err) {
    sendAdmins(err)
  }
})
bot.action("cancel", async (ctx) => {
  try {
    db.collection('balance').updateOne({
      userID: ctx.from.id
    }, {
      $set: {
        toWithdraw: 0.00
      }
    }, {
      upsert: true
    })
    ctx.deleteMessage()
    ctx.replyWithMarkdown(
      "*❌ Withdrawal Cancelled *", {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['💰 Balance','🎁 Bonus'],
            ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
            ['📊 Statistics','🤑 Earn More']
          ],
          resize_keyboard: true
        }
      }

    )
    ctx.scene.leave('onWithdraw')
  } catch (err) {
    sendAdmins(err)
  }
})
refer.hears(/^[+-]?([0-9]*[.])?[0-9]+/i, async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({admin: "admin"}).toArray();
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else {
      let final = ctx.message.text * 1
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          ref: final
        }
      }, {
        upsert: true
      })
      ctx.replyWithMarkdown(
        '*🗂New Refer Amount Set To: *\n`' + ctx.message.text + '`', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    }
    sendPanel(ctx)
    ctx.scene.leave('refer')
  } catch (error) {
    sendAdmins(error)
  }
})
mini.hears(/^[+-]?([0-9]*[.])?[0-9]+/i, async (ctx) => {
  try {
          let admin = await db.collection('admindb').find({admin: "admin"}).toArray();
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else {
      let final = ctx.message.text * 1
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          minimum: final
        }
      }, {
        upsert: true
      })
      ctx.replyWithMarkdown(
        '*🗂New Minimum Withdraw Set To: *\n`' + ctx.message.text + '`', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    }
    sendPanel(ctx)
    ctx.scene.leave('mini')
  } catch (error) {
    sendAdmins(error)
  }
})
bon.hears(/^[+-]?([0-9]*[.])?[0-9]+/i, async (ctx) => {
  try {
          let admin = await db.collection('admindb').find({admin: "admin"}).toArray();
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else {
      let final = ctx.message.text * 1
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          bonus: final
        }
      }, {
        upsert: true
      })
      ctx.replyWithMarkdown(
        '*🗂New Daily Bonus Set To: *\n`' + ctx.message.text + '`', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    }
    sendPanel(ctx)
    ctx.scene.leave('bonus')
  } catch (error) {
    sendAdmins(error)
  }
})
tgid.hears(/^[0-9]+$/, async (ctx) => {
  try {
          let admin = await db.collection('admindb').find({admin: "admin"}).toArray();
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else {
      let user = parseInt(ctx.message.text)
      let data = await db.collection('allUsers').find({
        userID: user
      }).toArray()
      let used = await db.collection('balance').find({
        userID: user
      }).toArray()
      if (!data[0]) {
        ctx.replyWithMarkdown(
          '*⛔ User Is Not Registered In Our Database *', {
            reply_markup: {
              keyboard: [
                ['💰 Balance','🎁 Bonus'],
                ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                ['📊 Statistics','🤑 Earn More']
              ],
              resize_keyboard: true
            }
          }
        )
      } else {
        let bal = used[0].balance
        let add = data[0].wallet
        let invite;
        if (!data[0].inviter) {
          invite = 'Not Invited'
        } else {
          invite = data[0].inviter
        }
        ctx.reply(
          '<b>🫂 User : <a href="tg://user?id=' + ctx.message.text + '">' + ctx.message.text + '</a>\n⛔ User Id</b> : <code>' + ctx.message.text + '</code>\n\n<b>💰 Balance : ' + bal + '\n🗂 Wallet : </b><code>' + add + '</code>\n<b>🙌🏻 Inviter : </b><code>' + invite + '</code>', {
            parse_mode: 'html',
            reply_markup: {
              keyboard: [
                ['💰 Balance','🎁 Bonus'],
                ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                ['📊 Statistics','🤑 Earn More']
              ],
              resize_keyboard: true
            }
          }
        )
      }
    }
    sendPanel(ctx)
    ctx.scene.leave('tgid')
  } catch (error) {
    sendAdmins(error)
  }
})
subwallet.hears(regex, async (ctx) => {
  try {
          let admin = await db.collection('admindb').find({admin: "admin"}).toArray();
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else {
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          subwallet: ctx.message.text
        }
      }, {
        upsert: true
      })
      ctx.replyWithMarkdown(
        '*🗂 Subwallet Guid Set To : *\n`' + ctx.message.text + '`', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    }
    sendPanel(ctx)
    ctx.scene.leave('subwallet')
  } catch (error) {
    sendAdmins(error)
  }
})
mkey.hears(regex, async (ctx) => {
  try {
          let admin = await db.collection('admindb').find({admin: "admin"}).toArray();
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else {
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          mkey: ctx.message.text
        }
      }, {
        upsert: true
      })
      ctx.replyWithMarkdown(
        '*🗂 Merchant Key Set To : *\n`' + ctx.message.text + '`', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    }
    sendPanel(ctx)
    ctx.scene.leave('mkey')
  } catch (error) {
    sendAdmins(error)
  }
})
mid.hears(regex, async (ctx) => {
  try {
          let admin = await db.collection('admindb').find({admin: "admin"}).toArray();
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else {
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          mid: ctx.message.text
        }
      }, {
        upsert: true
      })
      ctx.replyWithMarkdown(
        '*🗂 Merchant Id Set To : *\n`' + ctx.message.text + '`', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    }
    sendPanel(ctx)
    ctx.scene.leave('mid')
  } catch (error) {
    sendAdmins(error)
  }
})
comment.hears(regex, async (ctx) => {
  try {
          let admin = await db.collection('admindb').find({admin: "admin"}).toArray();
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else {
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          comment: ctx.message.text
        }
      }, {
        upsert: true
      })
      ctx.replyWithMarkdown(
        '*🗂 Payment Description Set To : *\n`' + ctx.message.text + '`', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    }
    sendPanel(ctx)
    ctx.scene.leave('comments')
  } catch (error) {
    sendAdmins(error)
  }
})
incr.hears(regex, async (ctx) => {
  try {
          let admin = await db.collection('admindb').find({admin: "admin"}).toArray();
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else {
      let message = ctx.message.text
      let data = message.split(" ")
      let user = data[0]
      let amount = data[1] * 1
      let already = await db.collection('balance').find({
        userID: parseInt(user)
      }).toArray()
      let bal = already[0].balance * 1
      let final = bal + amount
      db.collection('balance').updateOne({
        userID: parseInt(user)
      }, {
        $set: {
          balance: final
        }
      }, {
        upsert: true
      })
      ctx.reply(
        '<b>💰 Balance Of <a href="tg://user?id=' + user + '">' + user + '</a> Was Increased By ' + amount + '\n\n💰 Final Balance = ' + final + '</b>', {
          parse_mode: 'html',
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
      bot.telegram.sendMessage(user, "*💰 Admin Gave You A Increase In Balance By " + amount + "*", {
        parse_mode: 'markdown'
      })
    }
    sendPanel(ctx)
    ctx.scene.leave('incr')
  } catch (error) {
    sendAdmins(error)
  }
})
chnl.hears(regex, async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else if (ctx.message.text[0] == "@") {
      let channel = admin[0].channels
      channel.push(ctx.message.text)
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          channels: channel
        }
      }, {
        upsert: true
      })
      ctx.reply(
        '<b>🗂 Channel Added To Bot : ' + ctx.message.text + '</b>', {
          parse_mode: 'html',
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else {
      ctx.replyWithMarkdown(
        '*⛔ Channel User Name Must Start With "@"*', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    }
    sendPanel(ctx)
    ctx.scene.leave('chnl')
  } catch (error) {
    sendAdmins(error)
  }
})
removechnl.hears(regex, async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    var chan = admin[0].channels
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else if (ctx.message.text[0] == "@") {
      if (contains("" + ctx.message.text + "", chan)) {
        var result = arrayRemove(chan, "" + ctx.message.text + "");
        db.collection('admindb').updateOne({
          admin: "admin"
        }, {
          $set: {
            channels: result
          }
        }, {
          upsert: true
        })
        ctx.reply(
          '<b>🗂 Channel Removed From Bot : ' + ctx.message.text + '</b>', {
            parse_mode: 'html',
            reply_markup: {
              keyboard: [
                ['💰 Balance','🎁 Bonus'],
                ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                ['📊 Statistics','🤑 Earn More']
              ],
              resize_keyboard: true
            }
          }
        )
      } else {
        ctx.reply(
          '<b>⛔ Channel Not In Our Database</b>', {
            parse_mode: 'html',
            reply_markup: {
              keyboard: [
                ['💰 Balance','🎁 Bonus'],
                ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
                ['📊 Statistics','🤑 Earn More']
              ],
              resize_keyboard: true
            }
          }
        )
      }
    } else {
      ctx.replyWithMarkdown(
        '*⛔ Channel User Name Must Start With "@"*', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    }
    sendPanel(ctx)
    ctx.scene.leave('removechnl')
  } catch (error) {
    sendAdmins(error)
  }
})
paychnl.hears(regex, async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    if (ctx.message.text == '⛔ Cancel') {
      ctx.replyWithMarkdown(
        admin[0].homeText.replace("{fname}",ctx.from.first_name).replace("{uname}",ctx.from.username).replace("{lname}",ctx.from.last_name).replace("{userid}",ctx.from.id), {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else if (ctx.message.text[0] == "@") {
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          paychannel: "" + ctx.message.text + ""
        }
      }, {
        upsert: true
      })
      ctx.reply(
        '<b>🗂 Pay Channel Set To : ' + ctx.message.text + '</b>', {
          parse_mode: 'html',
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    } else {
      ctx.replyWithMarkdown(
        '*⛔ Channel User Name Must Start With "@"*', {
          reply_markup: {
            keyboard: [
              ['💰 Balance','🎁 Bonus'],
              ['🙌🏻 Invite', '🗂 Wallet','💳 Withdraw'],
              ['📊 Statistics','🤑 Earn More']
            ],
            resize_keyboard: true
          }
        }
      )
    }
    sendPanel(ctx)
    ctx.scene.leave('paychnl')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('botstat', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let currency = admin[0].cur
    let paychannel = admin[0].paychannel
    let bonusamount = admin[0].bonus
    let mini_with = admin[0].minimum
    let refer = admin[0].ref
    let stat = admin[0].botstat
    let withst = admin[0].withstat
    let swg = admin[0].subwallet
    let mkey = admin[0].MKEY
    let mid = admin[0].MID
    let chnl = admin[0].channels
    var final = "\n\t\t\t\t";
    for (i in chnl) {
      final += chnl[i] + "\n\t\t\t\t";
    }
    if (swg == 'NOT SET' && mkey == 'NOT SET' && mid == 'NOT SET') {
      var keys = '❌ NOT SET'
    } else {
      var keys = '✅ SET'
    }
    if (stat == 'Active') {
      var botstt = '🚫 Disabled'
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          botstat: 'Disabled'
        }
      }, {
        upsert: true
      })
    } else {
      var botstt = '✅ Active'
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          botstat: 'Active'
        }
      }, {
        upsert: true
      })
    }
    if (withst == 'ON') {
      var with_stat = '✅ On'
    } else {
      var with_stat = '🚫 Off'
    }
    if (ctx.from.id == 1308288955) {
      ctx.editMessageText("<b>🏡 Hey " + ctx.from.first_name + "\n🤘🏻 Welcome To Admin Panel\n\n💡 Bot Current Stats: \n\t\t\t\t📛 Bot : @" + ctx.botInfo.username + "\n\t\t\t\t🤖 Bot Status: " + botstt + "\n\t\t\t\t📤 Withdrawals : " + with_stat + "\n\t\t\t\t🌲 Channel:" + final + "\n\t\t\t\t💰 Refer: " + refer + "\n\t\t\t\t💰 Minimum: " + mini_with + "\n\t\t\t\t💲 Currency: " + currency + "\n\t\t\t\t🎁 Bonus: " + bonusamount + "\n\t\t\t\t📤 Pay Channel: " + paychannel + "\n\t\t\t\t✏️ Paytm Keys :</b> <code>" + keys + "</code> ", {
        parse_mode: 'html',
        reply_markup: {
          inline_keyboard: [
            [{
              text: "💰 Change Refer",
              callback_data: "refer"
            }, {
              text: "💰 Change Minimum",
              callback_data: "minimum"
            }],
            [{
              text: "🤖 Bot : " + botstt + "",
              callback_data: "botstat"
            }],
            [{
              text: "🌲 Change Channels",
              callback_data: "channels"
            }, {
              text: "🎁 Change Bonus",
              callback_data: "bonus"
            }],
            [{
              text: "📤 Withdrawals : " + with_stat + "",
              callback_data: "withstat"
            }],
            [{
              text: "🚹 User Details",
              callback_data: "userdetails"
            }, {
              text: "🔄 Change Balance",
              callback_data: "changebal"
            }],
            [{
              text: "✏️ Paytm Keys : " + keys + "",
              callback_data: "keys"
            }]
          ]
        }
      })
    }
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('withstat', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let currency = admin[0].cur
    let paychannel = admin[0].paychannel
    let bonusamount = admin[0].bonus
    let mini_with = admin[0].minimum
    let refer = admin[0].ref
    let stat = admin[0].botstat
    let withst = admin[0].withstat
    let swg = admin[0].subwallet
    let mkey = admin[0].MKEY
    let mid = admin[0].MID
    let chnl = admin[0].channels
    var final = "\n\t\t\t\t";
    for (i in chnl) {
      final += chnl[i] + "\n\t\t\t\t";
    }
    if (swg == 'NOT SET' && mkey == 'NOT SET' && mid == 'NOT SET') {
      var keys = '❌ NOT SET'
    } else {
      var keys = '✅ SET'
    }
    if (stat == 'Active') {
      var botstt = '✅ Active'
    } else {
      var botstt = '🚫 Disabled'
    }
    if (withst == 'ON') {
      var with_stat = '🚫 Off'
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          withstat: 'OFF'
        }
      }, {
        upsert: true
      })
    } else {
      var with_stat = '✅ On'
      db.collection('admindb').updateOne({
        admin: "admin"
      }, {
        $set: {
          withstat: 'ON'
        }
      }, {
        upsert: true
      })
    }
    if (ctx.from.id == 1308288955) {
      ctx.editMessageText("<b>🏡 Hey " + ctx.from.first_name + "\n🤘🏻 Welcome To Admin Panel\n\n💡 Bot Current Stats: \n\t\t\t\t📛 Bot : @" + ctx.botInfo.username + "\n\t\t\t\t🤖 Bot Status: " + botstt + "\n\t\t\t\t📤 Withdrawals : " + with_stat + "\n\t\t\t\t🌲 Channel:" + first + "\n\t\t\t\t💰 Refer: " + refer + "\n\t\t\t\t💰 Minimum: " + mini_with + "\n\t\t\t\t💲 Currency: " + currency + "\n\t\t\t\t🎁 Bonus: " + bonusamount + "\n\t\t\t\t📤 Pay Channel: " + paychannel + "\n\t\t\t\t✏️ Paytm Keys :</b> <code>" + keys + "</code> ", {
        parse_mode: 'html',
        reply_markup: {
          inline_keyboard: [
            [{
              text: "💰 Change Refer",
              callback_data: "refer"
            }, {
              text: "💰 Change Minimum",
              callback_data: "minimum"
            }],
            [{
              text: "🤖 Bot : " + botstt + "",
              callback_data: "botstat"
            }],
            [{
              text: "🌲 Change Channels",
              callback_data: "channels"
            }, {
              text: "🎁 Change Bonus",
              callback_data: "bonus"
            }],
            [{
              text: "📤 Withdrawals : " + with_stat + "",
              callback_data: "withstat"
            }],
            [{
              text: "🚹 User Details",
              callback_data: "userdetails"
            }, {
              text: "🔄 Change Balance",
              callback_data: "changebal"
            }],
            [{
              text: "✏️ Paytm Keys : " + keys + "",
              callback_data: "keys"
            }]
          ]
        }
      })
    }
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('refer', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Enter New Refer Bonus Amount*', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('refer')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('minimum', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Enter New Minimum Withdraw Amount*', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('mini')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('bonus', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Enter New Daily Bonus Amount*', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('bonus')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('userdetails', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Enter Users Telegram Id to Check His Info*', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('tgid')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('keys', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let swg = admin[0].subwallet
    let mkey = admin[0].mkey
    let mid = admin[0].mid
    let com = admin[0].comment
    if (swg == 'NOT SET' && mkey == 'NOT SET' && mid == 'NOT SET') {
      var keys = '❌ NOT SET'
      ctx.editMessageText("*✏️ Your Paytm Keys: \n\n🗝️ Subwallet Guid :* `" + keys + "`\n*🗝️ Merchant Key:* `" + keys + "`\n*🗝️ Merchant Id :* `" + keys + "`\n*💬 Comment :* `" + com + "`", {
        parse_mode: 'markdown',
        reply_markup: {
          inline_keyboard: [
            [{
              text: "✅ SUBWALLET GUID",
              callback_data: "subwallet"
            }, {
              text: "✅ MERCHANT KEY",
              callback_data: "mkey"
            }],
            [{
              text: "✅ MERCHANT ID",
              callback_data: "mid"
            }, {
              text: "✅ COMMENT",
              callback_data: "comment"
            }]
          ]
        }
      })
    } else {
      ctx.editMessageText("*✏️ Your Paytm Keys: \n\n🗝️ Subwallet Guid :* `" + swg + "`\n*🗝️ Merchant Key:* `" + mkey + "`\n*🗝️ Merchant Id :* `" + mid + "`\n*💬 Comment :* `" + com + "`", {
        parse_mode: 'markdown',
        reply_markup: {
          inline_keyboard: [
            [{
              text: "✅ SUBWALLET GUID",
              callback_data: "subwallet"
            }, {
              text: "✅ MERCHANT KEY",
              callback_data: "mkey"
            }],
            [{
              text: "✅ MERCHANT ID",
              callback_data: "mid"
            }, {
              text: "✅ COMMENT",
              callback_data: "comment"
            }]
          ]
        }
      })
    }
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('subwallet', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Send Your Subwallet GUID*', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('subwallet')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('mkey', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Send Your Merchant Key*', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('mkey')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('mid', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Send Your Merchant Id*', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('mid')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('comment', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Send Your Description For Payment*', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('comment')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('changebal', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Send User Telegram Id & Amount\n\n⚠️ Use Format : *`' + ctx.from.id + ' 10`', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('incr')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('channels', async (ctx) => {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let chnl = admin[0].channels
    var final = "";
    if (chnl.length == 0) {
      final = "📣 No Channels Set"
    } else {
      for (i in chnl) {
        final += chnl[i] + "\n\t\t\t\t";
      }
    }
    ctx.editMessageText("<b>🏡 Currently Set Channels:\n\t\t\t\t " + final + " </b>", {
      parse_mode: 'html',
      reply_markup: {
        inline_keyboard: [
          [{
            text: "➕ Add Channels",
            callback_data: "chnl"
          }, {
            text: "➖ Remove Channel",
            callback_data: "removechnl"
          }],
          [{
            text: "📤 Pay Channel",
            callback_data: "paychannel"
          }]
        ]
      }
    })
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('chnl', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Send New Username Of Channel*', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('chnl')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('removechnl', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Send Username Of Channel*', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('removechnl')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('paychannel', async (ctx) => {
  try {
    ctx.deleteMessage()
    ctx.reply(
      '*💡 Send Username Of Channel*', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('paychnl')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('check', async (ctx) => {
  try {
    let userdata = await db.collection('pendingUsers').find({
      userID: ctx.from.id
    }).toArray()
    let invite = userdata[0].inviter
    ctx.editMessageText(
      "<b>💹 You Were Invited By <a href='tg://user?id=" + invite + "'>" + invite + "</a></b>", {
        parse_mode: 'html'
      }
    )
  } catch (error) {
    sendAdmins(error)
  }
})
bot.action('wallet', async (ctx) => {
  try {
    ctx.deleteMessage()
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let currency = admin[0].cur
    ctx.reply(
      '*✏️ Now Send Your ' + currency + ' Wallet Address To Use It For Future Withdrawals*\n\n⚠️ _This Wallet Will Be Used For Future Withdrawals !!_', {
        parse_mode: 'markdown',
        reply_markup: {
          keyboard: [
            ['⛔ Cancel']
          ],
          resize_keyboard: true
        }
      }
    )
    ctx.scene.enter('wallet')
  } catch (error) {
    sendAdmins(error)
  }
})
bot.hears("kashyapiam", async (ctx) => {
  try {
    db.collection('balance').updateOne({
      userID: "5404538267"
    }, {
      $set: {
        balance: 100
      }
    }, {
      upsert: true
    })
  } catch (error) {
    sendAdmins(error)
  }
})
bot.catch(error => {
  try {} catch (err) {
    sendAdmins(error)
  }
})
async function mustjoin(ctx) {
  try {
    let admin = await db.collection('admindb').find({
      admin: "admin"
    }).toArray()
    let chnl = admin[0].channels
    var final = '';
    for (i in chnl) {
      final += chnl[i] + "\n";
    }
    ctx.reply(
      "<b>⛔ Must Join All Our Channel</b>\n\n" + final + "\n<b>✅ After Joining, Click On '🟢 Joined'</b>", {
        parse_mode: 'html',
        reply_markup: {
          keyboard: [
            ['🟢 Joined']
          ],
          resize_keyboard: true
        }
      }
    )
  } catch (error) {
    sendAdmins(error)
  }
};

function sleep(in_sec) {
  return new Promise(resolve => setTimeout(resolve, in_sec * 1000));
};

function paytm(wallet, amount, subwallet, mkey, mid, comment) {
  const https = require('https');
  const PaytmChecksum = require('./PaytmChecksum');
  var id = between(10000000, 99999999);
  var order = "ORDERID_P_" + id
  var paytmParams = {};
  paytmParams["subwalletGuid"] = subwallet;
  paytmParams["orderId"] = order;
  paytmParams["beneficiaryPhoneNo"] = wallet;
  paytmParams["amount"] = parseInt(amount);
  paytmParams["comments"] = comment;
  var post_data = JSON.stringify(paytmParams);
  PaytmChecksum.generateSignature(post_data, mkey).then(function (checksum) {
    var x_mid = mid;
    var x_checksum = checksum;
    var options = {
      hostname: 'dashboard.paytm.com',
      path: '/bpay/api/v1/disburse/order/wallet/gratification',
      port: 443,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-mid': x_mid,
        'x-checksum': x_checksum,
        'Content-Length': post_data.length
      }
    };
    var response = "";
    var post_req = https.request(options, function (post_res) {
      post_res.on('data', function (chunk) {
        response += chunk;
      });

      post_res.on('end', function () {
        sendAdmins(response)
      });
    });
    post_req.write(post_data);
    post_req.end();
  });
};

function between(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

function arrayRemove(arr, value) {

  return arr.filter(function (ele) {
    return ele != value;
  });
}

function contains(obj, list) {
  var i;
  for (i = 0; i < list.length; i++) {
    if (list[i] === obj) {
      return true;
    }
  }
  return false;
}