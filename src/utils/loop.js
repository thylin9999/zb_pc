
export class LoopTool {
    // autoPlay 在执行完这次 loop后，是否继续
    constructor (cb, timing, autoPlay = false) {
        this.timing = timing
        this.autoPlay = autoPlay
        this.cb = cb
        this.loop()
    }

    loop () {
        window.clearTimeout(this.timer)
        this.timer = setTimeout(async () => {
            await this.cb()
            if (this.autoPlay) {
                this.loop()
            }
        }, this.timing)
    }

    stop () {
        window.clearTimeout(this.timer)
        this.timer = null
    }
}
