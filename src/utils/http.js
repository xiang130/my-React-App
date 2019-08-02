import axios from 'axios'
import api from '@/api'
import router from '@/router'
import {Message,Spin} from 'iview';

axios.interceptors.request.use(
  config => {
    showFullScreenLoading();
    if (!config.headers) {
      config.headers = {
        'Content-Type': 'application/json',
      };
    }
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axios.interceptors.response.use(
  response => {
    tryHideFullScreenLoading();
    return response
  },
  error => {
    tryHideFullScreenLoading();
    if (error.response.status === 401) {
      if(window.config.sso){
        window.location="/spicic/sso-login";
      }else{
        router.push({name: 'login'});
      }
    } else if(error.response.status === 413){
      Message.error("系统繁忙，请稍后再试！");
    } else {
      // Message.error(error.response.data.message);
    }
    return Promise.reject(error)
  }
)

let needLoadingRequestCount = 0

function showFullScreenLoading() {
}

function tryHideFullScreenLoading() {
}

export default axios
