import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ReactComponent as Session1 } from '../../assets/symbols/session1.svg'
import { ReactComponent as Session10 } from '../../assets/symbols/session10.svg'
import { ReactComponent as Session11 } from '../../assets/symbols/session11.svg'
import { ReactComponent as Session12 } from '../../assets/symbols/session12.svg'
import { ReactComponent as Session13 } from '../../assets/symbols/session13.svg'
import { ReactComponent as Session14 } from '../../assets/symbols/session14.svg'
import { ReactComponent as Session15 } from '../../assets/symbols/session15.svg'
import { ReactComponent as Session16 } from '../../assets/symbols/session16.svg'
import { ReactComponent as Session17 } from '../../assets/symbols/session17.svg'
import { ReactComponent as Session18 } from '../../assets/symbols/session18.svg'
import { ReactComponent as Session19 } from '../../assets/symbols/session19.svg'
import { ReactComponent as Session2 } from '../../assets/symbols/session2.svg'
import { ReactComponent as Session20 } from '../../assets/symbols/session20.svg'
import { ReactComponent as Session3 } from '../../assets/symbols/session3.svg'
import { ReactComponent as Session4 } from '../../assets/symbols/session4.svg'
import { ReactComponent as Session5 } from '../../assets/symbols/session5.svg'
import { ReactComponent as Session6 } from '../../assets/symbols/session6.svg'
import { ReactComponent as Session7 } from '../../assets/symbols/session7.svg'
import { ReactComponent as Session8 } from '../../assets/symbols/session8.svg'
import { ReactComponent as Session9 } from '../../assets/symbols/session9.svg'

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
    <Session1 className={classes.icon}></Session1>,
    <Session2 className={classes.icon}></Session2>,
    <Session3 className={classes.icon}></Session3>,
    <Session4 className={classes.icon}></Session4>,
    <Session5 className={classes.icon}></Session5>,
    <Session6 className={classes.icon}></Session6>,
    <Session7 className={classes.icon}></Session7>,
    <Session8 className={classes.icon}></Session8>,
    <Session9 className={classes.icon}></Session9>,
    <Session10 className={classes.icon}></Session10>,
    <Session11 className={classes.icon}></Session11>,
    <Session12 className={classes.icon}></Session12>,
    <Session13 className={classes.icon}></Session13>,
    <Session14 className={classes.icon}></Session14>,
    <Session15 className={classes.icon}></Session15>,
    <Session16 className={classes.icon}></Session16>,
    <Session17 className={classes.icon}></Session17>,
    <Session18 className={classes.icon}></Session18>,
    <Session19 className={classes.icon}></Session19>,
    <Session20 className={classes.icon}></Session20>,
  ]

  return (
    <div className={classes.root}>
      {elements[index]} {children}
    </div>
  )
}

export default SessionIcon
