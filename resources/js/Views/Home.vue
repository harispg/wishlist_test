<template>
        <div class="container">
        <CRow>
            <CJumbotron>
                <h1 class="display-3">Test assginment - Shopify Wishlist</h1>
                <p class="lead">Test assginment - Shopify Wishlist Components for Vue.js 2.6+</p>
            </CJumbotron>
        </CRow>

        <CRow>
            <CCol sm="6">
                <CRow>
                    <CCol sm="6">
                        <CInput
                        v-model="search"
                        label="Product Title"
                        placeholder="What are you looking for"
                        />
                    </CCol>
                    <CCol sm="2">
                        <CInput
                        v-model="minPrice"
                        label="Min. Price"
                        placeholder="123"
                        />
                    </CCol>
                    <CCol sm="2">
                        <CInput
                        v-model="maxPrice"
                        label="Max. Price"
                        placeholder="123"
                        />
                    </CCol>
                    <CCol sm=2 class="pt-4">
                        <CButton
                            color="primary"
                            variant="outline"
                            
                            @click="submit()"
                        >Search</CButton>
                    </CCol>
                </CRow>
            </CCol>
        </CRow>
        <hr>
        <CRow>
            <CCol sm="6">
                <CRow>
                    <CCol sm=7>
                        <Product v-for="product in products" :key="product.node.id" :product="product"></Product>
                    </CCol>
                </CRow>
            </CCol>
            <CCol sm="6">
                <CRow>
                    <CCol sm="7" class="mb-0">
                        <h4>Your wishlist:</h4>
                        <Product v-for="product in wishlist" :key="product.node.id" :product="product"></Product>
                    </CCol>
                    <CCol sm="5">
                        <CButton
                            color="primary"
                            variant="outline"
                            class="m-2"
                            @click="sendEmail()"
                        >Send Wishlist to a friend</CButton>
                        <CButton
                            color="secondary"
                            variant="outline"
                            class="m-2 sm"
                            @click="clearWishlist()"
                        >Remove all</CButton>
                    </CCol>
                </CRow>
            </CCol>
        </CRow>
        </div>
</template>
<script>
import Product from '../Components/Product.vue'
import { mapState } from 'vuex'
export default {
    name: 'Home',
    components: {
        Product
    },
    data() {
        return {
            maxPrice: 0,
            minPrice: 0,
            search: '',
        }
    },
    mounted(){
        this.maxPrice = 0
        this.minPrice = 0
        this.search = ''
        this.submit()
    },
    computed: {
    ...mapState(['products', 'wishlist'])
    },
    methods: {
        submit() {
            let filters = this.getFilters();
            console.log("filters:", filters);
            this.$store.dispatch("getProducts", filters)
        },
        clearWishlist(){
            if( window.confirm("Are you sure you want to REMOVE ALL ITEMS from your wishlist?") ){
                this.$store.commit("clearWishlist")
            }
        },
        sendEmail(){
            this.$router.push("/email")
            // axios.post("/wishlists", {wishlist: this.$store.state.wishlist, email: "email@example.com"})
            //     .then(response => console.log(response))
            //     .catch(error => console.log(error.response))
        },
        getFilters(){
            let minPriceFilter = this.minPrice ? `variants.price:>=${this.minPrice}` : ''
            let maxPriceFilter = this.maxPrice ? `variants.price:<=${this.maxPrice}` : ''
            let titleFilter = this.search ? `title:*${this.search}*` : ''
            return `${minPriceFilter} ${maxPriceFilter} ${titleFilter}`
        }
    }
}
</script>
