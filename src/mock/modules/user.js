import Mock from 'mockjs'
import { statusCode } from '../../utils/statusCode'
import url from '../../api/user/url'
const login = config => {
    return Mock.mock({
        code: statusCode.success,
        data: 'token-token-token'
    })
}
const userInfo = config => {
    return Mock.mock({
        code: statusCode.success,
        data: {
            userName: '@cname',
            'role|1': [
                {
                    id: 1,
                    name: '管理员'
                },
                {
                    id: 2,
                    name: '操作员'
                }
            ] // 角色列表
        }
    })
}

// Mock.mock(url.login, 'post', login)
Mock.mock(/\/api\/v1\/user\/info/, 'get', userInfo)
