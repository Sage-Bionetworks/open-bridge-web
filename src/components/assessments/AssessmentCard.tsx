import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import {colors} from '@style/staticPagesTheme'
import React, {FunctionComponent} from 'react'
import validated from '../../assets/validated.svg'
import {playfairDisplayFont, poppinsFont} from '../../style/theme'
import {Assessment} from '../../types/types'
import AssessmentImage from './AssessmentImage'

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      width: theme.spacing(28),
      height: theme.spacing(47),
      textAlign: 'left',
      // border: '1px solid gray',
      padding: 0,

      display: 'flex',
      flexDirection: 'column',
    },
    newRoot: {
      width: theme.spacing(28),
      height: theme.spacing(47),
      borderTop: `5px solid ${colors.accent}`,
      textAlign: 'left',
      // border: '1px solid gray',
      padding: 0,

      display: 'flex',
      flexDirection: 'column',
    },
    dragging: {
      width: '250px !important',
      height: '250px !important',
    },

    content: {
      height: theme.spacing(19),
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        width: '6px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#C4C4C4',
      },
      zIndex: 100,
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
  })
)

type AssessmentCardOwnProps = {
  assessment: Assessment
  index: number
  isNewDesign?: boolean
}

type AssessmentCardProps = AssessmentCardOwnProps

const AssessmentCard: FunctionComponent<AssessmentCardProps> = ({
  assessment,
  isNewDesign,
  index,
}) => {
  const classes = useStyles()

  return (
    <Card className={isNewDesign ? classes.newRoot : classes.root}>
      <AssessmentImage
        resources={assessment.resources}
        variant="normal"
        name={assessment.title}>
        <Typography variant="subtitle2" className={classes.tags}>
          {assessment.tags.join(', ')}
        </Typography>
      </AssessmentImage>
      <CardContent classes={{root: classes.content}}>
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
