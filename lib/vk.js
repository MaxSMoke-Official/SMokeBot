// обьявление зависимостей
const rq = require("request");
const gtoken = ""; // токен группы
const utoken = ""; // токен человека
let vk_api_url = `https://api.vk.com/method/`; // адрес метода
let group_id = 0; // айди группы

// функция реализации запросов апи
async function api (who, method, params) {
  return new Promise((res, err) => {
    if (method == "messages.send") params.random_id = 0;
    if (who == "user") params.access_token = utoken;
    if (who == "group") params.access_token = gtoken;
    params.v = 5.126;
    let url = vk_api_url + method;
    rq({
      "url": url, "method": "post", "form": params
    }, (e, r, b) => {
      return err(e), res(b);
    });
  });
}

// функция работы с longpoll
async function getLongPollServer(callback) {
  let method = "groups.getLongPollServer";
  let longpoll = await api("group",
    method,
    {
      "group_id": group_id,
      "v": 5.126
    });
  let bool = true; // костыль для обновления longpoll
  setInterval(async () => {
    let event;
    if (!bool) return;
    bool = false;
    event = await rq('get', {
      "url": `${longpoll.server}?act=a_check&key=${longpoll.key}&ts=${longpoll.ts}&wait=20`
    });
    if (event.updates) lp.ts = event.ts,
    bool = true;
    event.updates.filter(x=>x.type == "message_new").forEach(x=> {
      return callback(x);
    });
  },
    60);
}

//хендлер
async function handler(req, cb) {
  getLongPollServer(res => {
    console.log(res);
  });
}

exports.api = api;
exports.getLongPollServer = getLongPollServer;
exports.handler = handler;
