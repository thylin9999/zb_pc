import Mock from 'mockjs'
import { statusCode } from '../../utils/statusCode'
import { url } from '@/api/Common/url'

const uploadImg = config => {
    return {
        code: statusCode.success,
        url: 'https://img.tukuppt.com/bg_grid/00/17/55/YHW2Tc1TTY.jpg!/fh/350'
    }
}
// Mock.mock(url.uploadImage, 'post', uploadImg)
