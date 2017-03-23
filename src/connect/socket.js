import events from '../core/events'
import { actions } from '../store/actions'
import ReconnectingWebSocket from 'reconnectingwebsocket'
import debounce from 'debounce'

const { setWebSocketError, setAuthenticated } = actions

//It should be easier to set the error mode than to bring it back to a normal mode
//The reason for this is because if the two states are oscilating (in a reconnecting loop for example)
//The bias should be for the error, since that kind of loop represents an actual connection problem
const setError = () => setTimeout(setWebSocketError.bind(this, true), 2000)
const unsetError = debounce(setWebSocketError.bind(this, false), 2000)

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
      unsetError()
    },
    socket.onclose = () => {
      console.log('socket closed', socket.readyState)
      setError()
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
