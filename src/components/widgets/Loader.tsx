import {makeStyles} from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress'
import clsx from 'clsx'
import React from 'react'
import {ThemeType} from '../../style/theme'
import {RequestStatus} from '../../types/types'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  full: {
    height: '100vh',
  },
}))

export type LoadingComponentType = {
  children?: React.ReactNode
  reqStatusLoading: RequestStatus | boolean
  variant?: 'full' | 'small'
  style?: any
  loaderSize?: string | number
}

const LoadingComponent = ({
  reqStatusLoading,
  children,
  variant = 'full',
  loaderSize = '3rem',
  style,
}: LoadingComponentType) => {
  const classes = useStyles()
  return reqStatusLoading === 'PENDING' || reqStatusLoading === true ? (
    <div
      className={clsx(classes.root, variant === 'full' && classes.full)}
      style={{...style}}>
      <CircularProgress size={loaderSize} />
    </div>
  ) : (
    <>{children}</>
  )
}

export default LoadingComponent
