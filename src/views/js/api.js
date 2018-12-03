let path =  process.env.NODE_ENV === 'production' ? '/' : '/api'  // api
const api = {
  log: `${path}/v1`,
  getSign: `https://singer.tdf.ministudy.com/rest/weixin/sign?url=`,
}
export default api
