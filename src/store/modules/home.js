import mockrequest from '@/utils/mockrequest'
const state = {
  list:{}
}

const mutations = {
  GETDATA(state,list){
    state.list = list
  }
}

const actions = {
  //发请求获取首页的mock数据
  getData({commit}){
    mockrequest.get('/home/list').then(res=>{
      commit("GETDATA",res.data)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

