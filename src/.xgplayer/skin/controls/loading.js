import { createDom } from 'xgplayer/src/utils/util'
// import Loading from '../assets/loadingImg.svg'
import '../style/controls/loading1.scss'

let s_loading = function () {
  let player = this
  let root = player.root
  // 不允许 img  标签 可以用背景图
  let Loading = `
  <p class="loadingP"></p>
`
  let container = createDom('xg-loading', `${Loading}`, {}, 'xgplayer-loading')
  player.once('ready', () => {
    root.appendChild(container)
  })
}

export default {
  name: 's_loading',
  method: s_loading
}