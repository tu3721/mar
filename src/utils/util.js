'use strict'

import CryptoJS from 'crypto-js'
export default {
    // 加密函數
    secret(string, operation) {
        var key  = CryptoJS.enc.Utf8.parse('F2HW3Bct9GdWhLY1');
        if (operation){
            // 解密
            let res =  CryptoJS.AES.decrypt(string, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
            return JSON.parse(res);
        }else{
            string = JSON.stringify(string);
            // 加密
            return CryptoJS.AES.encrypt(string,key, { mode:CryptoJS.mode.ECB, padding:CryptoJS.pad.Pkcs7 }).toString();
        }
    }

}

