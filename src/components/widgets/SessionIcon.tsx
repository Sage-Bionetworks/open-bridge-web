import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Link from '@material-ui/core/Link'
import BackIcon from '@material-ui/icons/KeyboardBackspace'

import { Typography } from '@material-ui/core'
import { ReactComponent as Rect } from '../../assets/symbols/rect.svg'
import { ReactComponent as Circle } from '../../assets/symbols/circle.svg'
import { ReactComponent as Diamond } from '../../assets/symbols/diamond.svg'
import { ReactComponent as Star } from '../../assets/symbols/star.svg'
import { ReactComponent as Triangle } from '../../assets/symbols/triangle.svg'
import clsx from 'clsx'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fill: 'black',
    stroke: 'black',
    width: '10px',
    height: '10px',
    marginRight: '5px',

    '&$iconEmpty': {
      fill: 'transparent',
      stroke: 'black',
    },
  },
  iconEmpty: {},
})

export interface SessionIconProps {
  index?: number
  children: JSX.Element | string
}

const SessionIcon: React.FunctionComponent<SessionIconProps> = ({
  index = 0,
  children,
}: SessionIconProps) => {
  const classes = useStyles()
  const elements = [
    <Circle className={classes.icon}></Circle>,

    <Triangle className={classes.icon}></Triangle>,
    <Rect className={classes.icon}></Rect>,
    <Diamond className={classes.icon}></Diamond>,
    <Star className={classes.icon}></Star>,
    <Triangle className={clsx(classes.icon, classes.iconEmpty)}></Triangle>,
    <Circle className={clsx(classes.icon, classes.iconEmpty)}></Circle>,
    <Rect className={clsx(classes.icon, classes.iconEmpty)}></Rect>,
    <Diamond className={clsx(classes.icon, classes.iconEmpty)}></Diamond>,
    <Star className={clsx(classes.icon, classes.iconEmpty)}></Star>,
  ]

  return (
    <div className={classes.root}>{elements[index]} {children}
    </div>
  )
}

export default SessionIcon
