import { createStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import validated from '../../assets/validated.svg'
import { Assessment } from '../../types/types'
import AssessmentImage from './AssessmentImage'

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: '300px',
      height: '512px',
      border: '1px solid gray',
      padding: 0,

      display: 'flex',
      flexDirection: 'column',
    },
    dragging: {
      width: '250px !important',
      height: '250px !important',
    },

    title: {
      fontSize: 14,
    },
    content: {
      flexGrow: 1,
    },

    tags: {
      alignSelf: 'flex-end',
      backgroundColor: '#ccc',
      padding: '5px',
    },
    bottom: {
      marginTop: 'auto',
      display: 'flex',

      alignItems: 'center',
      justifyContent: 'space-between',
    },
  }),
)

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
      <AssessmentImage resources={assessment.resources} name={assessment.title}>
        <Typography variant="subtitle2" className={classes.tags}>
          {assessment.tags.join(', ')}
        </Typography>
      </AssessmentImage>
      <CardContent className={classes.content}>
        <Typography color="textSecondary" gutterBottom>
          {assessment.title}
        </Typography>

        <Typography className={classes.title} color="textSecondary">
          {assessment.summary}
        </Typography>
      </CardContent>
      <CardActions className={classes.bottom}>
        <div>{assessment.duration} </div>
        <img src={validated} />
      </CardActions>
    </Card>
  )
}

export default AssessmentCard
