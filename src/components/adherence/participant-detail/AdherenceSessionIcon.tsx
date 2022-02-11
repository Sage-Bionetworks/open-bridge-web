import {SessionSymbols} from '@components/widgets/SessionIcon'
import {makeStyles} from '@material-ui/core'
import {AdherenceWindowState} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'

const useStyles = makeStyles(theme => ({
  dot: {
    width: '6px',
    height: '6px',
    margin: '0 auto',
    borderRadius: '50%',
    border: '2px solid black',
    '&$legend': {
      margin: '2px',
    },
  },
  plotElement: {
    width: '10px',

    overflow: 'visible',
  },
  legend: {},
}))

export const SHAPE_CLASSES: Record<
  AdherenceWindowState,
  {
    shapeIndex: number
    complianceState: 'NONCOMPLIANT' | 'COMPLIANT' | 'UNKNOWN' | undefined
  }
> = {
  not_applicable: {shapeIndex: -1, complianceState: undefined},
  not_yet_available: {shapeIndex: -1, complianceState: undefined},
  unstarted: {shapeIndex: -1, complianceState: 'UNKNOWN'},
  started: {shapeIndex: 1, complianceState: 'UNKNOWN'},
  completed: {shapeIndex: 0, complianceState: 'COMPLIANT'},
  abandoned: {shapeIndex: 1, complianceState: 'NONCOMPLIANT'},
  expired: {shapeIndex: 2, complianceState: 'NONCOMPLIANT'},
  declined: {shapeIndex: 2, complianceState: 'NONCOMPLIANT'},
}

const AdherenceSessionIcon: FunctionComponent<{
  sessionSymbol?: string | undefined
  windowState: AdherenceWindowState
  isRed?: boolean
  children?: React.ReactNode
  isInLegend?: boolean
}> = ({sessionSymbol, windowState, children, isRed = false, isInLegend}) => {
  const classes = useStyles()
  if (!sessionSymbol) {
    return <></>
  }

  //these states will show empty dot
  const isEmptyDot = SHAPE_CLASSES[windowState].shapeIndex === -1

  //0 - filled, 1- partcial, 2 - empty, 3 - partical-red, 4- empty-red

  let variant = SHAPE_CLASSES[windowState].shapeIndex
  if (isRed && variant > 0) {
    variant = variant + 2
  }
  if (variant === undefined) {
    throw Error('unknown state')
  }

  var classList = clsx({
    //  [classes.emptySvg]: variant === 2,
    [classes.plotElement]: true,
    // [classes.redSvg]: isRed && variant !== 0,
  })

  const el = isEmptyDot ? (
    <div className={clsx(classes.dot, isInLegend && classes.legend)} />
  ) : (
    React.cloneElement(SessionSymbols.get(sessionSymbol)![variant], {
      className: classList,
    })
  )

  return !children ? (
    <>{el}</>
  ) : (
    <div style={{display: 'flex', alignItems: 'center'}}>
      {el}

      <div style={{marginLeft: '4px'}}>{children}</div>
    </div>
  )
}

export default AdherenceSessionIcon
