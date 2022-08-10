import request from '@/utils/request'

//获取spu列表数据
// /admin/product/{page}/{limit} get
export const reqGetSpuList = (page,limit,category3Id)=>request({
  url:`/admin/product/${page}/${limit}`,
  params:{category3Id},
  method:'get'
})

//获取spu信息
// /admin/product/getSpuById/{spuId} get
export const reqSpu = (spuId)=>request({
  url:`/admin/product/getSpuById/${spuId}`,
  method:'get'
})

//获取品牌信息
export const reqTradMarkList = ()=>request({
  url:"/admin/product/baseTrademark/getTrademarkList",
  method:'get'
})

//获取Spu图标的接口
export const reqSpuImageList = (spuId)=>request({
  url:`/admin/product/spuImageList/${spuId}`,
  method:'get'
})

//获取平台的全部的销售属性
export const reqBaseSaleAttrList = ()=>request({
  url:'/admin/product/baseSaleAttrList',
  method:'get'
})

//修改spu|添加spu，对于修改或者添加，携带给服务器参数大致是一样的，唯一的区别就是携带的参数是否有id
export const reqAddOrUpdateSpu=(spuInfo)=>{
  if (spuInfo.id){
    return request({
      url:'/admin/product/updateSpuInfo',
      method:'post',
      data:spuInfo
    })
  }else {
    return request({
      url:'/admin/product/saveSpuInfo',
      method:'post',
      data:spuInfo
    })
  }
}

//删除spu
export const reqDeleteSpu = (spuId)=>request({
  url:`/admin/product/deleteSpu/${spuId}`,
  method:'delete'
})

//添加sku
export const reqAddSku = (skuInfo)=>request({
  url:'/admin/product/saveSkuInfo',
  method:'post',
  data:skuInfo
})

//获取sku列表数据的接口
export const reqSkuList = (spuId)=>request({
  url:`/admin/product/findBySpuId/${spuId}`,
  method:'get'
})
