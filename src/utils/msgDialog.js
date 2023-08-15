/* eslint-disabled  */
import { Notification } from 'element-ui'

export const notification = {
    success: ({ type, data }) => {
        const bgCard = type === 'goal' ? 'goal' : `yr-card ${type}`
        const reverse = data.who === 'away'
        const boxClass = reverse ? 'reverse' : ''
        const className = `ws-msg-notification ${bgCard} ${boxClass}`

        // 进球
        const goalHtml = `
                <div class="box flex align-center">
                    <div class="header">${data.time}'</div>
                    <div class="content font-14 text-333 flex align-center justify-center">
                        <div class="home-name team">${data.home_name}</div>
                        <div class="score font-20 font-500 flex font align-center justify-between">
                            <span class="home">${data.home_score}</span>
                            <span>-</span>
                            <span class="away">${data.away_score}</span>
                        </div>
                        <div class="away-name team">${data.away_name}</div>
                    </div>
                </div>`
        const cardHtml = `
            <div class="box">
                <div class="header">${data.time}'</div>
                <div class="content font-16 flex align-center ">
                    <div class="who font-14 text-333 font-medium">${data.team_name}</div>
                    <div class="card flex align-center justify-center">
                         <span class="d-inline-block ${type}-card"></span>
                    </div>
                    <div class="cards font-12">
                        <span class="yellow item p-l-5 p-r-5 text-center text-white">${data.yellow}</span>
                        <span class="red item p-l-5 p-r-5 text-center text-white">${data.red}</span>
                    </div>
                </div>
            </div>`
        Notification.success({
            customClass: className,
            position: 'top-center',
            duration: 3000,
            offset: 70,
            showClose: false,
            dangerouslyUseHTMLString: true,
            message: type === 'goal' ? goalHtml : cardHtml
        })
    }
}

// 提示框最多三个
class UseTip {
    constructor () {
        this.vipList = []
        this.currentVip = []

        // 新的礼物
        this.giftList = []
        // 记录当前有几个礼物在展示
        this.animatingGiftsCount = 0
        // 当前礼物执行的位置的index
        this.currentGiftIndex = 0
    }

    init ({ cb, vipCb }) {
        if (cb) {
            this.cb = cb
        }
        if (vipCb) {
            this.vipCb = vipCb
        }
    }

    removeItem (id, cb) { // 一定是从最上面开始移除的
        this.animatingGiftsCount--
        cb && cb()
    }

    addItem (item) {
        if (this.animatingGiftsCount === 0) {
            // 说明之前已经没有在执行的动画了，可以清空giftList
            this.giftList = []
            this.currentGiftIndex = 0
        }
        const index = this.giftList.length
        this.giftList.push({
            ...item,
            itemIndex: index
        })
    }

    addVipItem (item) {
        this.vipList.push(item)
    }

    removeVipItem (cb) {
        this.vipList.splice(0, 1)
        this.currentVip = []
        this.startVip(cb)
    }

    startVip (cb) {
        if (this.vipList.length && !this.currentVip.length) {
            const item = this.vipList[0]
            this.currentVip.push(item)
            this.vipCb(item)
        } else { // 豪华礼物关闭
            cb && cb()
        }
    }

    // 启动动画
    start () {
        if (this.animatingGiftsCount < 3) { // 只有小于3个礼物的时候，才会去执行新的礼物
            if (this.giftList.length > 0) {
                // 礼物有礼物才能执行
                // 获取到最后一个礼物来执行
                const gift = this.giftList[this.currentGiftIndex]
                if (gift) {
                    this.animatingGiftsCount++
                    this.currentGiftIndex++
                    this.cb(gift)
                }
            }
        }
    }
}
// 初始化礼物弹框
export const useTip = new UseTip([])
