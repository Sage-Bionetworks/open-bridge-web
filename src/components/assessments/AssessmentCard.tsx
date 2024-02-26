import {Card, CardActions} from '@mui/material'
import CardContent from '@mui/material/CardContent'
import {styled} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import {FunctionComponent} from 'react'
import {latoFont, theme} from '../../style/theme'
import {Assessment} from '../../types/types'
import AssessmentImage from './AssessmentImage'

const StyledCard = styled(Card)(({theme}) => ({
  width: theme.spacing(28),
  height: theme.spacing(47),
  borderTop: `5px solid #8FD6FF`,
  textAlign: 'left',
  borderRadius: 0,
  padding: 0,

  display: 'flex',
  flexDirection: 'column',
  color: '#353A3F',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
}))

const StyledCardContent = styled(CardContent)(({theme}) => ({
  height: theme.spacing(46),
  overflowY: 'scroll',
  paddingBottom: 0,
  // TODO: syoung 10/27/2023 This is here to enforce showing a scrollbar in Safari b/c by default, Apple hides it.
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#C4C4C4',
  },
  zIndex: 100,
}))

type AssessmentCardOwnProps = {
  assessment: Assessment
  index: number
}

type AssessmentCardProps = AssessmentCardOwnProps

const AssessmentCard: FunctionComponent<AssessmentCardProps> = ({
  assessment,

  index,
}) => {
  return (
    <StyledCard>
      <AssessmentImage
        assessment={assessment}
        variant='card'
        name={assessment.title}
      />

      <StyledCardContent>
        <Typography
          sx={{
            textTransform: 'uppercase',

            fontSize: '14px',
            paddingBottom: '24px',
          }}>
          {assessment.tags.join(', ')}
        </Typography>
        <Typography
          gutterBottom
          sx={{
            fontFamily: latoFont,
            fontSize: 14,
            fontWeight: 'bold',
          }}>
          {assessment.title}
        </Typography>

        <Typography
          sx={{
            flexGrow: 0,
            fontSize: '14px',
            lineHeight: '18px',

            paddingBottom: 0,
          }}>
          {assessment.summary}
        </Typography>
      </StyledCardContent>
      <CardActions
        sx={{
          marginTop: 0,
          display: 'flex',

          fontSize: '14px',
          padding: theme.spacing(1, 2),
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <div>{`${assessment.minutesToComplete} min`} </div>
      </CardActions>
    </StyledCard>
  )
}

export default AssessmentCard

