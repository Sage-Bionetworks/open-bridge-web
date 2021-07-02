import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {ReactComponent as Session1} from '../../assets/symbols/session1.svg'
import {ReactComponent as Session10} from '../../assets/symbols/session10.svg'
import {ReactComponent as Session11} from '../../assets/symbols/session11.svg'
import {ReactComponent as Session12} from '../../assets/symbols/session12.svg'
import {ReactComponent as Session13} from '../../assets/symbols/session13.svg'
import {ReactComponent as Session14} from '../../assets/symbols/session14.svg'
import {ReactComponent as Session15} from '../../assets/symbols/session15.svg'
import {ReactComponent as Session16} from '../../assets/symbols/session16.svg'
import {ReactComponent as Session17} from '../../assets/symbols/session17.svg'
import {ReactComponent as Session18} from '../../assets/symbols/session18.svg'
import {ReactComponent as Session19} from '../../assets/symbols/session19.svg'
import {ReactComponent as Session2} from '../../assets/symbols/session2.svg'
import {ReactComponent as Session20} from '../../assets/symbols/session20.svg'
import {ReactComponent as Session3} from '../../assets/symbols/session3.svg'
import {ReactComponent as Session4} from '../../assets/symbols/session4.svg'
import {ReactComponent as Session5} from '../../assets/symbols/session5.svg'
import {ReactComponent as Session6} from '../../assets/symbols/session6.svg'
import {ReactComponent as Session7} from '../../assets/symbols/session7.svg'
import {ReactComponent as Session8} from '../../assets/symbols/session8.svg'
import {ReactComponent as Session9} from '../../assets/symbols/session9.svg'

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

const elements = [
  <Session1></Session1>,
  <Session2></Session2>,
  <Session3></Session3>,
  <Session4></Session4>,
  <Session5></Session5>,
  <Session6></Session6>,
  <Session7></Session7>,
  <Session8></Session8>,
  <Session9></Session9>,
  <Session10></Session10>,
  <Session11></Session11>,
  <Session12></Session12>,
  <Session13></Session13>,
  <Session14></Session14>,
  <Session15></Session15>,
  <Session16></Session16>,
  <Session17></Session17>,
  <Session18></Session18>,
  <Session19></Session19>,
  <Session20></Session20>,
]

export interface SessionIconProps {
  index?: number
  children?: JSX.Element | string
}

export interface SessionImageProps {
  index?: number
}

const SessionIcon: React.FunctionComponent<
  SessionIconProps & React.HTMLAttributes<HTMLElement>
> = props => {
  const {index = 0, children, ...rest} = props

  const classes = useStyles()
  const imageProps = rest.style
    ? {style: rest.style}
    : {className: classes.icon}

  const el = React.cloneElement(elements[index], imageProps)

  return (
    <div className={classes.root}>
      {el} {children}
    </div>
  )
}

export default SessionIcon
