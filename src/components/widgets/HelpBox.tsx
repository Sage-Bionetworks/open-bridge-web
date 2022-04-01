import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import React from 'react'
import {latoFont, ThemeType} from '../../style/theme'

interface StyleProps {
  helpTextWidth: number
  helpTextLeftOffset: number
  helpTextTopOffset: number
  arrowTailLength: number
  arrowRotate: number
}

const useStyles = makeStyles<ThemeType, StyleProps>(theme => ({
  root: {
    background: theme.palette.error.light,
    color: 'black',
    borderRadius: '0',
    fontFamily: latoFont,
    fontSize: '14px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    padding: theme.spacing(0.625, 2),

    '&:hover': {
      fontWeight: 'bolder',
      background: theme.palette.error.light,
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
    },
  },
  helpArrow: {
    transform: 'rotate(-10deg)',
  },
  helpText: props => ({
    backgroundColor: '#FFE500',
    padding: theme.spacing(2),
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
    position: 'absolute',
    top: props.helpTextTopOffset,
    left: props.helpTextLeftOffset,
    width: props.helpTextWidth,
  }),
  arrow: props => ({
    display: 'inline-block',
    float: 'left',
    cursor: 'pointer',

    '&:after': {
      top: '2px',
      left: 0,
      width: `${props.arrowTailLength}px`,
      height: '1px',
      content: '""',
      display: 'block',
      position: 'absolute',
      backgroundColor: 'black',
    },
    '&:before': {
      border: 'solid black',
      content: '""',
      display: 'inline-block',
      padding: '2px',
      position: 'absolute',
      transform: 'rotate(130deg)',
      borderWidth: '0 1px 1px 0',
    },
  }),
}))

export interface HelpBoxProps {
  helpTextWidth?: number
  helpTextLeftOffset?: number
  helpTextTopOffset?: number
  arrowRotate?: number
  leftOffset?: number
  topOffset?: number
  arrowTailLength?: number
}

const HelpBox: React.FunctionComponent<HelpBoxProps> = ({
  helpTextWidth = 200,
  helpTextLeftOffset = 60,
  arrowRotate = 20,
  arrowTailLength = 280,
  leftOffset = 100,
  topOffset = 20,
  helpTextTopOffset = 0,
  children,
}) => {
  const classes = useStyles({
    helpTextWidth,
    helpTextLeftOffset,
    arrowRotate,
    arrowTailLength,
    helpTextTopOffset,
  })

  return (
    <Box zIndex="100" position="absolute" left={leftOffset} top={topOffset}>
      <Box style={{transform: `rotate(${arrowRotate}deg)`}} position="absolute">
        <div className={classes.arrow}></div>
      </Box>
      <Box className={classes.helpText}>{children}</Box>
    </Box>
  )
}

export default HelpBox
