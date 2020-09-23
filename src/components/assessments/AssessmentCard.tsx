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

const useStyles = makeStyles({
  root: {
    width: '300px',
    border: '1px solid gray',
  },
  dragging: {
    width: '250px !important',
    height: '250px !important',
  },

  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
})

type AssessmentCardOwnProps = {
  assessment: Assessment
  index: number
}

type AssessmentCardProps = AssessmentCardOwnProps

const AssessmentCard: FunctionComponent<AssessmentCardProps> = ({
  assessment,

  index,
}) => {
  const classes = useStyles()
  // const bull = <span className={classes.bullet}>•</span>

  const className = clsx({ [classes.root]: true, [classes.dragging]: false })
  //console.log('className', className)

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.pos} color="textSecondary" gutterBottom>
          {assessment.title}
        </Typography>

        <Typography className={classes.title} color="textSecondary">
          {assessment.description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default AssessmentCard
