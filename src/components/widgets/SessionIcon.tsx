import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {ReactComponent as Session1Circle} from '../../assets/symbols/session1.svg'
import {ReactComponent as Session10TriangleR} from '../../assets/symbols/session10.svg'
import {ReactComponent as Session11HexagonFlat} from '../../assets/symbols/session11.svg'
import {ReactComponent as Session12TriangleSharpDown} from '../../assets/symbols/session12.svg'
import {ReactComponent as Session13RhombusV} from '../../assets/symbols/session13.svg'
import {ReactComponent as Session14TriangleCornerL} from '../../assets/symbols/session14.svg'
import {ReactComponent as Session15Octagon} from '../../assets/symbols/session15.svg'
import {ReactComponent as Session16RhombusH} from '../../assets/symbols/session16.svg'
import {ReactComponent as Session17TriandleCornerR} from '../../assets/symbols/session17.svg'
import {ReactComponent as Session18TriangleL} from '../../assets/symbols/session18.svg'
import {ReactComponent as Session19TriangleB} from '../../assets/symbols/session19.svg'
import {ReactComponent as Session2Triangle} from '../../assets/symbols/session2.svg'
import {ReactComponent as Session20TriangleDiagonal} from '../../assets/symbols/session20.svg'
import {ReactComponent as Session3Square} from '../../assets/symbols/session3.svg'
import {ReactComponent as Session4Diamond} from '../../assets/symbols/session4.svg'
import {ReactComponent as Session5Pentagon} from '../../assets/symbols/session5.svg'
import {ReactComponent as Session6Hexagon} from '../../assets/symbols/session6.svg'
import {ReactComponent as Session7TriangleSharpUp} from '../../assets/symbols/session7.svg'
import {ReactComponent as Session8SquareSharp} from '../../assets/symbols/session8.svg'
import {ReactComponent as Session9DiamondSharp} from '../../assets/symbols/session9.svg'

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

const SessionSymbolsArray: any[] = [
  /*<Session1Circle></Session1Circle>,
  <Session2Triangle></Session2Triangle>,
  <Session3Square></Session3Square>,
  <Session4Diamond></Session4Diamond>,
  <Session5Pentagon></Session5Pentagon>,
  <Session6Hexagon></Session6Hexagon>,
  <Session7TriangleSharpUp></Session7TriangleSharpUp>,
  <Session8SquareSharp></Session8SquareSharp>,
  <Session9DiamondSharp></Session9DiamondSharp>,
  <Session10TriangleR></Session10TriangleR>,
  <Session11HexagonFlat></Session11HexagonFlat>,
  <Session12TriangleSharpDown></Session12TriangleSharpDown>,
  <Session13RhombusV></Session13RhombusV>,
  <Session14TriangleCornerL></Session14TriangleCornerL>,
  <Session15Octagon></Session15Octagon>,
  <Session16RhombusH></Session16RhombusH>,
  <Session17TriandleCornerR></Session17TriandleCornerR>,
  <Session18TriangleL></Session18TriangleL>,
  <Session19TriangleB></Session19TriangleB>,*/
  <Session20TriangleDiagonal></Session20TriangleDiagonal>,
]
export const SessionSymbols = new Map([
  ['Session1Circle', <Session1Circle />],
  ['Session2Triangle', <Session2Triangle />],
  ['Session3Square', <Session3Square />],
  ['Session4Diamond', <Session4Diamond />],
  ['Session5Pentagon', <Session5Pentagon />],
  ['Session6Hexagon', <Session6Hexagon />],
  ['Session7TriangleSharpUp', <Session7TriangleSharpUp />],
  ['Session8SquareSharp', <Session8SquareSharp />],
  ['Session9DiamondSharp', <Session9DiamondSharp />],
  ['Session10TriangleR', <Session10TriangleR />],
  ['Session11HexagonFlat', <Session11HexagonFlat />],
  ['Session12TriangleSharpDown', <Session12TriangleSharpDown />],
  ['Session13RhombusV', <Session13RhombusV />],
  ['Session14TriangleCornerL', <Session14TriangleCornerL />],
  ['Session15Octagon', <Session15Octagon />],
  ['Session16RhombusH', <Session16RhombusH />],
  ['Session17TriandleCornerR', <Session17TriandleCornerR />],
  ['Session18TriangleL', <Session18TriangleL />],
  ['Session19TriangleB', <Session19TriangleB />],
  ['Session20TriangleDiagonal', <Session20TriangleDiagonal />],
])

export interface SessionIconProps {
  index?: number
  symbolKey?: string
  children?: JSX.Element | string
}
/*
export interface SessionImageProps {
  index?: number
}*/

const SessionIcon: React.FunctionComponent<
  SessionIconProps & React.HTMLAttributes<HTMLElement>
> = props => {
  const {index = 0, symbolKey, children, ...rest} = props

  const classes = useStyles()
  const imageProps = rest.style
    ? {style: rest.style}
    : {className: classes.icon}

  var haveSymbolForKey = symbolKey && SessionSymbols.has(symbolKey)

  const el = React.cloneElement(
    haveSymbolForKey
      ? SessionSymbols.get(symbolKey!)!
      : SessionSymbolsArray[index],
    imageProps
  )

  return (
    <div className={classes.root}>
      {el} {children}
    </div>
  )
}

export default SessionIcon
