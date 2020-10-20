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
import { Box } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',

    '&.dragging': {
      border: '1px dashed #cdcdcd',
      padding: '5px'

    }
  },

  card: {
    width: '100px',
    height: '100px',
  },
  title: {
    fontSize: '12px',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',

  },
  duration: {
    fontSize: '13px',
  },
})

type AssessmentSmallOwnProps = {
  assessment: Assessment,
  isDragging?: boolean,
  isHideDuration?: boolean
}

type AssessmentSmallProps = AssessmentSmallOwnProps

const AssessmentSmall: FunctionComponent<AssessmentSmallProps> = ({
  assessment,
  isDragging,
  isHideDuration,
  children,

}) => {
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, isDragging && 'dragging')}>
      <Card className={classes.card}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            {assessment.title}
          </Typography>
        </CardContent>
      </Card>
     <div className={classes.actions}>
     {!isHideDuration &&<div className={classes.duration}>{assessment.duration} (min)</div>}
      {children}
      </div>
    </div>
  )
}

export default AssessmentSmall
