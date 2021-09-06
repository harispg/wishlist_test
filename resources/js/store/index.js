import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        wishlist: [],
        products: [],
        email: ''
    },
    getters: {

    },
    mutations: {
        initialiseStore: function(state){
            if(localStorage.getItem("users_wishlist")){
                state.wishlist = JSON.parse(localStorage.getItem("users_wishlist"));
            }
        },
        email: function (state, email){
            state.email = email;
        },
        setProducts: function (state, products){
            state.products = [];
            products.forEach(product => {
                let localProduct = {
                    id: product.node.id,
                    title: product.node.title,
                    minPrice: product.node.priceRange.minVariantPrice.amount,
                    maxPrice: product.node.priceRange.maxVariantPrice.amount,
                    image: product.node.images.edges[0] ? product.node.images.edges[0].node.originalSrc : "",
                    addedToWishlist: ''
                }
                state.wishlist.forEach(item => {
                    if(item.id == localProduct.id){
                        localProduct.addedToWishlist = new Date()
                    }
                })
                console.log("Inside setting products addedToWishlist", localProduct.addedToWishlist)
                state.products.push(localProduct)
            });
        },
        
        addProductToWishlist: function (state, product){
            let already_exists = false;
            state.wishlist.forEach(element => {
                if(element.id == product.id){
                    already_exists = true;
                }
            });
            console.log(already_exists);
            if(!already_exists){
                product.addedToWishlist = new Date();
                state.wishlist.push(Object.assign({},product))
            }
            state.products.forEach(item => {
                if(item.id == product.id){
                    item.addProductToWishlist = new Date();
                }
            })
        },

        removeProductFromWishlist: function (state, product){
            state.wishlist = state.wishlist.filter(item => {return item.id != product.id});

            state.products.forEach(item => {
                if(item.id == product.id){
                    item.addedToWishlist = ''
                }
            } )
        },

        clearWishlist: function (state){
            state.wishlist = [];
            state.products.forEach(product => {product.addedToWishlist = ''})
        }
    },
    actions: {
       getProducts: function (context, filters) {
        
        const url = 'https://dev-pengiun.myshopify.com/api/2021-07/graphql.json'
        const query = getQuery(filters);
        const options = {
            headers: {
                "Content-Type": "application/graphql",
                "X-Shopify-Storefront-Access-Token": '1635d6ab631c8d467d7dba18d106bca1'
                }
        }

        axios.post( url, query, options )
        .then( response => {
            const products = response.data.data.shop.products.edges
            context.commit("setProducts", products);
        })
        .catch(err => console.log(err.response))
       },
       
       submitWishlist: function (context) {
        axios.post("/api/wishlists", {wishlist: context.state.wishlist, email: context.state.email})
        .then(() => { router.push("/success") })
        .catch(error => {
            console.log(error.response);
            if(error.response.data.errors.email!= undefined){
                window.alert(error.response.data.errors.email[0])
            }
            if(error.response.data.errors.wishlist!= undefined){
                window.alert(error.response.data.errors.wishlist[0])
            }
            console.log(error.response.data.errors);
        })
       }
    }
  })

  function getQuery(filters){
    return `{
        shop {
            products(first:20, query:"${filters}" ){
                edges{
                    node{
                        id
                        images(first: 1) {
                            edges {
                                node {
                                    id
                                    originalSrc
                                }
                            }
                        }
                        title
                        priceRange{
                            maxVariantPrice{
                                currencyCode
                                amount
                            }
                            minVariantPrice{
                                currencyCode
                                amount
                            }
                        }
                    }
                }
            }
        }
    }`
}
  