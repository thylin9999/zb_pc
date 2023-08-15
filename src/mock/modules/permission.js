import Mock, { Random } from 'mockjs'
import { statusCode } from '../../utils/statusCode'
import url from '../../api/permission/url'
const getPermission = config => {
    console.log(Random)
    return Mock.mock({
        code: statusCode.success,
        data: { // 权限列表，可以有不同的方式
            welcome: ['ADD', 'READ'],
            list: ['ADD', 'UPDATE', 'DELETE', 'READ'],
            detail: ['ADD', 'UPDATE', 'DELETE', 'READ'],
            posts: ['ADD', 'UPDATE', 'DELETE', 'READ'],
            Charts: ['ADD', 'UPDATE', 'DELETE', 'READ'],
            form: ['ADD', 'UPDATE', 'DELETE', 'READ']
        }
    })
}

Mock.mock(url.getPermission, 'get', getPermission)
