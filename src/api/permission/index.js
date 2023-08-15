import request from '../request'
import url from './url'
export function getPermission () {
    return request({
        method: 'get',
        url: url.getPermission
    })
}
