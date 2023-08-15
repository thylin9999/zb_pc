/* eslint-disable */
import CryptoJS from 'crypto-js';

import {Message} from "element-ui";

export function isRequire(label) {
    return (value) => {
        const message = value ? null : label + errorMessage.isRequire
        return {
            type: 'isRequire',
            message
        }
    }

}

export function mustNumber(value) {
    const reg = /(^[1-9]\d*$)/
    const message = reg.test(value) ? null : errorMessage.mustNumber
    return {
        type: 'mustNumber',
        message
    }
}
export function phone(value) {
    const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    const message = reg.test(value) ? null : errorMessage.phone
    return {
        type: 'phone',
        message
    }
}

export function throttle(fn, wait = 1000) {  //节流
    let last = 0
    return function () {
        let now = Date.now()
        if (now - last > wait) {
            fn.apply(this, arguments)
            last = now
        }
    }
}

export function debounce(fn, wait = 1000) {  //防抖
    let timer = null
    return function () {
        let now = !timer
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            timer = null
        }, wait)
        if (now) {
            fn.apply(this, arguments)
        }
    }
}

export function Copy(copyValue) {  //复制
    const domUrl = document.createElement('input')
    domUrl.value = copyValue
    domUrl.id = 'creatDom'
    document.body.appendChild(domUrl)
    domUrl.select() // 选择对象
    document.execCommand('Copy') // 执行浏览器复制命令
    const creatDom = document.getElementById('creatDom')
    creatDom.parentNode.removeChild(creatDom)
    // Message({
    //     type: 'success',
    //     message: '复制成功',
    //     duration: 1000
    // })
    alert('复制成功')
}

export const errorMessage = {
    isRequire: '不能为空',
    phone: '请输入正确的手机号码',
    mustNumber: '必须为数字'
}

// var CryptoJS = require("crypto-js");

//删除数组中指定一项
export function removeArrayItem(arr, item) {
    if (arr.length > 0) {
        const index = arr.indexOf(item)
        if (index > -1) {
            return arr.splice(index, 1)
        }
    }
}


// 传入key之前要调用，不然结果不对
function parseKey(key) {
    return CryptoJS.enc.Utf8.parse(key);
}

/*拉流权健配置*/

// 加密过程
function encrypt(mode, plainText, key, iv = null) {
    const uKey = parseKey(key);
    const uIv = parseKey(iv);

    return CryptoJS.AES.encrypt(plainText, uKey,
        {
            iv: uIv,
            mode: mode,
            padding: CryptoJS.pad.Pkcs7
        }
    ).toString();
}

// 解密过程
function decrypt(mode, cipherText, key, iv = null) {
    const uKey = parseKey(key);
    const uIv = parseKey(iv);

    let bytes = CryptoJS.AES.decrypt(cipherText, uKey,
        {
            iv: uIv,
            mode: mode,
            padding: CryptoJS.pad.Pkcs7
        }
    );
    return bytes.toString(CryptoJS.enc.Utf8);
}

// 辅助函数
function md5(data) {
    return CryptoJS.MD5(data).toString();
}

export function getPullUrl(url) {
    const key = 'ef14b146e989b922dcb5a00a19f907c5' // 32位
    const md5Key = md5(key); // 生成md5
    const iv = md5Key.substr(0, 16); // 16位
    let plainText = decrypt(CryptoJS.mode.CBC, url, key, iv);
    return plainText
}

// 直播id加密
export function encryptRoomId(roomId) {
    const key = 'ef14b146e989b922dcb5a00a19f907c5' // 32位
    const md5Key = md5(key); // 生成md5
    const iv = md5Key.substr(0, 16); // 16位
    let roomIdText = encrypt(CryptoJS.mode.CBC, roomId, key, iv);
    return roomIdText
}




