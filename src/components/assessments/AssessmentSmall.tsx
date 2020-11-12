import React, { FunctionComponent } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

import { RouteComponentProps } from 'react-router-dom'
import { Draggable } from 'react-beautiful-dnd'
import clsx from 'clsx'
import { Assessment } from '../../types/types'
import { Box, createStyles, Paper } from '@material-ui/core'
import AssessmentImage from './AssessmentImage'

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',

      padding: 0,
      marginBottom: theme.spacing(1),

      '&.dragging': {
        border: '1px dashed #000',
        padding: '5px',
      },
      '&:hover': {
        border: '2px solid #000',
        // padding: '2px',
        //margin: '0 -5px'
      },
      '&.no-hover:hover': {
        border: 'none'
      }
    },

    card: {
      width: '96px',
      height: '96px',
      flexShrink: 0,
      display:'flex',

      alignContent: 'space-around',
      justifyContent: 'space-around'
    },
    title: {
      fontSize: '12px',
    },
    text: {
      padding: theme.spacing(1),
      paddingRight: theme.spacing(3),
      backgroundColor: '#E0E0E0',
      position: 'relative',

      flexGrow: 1,
      textAlign: 'left'

    },
    duration: {
      fontSize: '13px',
    },
  }),
)

type AssessmentSmallOwnProps = {
  assessment: Assessment
  isDragging?: boolean
  isHideDuration?: boolean
  hasHover?: boolean
}

type AssessmentSmallProps = AssessmentSmallOwnProps

const AssessmentSmall: FunctionComponent<AssessmentSmallProps> = ({
  assessment,
  isDragging,
  isHideDuration,
  hasHover = true,
  children,
}) => {
  const classes = useStyles()

  return (
    <Paper className={clsx(classes.root, !hasHover&& 'no-hover', isDragging && 'dragging')}>
      <Box className={classes.card}>
        <AssessmentImage
          isSmall={true}
          resources={assessment.resources}
          name={assessment.title}
        ></AssessmentImage>
      </Box>
      <div className={classes.text}>
        <span className={classes.title}>
          {assessment.title}

          {!isHideDuration && (
            <div className={classes.duration}>
              {/*assessment.duration*/} 0 min
            </div>
          )}
        </span>
        {children}
      </div>
    </Paper>
  )
}

export default AssessmentSmall
