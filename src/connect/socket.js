import events from '../core/events'
import { actions } from '../store/actions'
import ReconnectingWebSocket from 'reconnectingwebsocket'

const { setWebSocketError, setAuthenticated } = actions

export default class Socket {
  connect(url) {
    console.log("connect", url)
    const socket = new ReconnectingWebSocket(url)
    window.socket = socket
    socket.onerror = () => {
      console.log("sockets error")
      events.emit('onError', socket.readyState)
    }
    socket.onopen = () => {
      console.log("sockets opened", socket.readyState)
      this.socket = socket
      this.onMessage()
      setAuthenticated(true)
      setWebSocketError(false)
    },
    socket.onclose = () => {
      console.log('socket closed', socket.readyState)
      setWebSocketError(true)
    }
  }

  onMessage() {
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      events.emit('onMessage', data)
    }
  }

  sendMessage(message) {
    this.socket.send(message)
  }

  destroy() {
    ['onclose','onopen','onerror'].forEach( eventName =>
      this.socket[eventName] = ()=>{}
    )
    this.socket.close()
  }
}
