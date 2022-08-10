import request from '@/utils/request'
//获取图片接口
export const reqSpuImageList=(spuId)=>request({
  url:`/admin/product/spuImageList/${spuId}`,
  method:'get'
})

//获取销售属性的数据
export const reqSpuSaleAttrList = (spuId)=>request({
  url:`/admin/product/spuSaleAttrList/${spuId}`,
  method:'get'
})

//获取平台属性的数据
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({
  url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method:'get'
})

//获取sku列表的接口
export const reqSkuList = (page,limit)=>request({
  url:`/admin/product/list/${page}/${limit}`,
  method:'get'
})

//上架sku
export const reqOnSale = (skuId)=>request({
  url:`/admin/product/onSale/${skuId}`,
  method:'get'
})

//下架sku
export const reqCancelSale = (skuId)=>request({
  url:`/admin/product/cancelSale/${skuId}`,
  method:'get'
})

//获取sku详情
export const reqSkuById = (skuId)=>request({
  url:`/admin/product/getSkuById/${skuId}`,
  method:'get'
})
