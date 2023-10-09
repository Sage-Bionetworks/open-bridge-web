import CardWithMenu, {StatusColor} from '@components/widgets/CardWithMenu'
import Utility from '@helpers/utility'
import {Box, styled} from '@mui/material'
import {Assessment, AssessmentEditPhase, DisplayStudyPhase} from '@typedefs/types'
import dayjs from 'dayjs'
import {FunctionComponent} from 'react'

const ParticipantsIconContainer = styled(Box, {label: 'ParticipantsIconContainer'})(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  '> svg': {
    width: '25px',
    height: '25px',
    marginRight: theme.spacing(0.5),
    stroke: '#AEB5BC',
    fill: '#AEB5BC',
    '> path': {
      stroke: '#AEB5BC',
      fill: '#AEB5BC',
    },
  },
}))

type SurveyCardProps = {
  survey: Assessment
  onSetAnchor: Function
  isRename?: boolean
  onRename?: Function
  shouldHighlight?: boolean

  isMenuOpen: boolean
}
export const getColorForSurveyPhase = (status?: AssessmentEditPhase): StatusColor => {
  switch (status) {
    case 'published':
      return '#47A4DD'
    case 'draft':
      return '#C22E49'
    case 'review':
      return '#63A650'
    default:
      return '#4f527d'
  }
}
export const getTitleForSurveyPhase = (status?: AssessmentEditPhase): string => {
  switch (status) {
    case 'published':
      return 'Published'
    case 'draft':
      return 'Draft'
    case 'review':
      return 'Preview'
    default:
      return 'Unknown'
  }
}

const SurveyCard: FunctionComponent<SurveyCardProps> = ({
  survey,
  onSetAnchor,
  isRename,
  onRename,
  shouldHighlight,
  isMenuOpen,
}) => {
  const date = new Date(survey.modifiedOn ? survey.modifiedOn! : survey.createdOn!)

  const leftBottomChild = (
    <Box>
      <strong>{survey.modifiedOn ? `Last Edited` : `Created:`}</strong>
      <br />
      {`${dayjs(date).format('MMM D, YYYY @ h:mma')}`}
    </Box>
  )

  const rightBottomChild = (
    <ParticipantsIconContainer>
      <strong>Created by&nbsp;</strong>
      {survey.ownerId}
    </ParticipantsIconContainer>
  )

  const shouldHaveSpaceAfterName = false
  return (
    <CardWithMenu
      identifierLabel='Survey ID'
      name={survey.title}
      identifier={survey.identifier}
      onSetAnchor={onSetAnchor}
      isMenuOpen={isMenuOpen}
      onRename={onRename}
      isRename={isRename}
      shouldHighlight={shouldHighlight}
      topStatus={Utility.capitalize(survey.phase ?? 'unknown')}
      statusColor={getColorForSurveyPhase(survey.phase as AssessmentEditPhase)}
      shouldHaveSpaceAfterName={shouldHaveSpaceAfterName}
      leftBottomChild={leftBottomChild}
      rightBottomChild={rightBottomChild}
    />
  )
}

export default SurveyCard
