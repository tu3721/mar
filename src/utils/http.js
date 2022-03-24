import axios from "axios";


import qs from "qs";
// import { ElMessage,ElLoading } from 'element-plus';
axios.defaults.baseURL = process.env.NODE_ENV == 'production' ? '/' : '/api';

// axios.defaults.baseURL = 'http://192.168.11.35:82/' //测试

let token = window.sessionStorage.getItem('Token');//获取token


// axios.interceptors.request.use(
//     config => {
//         return config;
//     },
//     error => {
//         return Promise.reject(error);
//     }
// );

// axios.interceptors.response.use(
//     response => {
//         if (response.status == 200) {
//             return Promise.resolve(response);
//         } else {
//             return Promise.reject(response);
//         }
//     },
//     error => {
//         return Promise.reject(error);
//     }
// );
export default {
    post(url, data,config) {
        let setting = {};
        // let loadingInstance = '';
        // if (DOM){
        //     loadingInstance = ElLoading.service({
        //         target: document.querySelector('.'+DOM)
        //     });
        // }else{
        //     loadingInstance = ElLoading.service({ fullscreen: true })
        // }
        if (config){
            setting = {
                'token':token,
                'Content-Type':config
            }
        }else{
            //设置请求头信息
            setting = {
                'token':token,
                'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url,
                data: config ? data : qs.stringify(data),
                headers: setting,
            })
                .then(res => {
                    // loadingInstance.close();
                    if (this.close(res)){
                        resolve(res.data);
                    }

                })
                .catch(err => {
                    // loadingInstance.close();
                    // ElMessage.error(JSON.stringify(err.message));
                    reject(err);
                });
        })
    },

    get(url, data) {
        //loading信息
        // let loadingInstance = '';
        // if (DOM){
        //     loadingInstance = ElLoading.service({
        //         target: document.querySelector('.'+DOM)
        //     });
        // }else{
        //     loadingInstance = ElLoading.service({ fullscreen: true })
        // }
        let setting = {
            'token':token,
            'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
        }
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url,
                params: data,
                headers: setting,
            })
                .then(res => {
                    // loadingInstance.close();
                    if (this.close(res)){
                        resolve(res.data);
                    }
                })
                .catch(err => {
                    // loadingInstance.close();
                    // ElMessage.error(JSON.stringify(err.message));
                    reject(err)
                })
        })
    },


    exports(url,data,name){
        // let loadingInstance = '';
        // if (DOM){
        //     loadingInstance = ElLoading.service({
        //         target: document.querySelector('.'+DOM)
        //     });
        // }else{
        //     loadingInstance = ElLoading.service({ fullscreen: true })
        // }
        let setting = {
            'token':token,
            'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
        }
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: url,
                params: data,
                headers: setting,
                responseType: 'blob'
            }).then((res) => {
                var blob = new Blob([res.data]);
                var filename = name;
                var a = document.createElement('a');
                var url =window.URL.createObjectURL(blob);
                a.href = url;
                a.download = filename;
                var body = document.getElementsByTagName('body')[0];
                body.appendChild(a);
                a.click();
                body.removeChild(a);
                window.URL.revokeObjectURL(url);
                // loadingInstance.close();
                resolve(res.data);
            }).catch(err=>{
                // loadingInstance.close();
                // ElMessage.error(JSON.stringify(err.message));
                reject(err)
            })
        })

    },

    close(res){
        if (res.data.code == 444){
            //未登录
            window.sessionStorage.clear();
            window.location.href = '/';
        }
        if (res.data.code !== 200){
            // ElMessage.error(res.data.msg);
            return false;
        }
        return true;
    }

};

