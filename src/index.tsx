import React, { Suspense } from 'react'
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import ReactDOM from 'react-dom'
import App from './App'
import { SessionDataProvider } from './helpers/AuthContext'
import './index.css'




if (process.env.NODE_ENV === 'development' || /*AGENDEL REDO!*/ process.env.NODE_ENV === 'production' ) {
  console.log('development')
  const { worker } = require('./mocks/browser')
  worker.start()
} else {
  console.log(process.env.NODE_ENV )
}


ReactDOM.render(
  <React.StrictMode>
    <SessionDataProvider>
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </SessionDataProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister()
