import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const site = 'https://vue3-course-api.hexschool.io/v2';
//Base URL: 用這個改各方法需要的URL

const app = createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    login() {
      const url = `${site}/admin/signin`;
      axios.post(url, this.user)
        .then((res) => {
          const { token, expired } = res.data;
          // console.log(token, expired);
          document.cookie = `hexToken=${token}; expires=${new Date(expired)};`
          window.location = './products.html';
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }
});

app.mount('#app');