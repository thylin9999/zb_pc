import { url } from '@/api/news/url'
import request from '../request'

export function getNewsTypes () {
    return request({
        method: 'get',
        url: url.getNewsTypes
    })
}

export function getNews ({ pageSize = 20, currentPage = 1, type }) {
    const params = {
        pageSize,
        pageNum: currentPage
    }
    if (type) {
        params.type = type
    }
    return request({
        method: 'get',
        url: url.getNews,
        params
    })
}

export function getBanners () {
    return request({
        method: 'get',
        url: url.getBanners
    })
}

export function getNewsDetail (id) {
    return request({
        method: 'get',
        url: url.getNewsDetail,
        params: {
            id
        }
    })
}

export function getOtherNews (id) {
    return request({
        method: 'get',
        url: url.getOtherNews,
        params: {
            id
        }
    })
}
