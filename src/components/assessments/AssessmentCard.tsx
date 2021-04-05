import { createStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React, { FunctionComponent } from 'react'
import validated from '../../assets/validated.svg'
import { playfairDisplayFont, poppinsFont } from '../../style/theme'
import { Assessment } from '../../types/types'
import AssessmentImage from './AssessmentImage'

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: theme.spacing(28),
      height: theme.spacing(47),
      textAlign: 'left',
      border: '1px solid gray',
      padding: 0,

      display: 'flex',
      flexDirection: 'column',
    },
    dragging: {
      width: '250px !important',
      height: '250px !important',
    },

    content: {
      padding: theme.spacing(1, 2, 0, 2),
      height: theme.spacing(19),
      overflow: 'scroll',
    },

    title: {
      fontFamily: poppinsFont,
      fontSize: 14,
      fontWeight: 'bold',
    },
    summary: {
      flexGrow: 0,
      fontSize: 12,

      paddingBottom: 0,
    },

    tags: {
      alignSelf: 'flex-end',
      fontFamily: playfairDisplayFont,
      fontStyle: 'italic',
      fontSize: '12px',
      paddingBottom: '8px',
    },
    bottom: {
      marginTop: 0,
      display: 'flex',
      fontFamily: playfairDisplayFont,
      fontStyle: 'italic',
      fontSize: '12px',
      padding: theme.spacing(1, 2),
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

  return (
    <Card className={classes.root}>
      <AssessmentImage resources={assessment.resources} name={assessment.title}>
        <Typography variant="subtitle2" className={classes.tags}>
          {assessment.tags.join(', ')}
        </Typography>
      </AssessmentImage>
      <CardContent className={classes.content}>
        <Typography gutterBottom className={classes.title}>
          {assessment.title}
        </Typography>

        <Typography className={classes.summary}>
          {assessment.summary}
        </Typography>
      </CardContent>
      <CardActions className={classes.bottom}>
        <div>{`${assessment.minutesToComplete} min.`} </div>
        <img src={validated} alt="validated" />
      </CardActions>
    </Card>
  )
}

export default AssessmentCard
