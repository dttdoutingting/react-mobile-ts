import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'antd-mobile/lib/modal/index'
import { Action} from 'antd-mobile/lib/modal/PropsType'

const stopMove = (e: any)=> e.preventDefault()

export default function alert(
    title: React.ReactNode,
    message: React.ReactNode,
    actions=[{text: '知道了'}]
){

    const div=document.createElement('div')
    document.body.appendChild(div)

    const close = ()=> {
        // 卸载组件
        ReactDOM.unmountComponentAtNode(div)
        // 将div节点移除
        div.remove()
        // 卸载监听事件
        document.body.removeEventListener('touchmove', stopMove)
    }

    const footer = actions.map((button:Action<React.CSSProperties>) => {
        const oldOnPress = button.onPress || (()=> {})
        button.onPress = ()=> {
            const res = oldOnPress()
            // 判断oldOnPress是否是异步函数
            if(res && res.then){
                res.then(close).catch(()=> {})
            }
            else {
                close()
            }
        }
        return button
    })
    // 解决 弹框后的滑动事件
    document.body.addEventListener('touchmove',stopMove, {passive: false})
    ReactDOM.render(
        <Modal 
            visible={true} 
            transparent={true} 
            title={title} 
            closable={false} 
            maskClosable={false}
            footer={footer}
        >
            <div>{message}</div>
        </Modal>,
        div)
}