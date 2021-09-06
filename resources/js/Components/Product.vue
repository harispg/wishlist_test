<template>
<CRow>
    <CCol sm=6>
        <CImg
            :src="instance.image"
            thumbnail
            class="mb-2"
            block
        />
    </CCol>
    <CCol sm=6>
        <strong>{{instance.title}}</strong>
        <br>
        ${{instance.minPrice}} - ${{instance.maxPrice}}
        <br>
        <div v-if="wishlist">
            <p>Added {{getTime}}</p>
            <CLink @click="removeFromWishlist(instance)">Remove</CLink>
        </div>
        <div v-else>
            <CLink v-if="!instance.addedToWishlist" @click="saveToWishlist(instance)">Save To Wishlist</CLink>
            <label v-else class="text-primary">Saved!</label>
        </div>
        
    </CCol>
</CRow>
    
</template>
<script>
export default {
    props: {
        product: {
            type: Object,
            default: {}
        },
        wishlist: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            instance: {
                title: "",
                image: "",
                minPrice: 0,
                maxPrice: 0,
                id: '',
                addedToWishlist: false,
            }
        }
    },

    watch: {
        product: {
            handler(newValue) {
                this.instance = newValue
            },
            deep: true
        }
    },

    computed: {
        getTime(){
            return moment(this.instance.addedToWishlist).fromNow();
        }
    },

    mounted() {
        this.instance = this.product
    },

    methods: {
        saveToWishlist(product){
            this.$store.commit("addProductToWishlist", product)
        },
        removeFromWishlist(product){
            this.$store.commit("removeProductFromWishlist", product)
        }
    }
}
</script>
