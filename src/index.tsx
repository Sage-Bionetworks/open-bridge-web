import {UserSessionDataProvider} from '@helpers/AuthContext'
import React, {Suspense} from 'react'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css'

function isDevelopment() {
  return (
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // or we are on staging
    window.location.hostname.includes('staging') ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  )
}

if (
  process.env.NODE_ENV === 'development' ||
  /*AGENDEL REDO!*/ isDevelopment()
) {
  //AGENDEL: disablingservice workers
  /*console.log('development')
  const {worker} = require('./mocks/browser')
  worker.start()*/
} else {
  console.log(process.env.NODE_ENV)
}
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
const container = createRoot(rootElement)
/*
container.render(
  <UserSessionDataProvider>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </UserSessionDataProvider>
)*/

container.render(
  <UserSessionDataProvider>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </UserSessionDataProvider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister()
