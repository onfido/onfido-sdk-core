import events from '../core/events'
import { actions } from '../store/actions'
import RobustWebSocket from 'robust-websocket'

const { setWebSocketError, setAuthenticated } = actions

export default class Socket {

  connect(url) {
    const socket = new RobustWebSocket(url)
    socket.onerror = () => {
      events.emit('onError')
      setWebSocketError(true)
    }
    socket.onopen = () => {
      this.socket = socket
      this.onMessage()
      setAuthenticated(true)
    }
    socket.onclose = (closeEvent) => {
      const message = 'Websockets connection closed.'
      console.warn(`${message} Code: ${closeEvent.code} Reason: ${closeEvent.reason}`)
    }
  }

  onMessage() {
    this.socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      events.emit('onMessage', data)
      // setWebSocketError(false)
    }
  }

  sendMessage(message) {
    this.socket.send(message)
  }

}
