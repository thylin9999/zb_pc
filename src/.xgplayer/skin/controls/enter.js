import {
  createDom
} from "xgplayer/src/utils/util";
import "../style/controls/enter.scss";

let s_enter = function () {
  let player = this;
  let root = player.root;
  //初始化图片的 loading 自定义
  let barStr = "<p class='loadingP'></p>";
  // for (let i = 1; i <= 12; i++) {
  //   barStr += `<div class="xgplayer-enter-bar${i}"></div>`;
  // }
  let enter = createDom(
    "xg-enter",
    `<div class="xgplayer-enter-spinner">
       ${barStr}
       </div>`, {},
    "xgplayer-enter"
  );
  root.appendChild(enter);
};

export default {
  name: "s_enter",
  method: s_enter,
};