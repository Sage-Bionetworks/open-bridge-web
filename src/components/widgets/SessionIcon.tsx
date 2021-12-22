import {ReactComponent as Session1Circle} from '@assets/symbols/session1.svg'
import {ReactComponent as Session10TriangleR} from '@assets/symbols/session10.svg'
import {ReactComponent as Session11HexagonFlat} from '@assets/symbols/session11.svg'
import {ReactComponent as Session12TriangleSharpDown} from '@assets/symbols/session12.svg'
import {ReactComponent as Session13RhombusV} from '@assets/symbols/session13.svg'
import {ReactComponent as Session14TriangleCornerL} from '@assets/symbols/session14.svg'
import {ReactComponent as Session15Octagon} from '@assets/symbols/session15.svg'
import {ReactComponent as Session16RhombusH} from '@assets/symbols/session16.svg'
import {ReactComponent as Session17TriandleCornerR} from '@assets/symbols/session17.svg'
import {ReactComponent as Session18TriangleL} from '@assets/symbols/session18.svg'
import {ReactComponent as Session19TriangleB} from '@assets/symbols/session19.svg'
import {ReactComponent as Session1CircleEmpty} from '@assets/symbols/session1_empty.svg'
import {ReactComponent as Session1CircleHalf} from '@assets/symbols/session1_half.svg'
import {ReactComponent as Session2Triangle} from '@assets/symbols/session2.svg'
import {ReactComponent as Session20TriangleDiagonal} from '@assets/symbols/session20.svg'
import {ReactComponent as Session2TriangleHalf} from '@assets/symbols/session2_half.svg'
import {ReactComponent as Session3Square} from '@assets/symbols/session3.svg'
import {ReactComponent as Session3SquareHalf} from '@assets/symbols/session3_half.svg'
import {ReactComponent as Session4Diamond} from '@assets/symbols/session4.svg'
import {ReactComponent as Session4DiamondHalf} from '@assets/symbols/session4_half.svg'
import {ReactComponent as Session5Pentagon} from '@assets/symbols/session5.svg'
import {ReactComponent as Session6Hexagon} from '@assets/symbols/session6.svg'
import {ReactComponent as Session7TriangleSharpUp} from '@assets/symbols/session7.svg'
import {ReactComponent as Session8SquareSharp} from '@assets/symbols/session8.svg'
import {ReactComponent as Session9DiamondSharp} from '@assets/symbols/session9.svg'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    width: '10px',
    height: '10px',
    marginRight: '5px',
  },
})

const SessionSymbolsArray: any[] = [
  <Session1Circle></Session1Circle>,
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
  <Session19TriangleB></Session19TriangleB>,
  <Session20TriangleDiagonal></Session20TriangleDiagonal>,
]

export const SessionSymbols = new Map([
  [
    'Session1Circle',
    [<Session1Circle />, <Session1CircleHalf />, <Session1CircleEmpty />],
  ],
  [
    'Session2Triangle',
    [<Session2Triangle />, <Session2TriangleHalf />, <Session1CircleEmpty />],
  ],
  ['Session3Square', [<Session3Square />, <Session3SquareHalf />]],
  ['Session4Diamond', [<Session4Diamond />, <Session4DiamondHalf />]],
  ['Session5Pentagon', [<Session5Pentagon />]],
  ['Session6Hexagon', [<Session6Hexagon />]],
  ['Session7TriangleSharpUp', [<Session7TriangleSharpUp />]],
  ['Session8SquareSharp', [<Session8SquareSharp />]],
  ['Session9DiamondSharp', [<Session9DiamondSharp />]],
  ['Session10TriangleR', [<Session10TriangleR />]],
  ['Session11HexagonFlat', [<Session11HexagonFlat />]],
  ['Session12TriangleSharpDown', [<Session12TriangleSharpDown />]],
  ['Session13RhombusV', [<Session13RhombusV />]],
  ['Session14TriangleCornerL', [<Session14TriangleCornerL />]],
  ['Session15Octagon', [<Session15Octagon />]],
  ['Session16RhombusH', [<Session16RhombusH />]],
  ['Session17TriandleCornerR', [<Session17TriandleCornerR />]],
  ['Session18TriangleL', [<Session18TriangleL />]],
  ['Session19TriangleB', [<Session19TriangleB />]],
  ['Session20TriangleDiagonal', [<Session20TriangleDiagonal />]],
])

const sesisonNames = Array.from(SessionSymbols.keys())
export interface SessionIconProps {
  index?: number
  symbolKey?: typeof sesisonNames[number]
  symbolIndex?: number
  children?: JSX.Element | string
}

const SessionIcon: React.FunctionComponent<
  SessionIconProps & React.HTMLAttributes<HTMLElement>
> = props => {
  const {index = 0, symbolKey, symbolIndex = 0, children, ...rest} = props

  const classes = useStyles()
  const imageProps = rest.style
    ? {style: rest.style}
    : {className: classes.icon}

  var haveSymbolForKey = symbolKey && SessionSymbols.has(symbolKey)

  const el = React.cloneElement(
    haveSymbolForKey
      ? SessionSymbols.get(symbolKey!)![symbolIndex]
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
