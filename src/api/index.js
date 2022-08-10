//将四个函数的接口函数统一暴露
import * as tradeMark from './product/tradeMark'
import * as attr from './product/attr'
import * as spu from './product/spu'
import * as sku from './product/sku'
export default {
  tradeMark,
  attr,
  sku,
  spu
}
