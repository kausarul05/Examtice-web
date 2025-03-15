import IdleTimer from 'react-idle-timer'
import React from 'react'

function IdleTimerContainer() {
    const idleTimerRef = useRef(null)

    const onIdle = () => {
        console.log('User is idle')
    }
  return (

    <IdleTimer>{idleTimerRef} timeout={60 * 30 * 1000} onIdle={onIdle} </IdleTimer>

  )
}

export default IdleTimerContainer


