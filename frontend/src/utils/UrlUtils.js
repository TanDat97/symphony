const host = "http://192.168.1.15:5000/"

export default {
  host: host,
  api: {
    userSignin: host + 'api/user/signin',
    userInfo: host + 'api/user',
  },
  admin: {
    getListPostFilter: host + 'api/admin/post/get_list/filter'
  }
}