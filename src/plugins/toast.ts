import Vue from 'vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

Vue.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 14,
  newestOnTop: true
});
