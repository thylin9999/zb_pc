
// 初始化图形验证码
export function generateInstance ({ el = '#captchaContainer', cb }) {
    let captchaIns
    // eslint-disable-next-line no-new
    return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-undef
        initNECaptchaWithFallback({
            element: el,
            captchaId: '0b2751aad8d94852b196e2d74ea0e5dd',
            width: '320px',
            mode: 'popup',
            apiVersion: 2,
            popupStyles: {
                position: 'fixed',
                top: '40%'
            },
            onVerify: (err, data) => {
                /**
                 * 第一个参数是err（Error的实例），验证失败才有err对象
                 * 第二个参数是data对象，验证成功后的相关信息，data数据结构为key-value，如下：
                 * {
                 *   validate: 'xxxxx' // 二次验证信息
                 * }
                 **/
                if (err) return // 当验证失败时，内部会自动refresh方法，无需手动再调用一次

                cb && cb(data)
            }
        }, (instance) => {
            captchaIns = instance
            resolve(captchaIns)
        }, function onerror (err) {
            console.warn(err)
            reject(err)
        })
    })
}
