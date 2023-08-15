import request from '../request'
import url from './url'
export function getUserInfo (id) {
    return request({
        method: 'get',
        url: url.userInfo,
        requestTimeoutType: 'detail',
        params: {
            id
        }
    })
}

export function loginWithCode (code) {
    return request({
        method: 'post',
        url: '/api/wechat/login',
        data: {
            code
        }
    })
}

export function login ({ account = 'admin', password = '000000' }) {
    return request({
        method: 'POST',
        url: url.login,
        data: {
            account,
            password
        },
        timeout: 60 * 1000
    })
}

export function logout () {
    return request({
        method: 'post',
        url: url.logout
    })
}
export function register ({ account = 'admin', code = 666666, password = '000000' }) {
    return request({
        method: 'POST',
        url: url.register,
        data: {
            account,
            password,
            mobile_code: code
        }
    })
}

export function editUserInfo ({ nickname, label, sign, birth, gender, avatar }) {
    return request({
        method: 'post',
        url: url.editUserInfo,
        data: {
            nickname,
            sign,
            birth,
            gender,
            avatar,
            label
        }
    })
}

// 找回密码
export function findBackPwd ({ account = 'admin', code = 666666, password = '000000' }) {
    return request({
        method: 'post',
        url: url.findBackPwd,
        data: {
            account,
            password,
            mobile_code: code
        }
    })
}

export function updatePassword ({ password, verPassword, oldPassword }) {
    return request({
        method: 'post',
        url: url.updatePassword,
        data: {
            password,
            ver_password: verPassword,
            old_password: oldPassword
        }
    })
}

export function getCode ({ mobile, msType = 1, validate }) {
    return request({
        method: 'post',
        url: url.getCode,
        data: {
            mobile,
            'msg_type': msType,
            validate
        }
    })
}

export function updatePhone ({ mobile, code, isValidatePhone = false }) {
    return request({
        method: 'post',
        url: isValidatePhone ? url.validatePhone : url.updatePhone,
        data: {
            mobile,
            mobile_code: code
        }
    })
}

export function updatePhone2 ({ newPhone, oldPhone, code }) {
    return request({
        method: 'post',
        url: url.updatePhone2,
        data: {
            mobile_new: newPhone,
            mobile_old: oldPhone,
            vcode: code
        }
    })
}

export function validateAuth ({
    name,
    idCard,
    imgs
}) {
    return request({
        method: 'post',
        url: url.validateAuth,
        data: {
            name,
            id_card: idCard,
            id_card_front_photo: imgs.frontImg,
            id_card_back_photo: imgs.backImg,
            hand_held_id_card_photo: imgs.handInImg
        }
    })
}
export function applyAnchor ({
    leagueType, contact, contactValue, description, code, experience
}) {
    return request({
        method: 'post',
        url: url.applyAnchor,
        data: {
            exp: experience,
            league_type: leagueType,
            contact: contact,
            contact_value: contactValue,
            bio: description
            // mobile_code: code * 1
        }
    })
}
// 申请专家
export function applyExpert ({
    profession, reference, goodAt, imgs, code
}) {
    const images = imgs.reduce((all, item, index) => {
        const key = 'image_url_' + (index + 1)
        all[key] = item
        return all
    }, {})
    return request({
        method: 'post',
        url: url.applyExpert,
        data: {
            profession,
            reference,
            ...images,
            good_at_games: goodAt,
            mobile_code: code
        }
    })
}

export function updatePwd ({ code, newPwd, mobile }) {
    return request({
        method: 'post',
        url: url.updatePwd,
        data: {
            mobile,
            pwd_new: newPwd,
            vcode: code
        }
    })
}

export function getMemberDetail () {
    return request({
        method: 'post',
        url: url.getMemberDetail
    })
}
export function getApplyResult () {
    return request({
        method: 'get',
        url: url.getApplyResult
    })
}
// 获取申请状态

export function getApplyStatus (type) { // type: 1 主播 2 专家
    return request({
        method: 'get',
        url: url.getApplyStatus,
        params: {
            type
        }
    })
}

// 专家
// 专家首页
export function getExpertCenter () {
    return request({
        method: 'get',
        url: url.getExpertCenter
    })
}

/*
*   date：all - 全部，td - 今日，tw - 本周，tm - 本月，l3m - 近三月'
*   hit 1 - 已命中，2 - 未命中'
*  status 方案状态：1 - 已发售，2 - 待审核，3 - 未通过，4 - 已核实，5 - 待核实
* */
export function getPlans ({
    pageNum, pageSize, status,
    hit,
    date
}) {
    return request({
        method: 'get',
        url: url.getPlans,
        params: {
            pageNum,
            pageSize,
            status,
            hit,
            date_range: date
        }
    })
}
export function getHotExperts () {
    return request({
        method: 'get',
        url: url.getHotExperts
    })
}
export function searchExpert ({ pageNum = 1, pageSize = 10, search = '' }) {
    return request({
        method: 'get',
        url: url.searchExpert,
        params: {
            pageSize,
            pageNum,
            search
        }
    })
}
// 发布方案
export function releaseSolutions (data) {
    return request({
        method: 'post',
        url: url.releaseSolutions,
        data
    })
}

export function getMaterialDetail (id) {
    return request({
        method: 'get',
        url: url.getMaterialDetail,
        params: {
            mp_id: id
        }
    })
}
export function getPlanPrices () {
    return request({
        method: 'get',
        url: url.getPlanPrices
    })
}

// 历史战绩
export function getHistoryHit ({ type, pageNum, pageSize }) {
    return request({
        method: 'get'

    })
}
// 销售记录
export function getSalesRecord ({ date, pageNum, pageSize }) {
    return request({
        method: 'get',
        url: url.getSalesRecord,
        params: {
            pageNum,
            pageSize,
            month: date
        }
    })
}

// 购买明细
export function getSalesPurchase ({ start, end, pageNum, pageSize, id }) {
    return request({
        method: 'get',
        url: url.getSalesPurchase,
        params: {
            pageNum,
            pageSize,
            mp_id: id,
            start,
            end
            // month: date
        }
    })
}
export function getMessages ({ type, pageNum, pageSize }) {
    return request({
        method: 'get',
        url: url.getMessages,
        params: {
            pageNum,
            pageSize,
            type
        }
    })
}

// 方案统计
export function getSolutionStatistic () {
    return request({
        method: 'get',
        url: url.getSolutionStatistic

    })
}

// 刷新token
export function updateToken (memberId, refreshToken) {
    return request({
        method: 'post',
        url: url.updateToken,
        data: {
            member_id: memberId,
            refresh_token: refreshToken
        }
    })
}

// 充值
export function getRechargeUrl ({ payWay, amount, realName = '' }) {
    return request({
        method: 'post',
        url: url.getRechargeUrl,
        data: {
            pay_channel: payWay,
            amount,
            type: 1, // 默认球币
            real_name: realName
        }
    })
}

export function getRechargeResult (orderNo) {
    return request({
        method: 'get',
        url: url.getRechargeResult,
        params: {
            order_no: orderNo
        }
    })
}

// 充值消费记录
export function getChargeRecord ({ pageNum, pageSize, start, end }) {
    return request({
        method: 'get',
        url: url.getChargeRecord,
        params: {
            pageNum,
            pageSize,
            start_date: start,
            end_date: end
        }
    })
}
export function getCostRecord ({ pageNum, pageSize, start, end }) {
    return request({
        method: 'get',
        url: url.getCostRecord,
        params: {
            pageNum,
            pageSize,
            start_date: start,
            end_date: end
        }
    })
}
// 支付配置列表
export function getRechargeList () {
    return request({
        method: 'get',
        url: url.getRechargeList
    })
}

// 提现申请
export function applyWithdraw ({ bank, name, cardNumber, ballCoin }) {
    return request({
        method: 'post',
        url: url.applyWithdraw,
        data: {
            bank,
            name,
            card_number: cardNumber,
            ball_coin: ballCoin
        }
    })
}
// 提现记录
export function getWithdrawRecord ({
    pageNum, pageSize, start, end, status
}) {
    return request({
        method: 'get',
        url: url.getWithdrawRecord,
        params: {
            pageNum,
            pageSize,
            start_date: start,
            end_date: end,
            status
        }
    })
}

export function invalidateToken (refreshToken) {
    return request({
        method: 'post',
        url: url.invalidate,
        data: {
            refresh_token: !!refreshToken
        }
    })
}
