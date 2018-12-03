//session
export const getSession = (key) => {
  var data = sessionStorage[key];
  if (!data || data === "null") {
    return null;
  }
  return JSON.parse(data).value;
}

export const setSession = (key, value) => {
  var data = {
    value: value
  }
  sessionStorage[key] = JSON.stringify(data);
}

export const _datefix = (n) => {
  return n < 10 ? ('0' + n) : n
};

export const rid = (data) => {
  const now = new Date()
  const year = now.getFullYear()
  const month = _datefix(now.getMonth() + 1)
  const date = _datefix(now.getDate())
  const hour = _datefix(now.getHours())
  const minute = _datefix(now.getMinutes())
  const second = _datefix(now.getSeconds())
  let random4 = Math.floor((Math.random() * 1000)).toString()
  const length = 4 - random4.length;
  for (let i = 0; i < length; i++) {
    random4 = '0' + random4
  }
  if (data == 'format') {
    return `${year}-${month}-${date} ${hour}:${minute}:${second}`
  }
  return `${year}${month}${date}${hour}${minute}${second}${random4}`
};
export const getDevice = () => {
  var obj = new Object();
  var app = navigator.appVersion;
  var left = app.indexOf('(');
  var right = app.indexOf(')');
  var str = app.substring(left + 1, right);
  var Str = str.split(";");
  var phoneVersion = Str[0];
  // 手机型号--苹果 iPhone
  var Mobile_Iphone = Str[0];
  // 手机型号--安卓
  var Mobile_Android = Str[2];
  // 红米手机等特殊型号处理 匹配字符
  var res = /Android/;
  var reslut = res.test(Mobile_Android);
  if (phoneVersion == 'iPhone') {
    obj.model = Mobile_Iphone;
    obj.system = Str[1].substring(4, 19);
  } else if (phoneVersion == 'Linux') {
    if (reslut) {
      obj.model = Str[4].substring(0, 9);
      obj.system = Str[2];
    } else {
      obj.model = Mobile_Android.substring(0, 9);
      obj.system = Str[1];
    }
  } else if (phoneVersion == 'iPad') {
    obj.model = Str[0];
    obj.system = Str[1].substring(4, 12);
  }
  return obj
}
export const UrlSearch = (url) => {
  url = url || window.location.href;
  var name, value;
  var obj = new Object();
  var num = url.indexOf("?"),
      str = url.substr(num + 1);
  var arr = str.split("&");
  for (var i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if (num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      obj[name] = value;
    }
  }
  return obj
};
