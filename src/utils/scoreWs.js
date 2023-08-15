
// _scoreWs
export default class ScoreWs {
    static initScoreWs (cb) {
        this.cb = cb
        this.listenerCb = []
        this.types = ['score', 'goal', 'yellow', 'red', 'now']
        this.ws = null
        // eslint-disable-next-line no-undef
        this.wsUrl = _scoreWs
        this.listener = new Listener()
        this.init()
    }

    static init () {
        if (!this.ws) {
            this.ws = new WebSocket(this.wsUrl)
            this.ws.onmessage = this.onMessage.bind(this)
            this.ws.onclose = this.onClose.bind(this)
            this.ws.onerror = this.onError.bind(this)
            this.ws.onopen = this.onOpen.bind(this)
        }
    }

    static sendMsg (msg) {
        this.ws.send(msg)
    }

    static onOpen (e) {
        if (this.cb) {
            this.cb()
        }
        if (this.listenerCb.length) {
            this.listenerCb.forEach(listener => {
                listener()
            })
        }
    }

    static closeWs () {
        this.ws.close()
        this.ws = null
    }

    static onMessage ({ data }) {
        const originalData = JSON.parse(data)
        const type = originalData[0]
        const _data = originalData[1]
        if (this.types.includes(type)) {
            switch (type) {
            case 'score':
                this.listener.emit('score', { data: _data, type })
                break
            case 'goal':
            case 'yellow':
            case 'red':
                this.listener.emit('info', { data: _data, type })
                break
            case 'now':
                this.listener.emit('now', { data: _data, type })
                break
            default:
            }
        }
    }

    static onError (e) {
        console.log(e, 'onError')
    }

    static onClose (e) {
        console.log(e, 'onClose')
    }

    // 将徐璈监听的事件添加到 列表中
    static addListener (cb) {
        const index = this.listenerCb.findIndex(x => x === cb)
        if (index === -1) {
            this.listenerCb.push(cb)
        }
    }
}

class Listener {
    constructor () {
        this.cbs = {}
    }

    on (type, cb) {
        const existCbs = this.cbs[type]
        if (!existCbs) {
            this.cbs[type] = []
        }
        this.cbs[type].push(cb)
    }

    emit (type, params) {
        const cbs = this.cbs[type] || []
        cbs.forEach(cb => {
            cb(params)
        })
    }

    off (type, cb) {
        const existCbs = this.cbs[type]
        if (existCbs) {
            const index = existCbs.findIndex(x => x === cb)
            this.cbs[type].splice(index, 1)
        }
    }
}
