const rq = require("request")
const gtoken = "Токен паблика";
const utoken = "Токен человека";
let vk_api_url = `https://api.vk.com/method/`
let group_id = 168597885

async function api (who, method, params) {
  return new Promise((res, err) => {
    if (method == "messages.send") params.random_id = Math.floor(Math.random() * (2147483648 - -2147483647) + -2147483647)
    if (who == "user") params.access_token = utoken
    if (who == "group") params.access_token = gtoken
    params.v = 5.126
    let url = vk_api_url + method
    rq({
      "url": url, "method": "post", "form": params
    }, (e, r, b) => {
      return err(e), res(b)
    })
  })
}

async function getLongPollServer(callback) {
  let method = "groups.getLongPollServer"
  let longpoll = await api("group",
    method,
    {
      "group_id": group_id,
      "v": 5.126
    })
  let bool = true
  setInterval(async () => {
    let event
    if (!bool) return;
    bool = false
    event = await rq('get', {
      "url": `${longpoll.server}?act=a_check&key=${longpoll.key}&ts=${longpoll.ts}&wait=20`
    })
    if (event.updates) lp.ts = event.ts,
    bool = true
    event.updates.filter(x=>x.type == "message_new").forEach(x=> {
      return callback(x)
    })
  },
    60)
}

exports.api = api
exports.getLongPollServer = getLongPollServer