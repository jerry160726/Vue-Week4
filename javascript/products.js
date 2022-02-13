import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';

const site = 'https://vue3-course-api.hexschool.io/v2';
//Base URL: 用這個改各方法需要的URL
const api_path = 'ttest';  //自己的api_path

let productModal = {};
let delProductModal = {};  //刪除要用的

const app = createApp({
    components: {
        pagination
    },
    data() {
        return {
            products: [],
            tempProduct: {
                imagesUrl: [],
            },
            isNew: false,  //新增編輯需要用到的狀態判斷
            pagination: {} //分頁的資料
        }
    },
    methods: {
        checkLogin() {
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;
            console.log(token);

            const url = `${site}/api/user/check`;
            axios.post(url)
                .then(() => {
                    this.getProducts();
                });

        },
        getProducts(page = 1) {  //帶入page這個參數
            const url = `${site}/api/${api_path}/admin/products/?page=${page}`; //參數預設值

            axios.get(url)
                .then(res => {
                    // console.log(res);
                    // console.log(res.data.products);
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;  //撈出分頁資料
                });
        },
        openModal(status, product) {
            // console.log(status, product);
            if (status === 'isNew') {
                this.tempProduct = {
                    imagesUrl: [],
                }
                productModal.show();
                this.isNew = true;
            } else if (status === 'edit') {
                this.tempProduct = { ...product };  //淺拷貝, 因為傳參考
                productModal.show();
                this.isNew = false;
            } else if (status === 'delete') {
                delProductModal.show();
                this.tempProduct = { ...product };  //淺拷貝, 因為傳參考
            }
        }
    },
    mounted() {
        this.checkLogin();
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

    }
});

app.component('productModal', {
    props: ['tempProduct'],
    template: '#templateForProductModal',
    methods: {
        updateProduct() {
            let url = `${site}/api/${api_path}/admin/product`;
            let method = 'post';
            console.log(url,method);
            if (!this.isNew) {
                url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }  //如果是編輯的話 就代id並改成put

            axios[method](url, { data: this.tempProduct })  //資料的格式要參照api的格式 
                .then((res) => {
                    console.log(res);
                    //this.getProducts();  //沒有get Product (外層方法)
                    this.$emit('get-products');
                    productModal.hide();
                })
        },
    },
})

app.component('delProductModal', {
    props: ['tempProduct'],
    template: '#templateForDelProductModal',
    methods: {
        delProduct() {
            let url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;

            axios.delete(url)  //資料的格式要參照api的格式 
                .then((res) => {
                    console.log(res);
                    // this.getProducts();
                    this.$emit('get-products');
                    delProductModal.hide();
                })
        }
    }
})

app.mount('#app');