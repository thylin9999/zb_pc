import { url } from '@/api/Common/url'
import request from '../request'

export function uploadImage (formData) {
    return request({
        method: 'post',
        url: url.uploadImage,
        data: formData
    })
}
export function getAd ({ pageSize = 2000, type = 1 }) {
    return request({
        method: 'post',
        url: url.getAd,
        data: {
            type,
            pageSize,
            pageNum: 1,
            device: 'PC'
        }
    })
}

export function getEvents (type, config) {
    const _config = {
        method: 'post',
        url: url.getEvents,
        data: {
            adv_type: type
        }
    }
    if (config) {
        Object.assign(_config, config)
    }
    return request(_config)
}
/*
* 内容ID,1=关于我们 | 2=用户协议 | 3=隐私政策 | 4=联系我们 | 5=开播教程  | 6=直播规范 | 7=开播工具  | 8=直播协议
* */
export function getContentList (type) {
    return request({
        method: 'post',
        url: url.getContentList,
        data: {
            id: type
        }
    })
}
export function getDownloadUrls () {
    return request({
        method: 'post',
        url: url.getDownloadUrls
    })
}
