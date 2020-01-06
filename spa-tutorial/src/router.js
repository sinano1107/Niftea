import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home'
import ProductList from '@/views/ProductList' // 商品一覧
import Product from '@/views/Product' // 商品情報(親ルート)
// Productの子ルートたち
import ProductHome from '@/views/Product/Home'
import ProductReview from '@/views/Product/Review'
import ProductReviewDetails from '@/views/Product/ReviewDetail'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', component: Home },
    { path: '/product', component: ProductList },
    {
      path: '/product/:id', component: Product,
      props: route => ({ id: Number(route.params.id) }),
      children: [
        { name: 'product-home', path: '', component: ProductHome },
        { name: 'product-review', path: 'review', component: ProductReview },
        { name: 'review-detail', path: 'review/:rid',
          props: route => ({
            rid: Number(route.params.rid)
          })
        }
      ]
    }

  ]
})

export default router
