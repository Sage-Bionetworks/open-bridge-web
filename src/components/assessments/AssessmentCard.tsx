import {Box} from '@mui/material'
import CardContent from '@mui/material/CardContent'
import {styled} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import {FunctionComponent} from 'react'
import {theme} from '../../style/theme'
import {Assessment} from '../../types/types'
import AssessmentImage from './AssessmentImage'

const CardContainer = styled(Box, {label: 'cardContainer'})(({theme}) => ({
  backgroundColor: '#FFFFFF',

  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.15)',
}))

const useStyles = makeStyles(theme =>
  createStyles({
    /* root: {
      width: theme.spacing(28),
      height: theme.spacing(47),
      textAlign: 'left',
      // border: '1px solid gray',
      padding: 0,

      display: 'flex',
      flexDirection: 'column',
    },*/
    dragging: {
      width: '250px !important',
      height: '250px !important',
    },

    /* content: {
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
    },*/

    /*  bottom: {
      marginTop: 0,
      display: 'flex',
      fontFamily: playfairDisplayFont,
      fontStyle: 'italic',
      fontSize: '12px',
      padding: theme.spacing(1, 2),
      alignItems: 'center',
      justifyContent: 'space-between',
    },*/
  })
)

type AssessmentCardOwnProps = {
  assessment: Assessment
  index: number
}

type AssessmentCardProps = AssessmentCardOwnProps

const AssessmentCard: FunctionComponent<AssessmentCardProps> = ({assessment, index}) => {
  const classes = useStyles()

  return (
    <CardContainer>
      <AssessmentImage resources={assessment.resources} variant="normal" name={assessment.title}>
        <Typography variant="subtitle1" sx={{alignSelf: 'flex-end', textAlign: 'left '}}>
          {assessment.tags.join(', ')}
        </Typography>
        <Typography gutterBottom variant="body2">
          {assessment.title}
        </Typography>
        <Typography variant="body1">{assessment.summary}</Typography>
      </AssessmentImage>
      <CardContent
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          height: '213px',

          /* Text and UI Colors/Gray 100

Table zebra striping
*/
          background: '#FBFBFC',
          padding: theme.spacing(3),
          '& div': {
            flexShrink: 0,
            textAlign: 'left',
            marginBottom: theme.spacing(3),
            // marginTop: theme.spacing(3),
          },
        }} /*classes={{root: classes.content}}*/
      >
        <Box sx={{paddingRight: theme.spacing(5), width: '52%'}}>
          <Typography variant="h4">Scoring</Typography>
          todo: assessment?.scoring
        </Box>
        <Box sx={{width: '47%'}}>
          <Typography variant="h4">Reliability</Typography>
          todo: assessment.reliability
        </Box>
        <Box sx={{width: '26%'}}>
          <Typography variant="h4">Duration</Typography>
          {`${assessment.minutesToComplete} minutes`}
        </Box>
        <Box sx={{width: '26%'}}>
          <Typography variant="h4">Age</Typography>
          to do: assessment.age
        </Box>
        <Box>
          <Typography variant="h4">Language</Typography>
          to do: assessment.language
        </Box>
      </CardContent>
    </CardContainer>
  )
}

export default AssessmentCard

/*       <Typography gutterBottom className={classes.title}>
          {assessment.title}
        </Typography>

        <Typography className={classes.summary}>{assessment.summary}</Typography>
      </AssessmentImage>
      <CardContent classes={{root: classes.content}}>scoring, reliability</CardContent>
      <CardActions className={classes.bottom}>
        <div> Duration{`${assessment.minutesToComplete} min.`} </div>
        Age, Language
        <img src={validated} alt="validated" />
      </CardActions>*/
