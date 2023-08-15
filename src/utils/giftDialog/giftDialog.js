import Main from './RowTip'
import Vue from 'vue'
const GiftDialogConstructor = Vue.extend(Main)

const GiftDialog = function ({ gift, onClose, indexCount }) {
    const instance = new GiftDialogConstructor({
        data: { gift }
    })
    instance.id = gift.msgId
    instance.position.top = (indexCount - 1) * 90
    instance.top.value = (indexCount - 1) * 90
    instance.indexCount = indexCount
    const divContainer = document.createElement('div')
    divContainer.id = `divContainer divContainer-${gift.msgId}`
    instance.$parentDom = document.getElementById('giftBox')
    instance.$parentDom.appendChild(divContainer)

    instance.$mount(divContainer)
    instance.userClose = onClose
    instance.show = true
    instance.dom = instance.$el
    return instance
}

export default GiftDialog
