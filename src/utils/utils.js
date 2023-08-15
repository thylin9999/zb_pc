import { nanoid } from 'nanoid'
export const weekDay = {
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
    7: '星期日'
}

// 0：未开1：上半场2：中场3：下半场4：加时5：点球-1：完场-10：取消-11：待定-12：腰斩-13：中断-14：推迟
export const matchStatus = {
    '0': '未开',
    '1': '上半场',
    '2': '中场',
    '3': '下半场',
    '4': '加时',
    '5': '点球',
    '-1': '完场',
    '-10': '取消',
    '-11': '待定',
    '-12': '腰斩',
    '-13': '中断',
    '-14': '推迟'
}

export const basketStatus = {
    0: '未开赛',
    1: '一节',
    2: '二节',
    3: '三节',
    4: '四节',
    5: '1OT',
    6: '2OT',
    7: '3OT',
    50: '中场',
    '-1': '完场',
    '-2': '待定',
    '-3': '中断',
    '-4': '取消',
    '-5': '推迟'
}
export const basketGoingStates = [1, 2, 3, 4, 5, 6, 7, 50]
export const isGoingStates = [1, 2, 3, 4, 5]
export const matchTypes = {
    1: '足球',
    2: '篮球',
    3: '电竞',
    4: '其他'
}

export const matchTypeMap = {
    'football': 1,
    'basketball': 2,
    'eSport': 3,
    'other': 4
}

export const giveHeatNumber = value => {
    if (value < 1000) {
        return value
    }
    return getBit(value / 10000) + '万'
}
function getBit (value) {
    const reg = /([0-9]+\.[0-9]{1})[0-9]*/
    let str = value.toString()
    str = str.replace(reg, '$1')
    return str
}
export const calcTime = (time) => {
    // time s为单位
    const secN = time % 60
    const minN = Math.floor(time / 60) % 60
    const hourN = Math.floor(time / 60 / 60)
    const sec = secN >= 10 ? secN : '0' + secN
    const min = minN >= 10 ? minN : '0' + minN
    const hour = hourN >= 10 ? hourN : '0' + hourN
    return `${hour}:${min}:${sec}`
}
export const hidePhone = phone => {
    const value = phone + ''
    return (value.slice(0, 3) + '*****' + value.slice(8))
}

// 正在进行中
export const isGoingCompetition = (state, key = 'football') => {
    const isGoingList = key === 'football' ? isGoingStates : basketGoingStates
    return isGoingList.includes(state)
}
// 已完场
export const isEnd = state => {
    return state === -1
}
// 未开的
export const isFutureCompetition = (state, key) => {
    return !(isGoingCompetition(state, key) && isEnd(state))
}

export const groupChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

// 识别不同的域名，主要是 98 和 88

export const recordString = () => {
    const records = { // 备案号
        'haibao88.com': '桂公网安备 45010802000641号',
        'haibao98.com': '桂公网安备 45010802000641号'
        // 'haibao98.com': '桂ICP备2022011457号' // 之前的备案号
    }
    const { hostname } = window.location
    return records[hostname] || '桂公网安备 45010802000641号'
}

// 方案状态
export const planStatus = {
    1: '已发售',
    2: '待审核',
    3: '未通过',
    4: '已核实',
    5: '待核实'
}

// 计算公告宽度
export function getTextWidth (str = '') {
    const dom = document.createElement('div')
    dom.style.display = 'inline-block'
    dom.style.fontSize = '14px'
    dom.className = 'test-text-width'
    dom.textContent = str
    document.body.appendChild(dom)
    const width = dom.clientWidth
    document.body.removeChild(dom)
    return str ? width : 0
}
// 文字跑马灯相关参数
export const marqueeConfig = {
    delayTime: 0.3, // 上下翻滚的动画时间
    speed: 70 // 横向滚动的速度
}

// 用户标签
export const userLabels = {
    '1': '球迷',
    '11': '主播',
    '12': '专家'
}
// 获取唯一id
export const getUid = () => {
    return nanoid()
}

// 转化时间
export const transferTime = (time) => {
    let second = time % 60
    let min = Math.floor(time / 60)
    min = min < 10 ? '0' + min : min
    second = second < 10 ? '0' + second : second
    return `${min}:${second}`
}

// 提取汉字
export const getZhCharactor = (strValue) => {
    if (strValue != null && strValue !== '') {
        return strValue.replace(/<[^>]+>/g, '')
    } else {
        return strValue
    }
}
