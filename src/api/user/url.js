const url = {
    userInfo: '/api/member/details',
    login: '/api/member/login',
    updateToken: '/api/jwt/refresh',
    logout: '/api/member/logout',
    register: '/api/member/register',
    editUserInfo: '/api/member/editMember',
    getCode: '/api/sendSms/send',
    updatePassword: '/api/member/editPwd2',
    findBackPwd: '/api/member/editPwd',
    updatePhone: '/api/member/editMobile',

    updatePhone2: '/api/member/updateMobile',
    validatePhone: '/api/member/editOldMobile',
    updatePwd: '/api/member/updatePwd',
    getMemberDetail: '/api/member/details', // 用户label列表

    // 申请主播
    validateAuth: '/api/realname/add',
    applyAnchor: '/api/apply/anchor',
    applyExpert: '/api/apply/expert',
    getApplyResult: '/api/realname/status',
    getApplyStatus: '/api/apply/status',

    // 专家
    getExpertCenter: '/api/expert/center',
    getPlans: '/api/expert/plans',
    // 消息列表
    getMessages: '/api/message/list',
    // 专家列表

    // 专家搜索
    getHotExperts: '/api/material/experts',
    searchExpert: '/api/expert/search',
    // 发布方案
    releaseSolutions: '/api/expert/release',
    getSolutionStatistic: '/api/expert/statusNum',
    // 方案售价列表
    getPlanPrices: '/api/expert/payPrice',
    getMaterialDetail: '/api/material/detail',
    getHistoryHit: '/api/expert/historyExploit',
    // 销售记录
    getSalesRecord: '/api/expert/salesRecord',
    getSalesPurchase: '/api/expert/purchase',
    // 获取充值链接
    getRechargeUrl: '/api/pay/recharge',
    // 查询充值结果
    getRechargeResult: '/api/pay/queryOrder',
    getRechargeList: '/api/payConfig/list',
    // 充值记录
    getChargeRecord: '/api/member/rechargeRecord',
    getCostRecord: '/api/member/costRecord',
    // 提现
    applyWithdraw: '/api/withdraw/apply',
    getWithdrawRecord: '/api/withdraw/record',
    // token失效
    invalidate: '/api/jwt/invalid'
}
export default url
