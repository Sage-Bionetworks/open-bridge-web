import CardWithMenu, {StatusColor} from '@components/widgets/CardWithMenu'
import {Box, styled} from '@mui/material'
import {Assessment, DisplayStudyPhase} from '@typedefs/types'
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
export const getColorForStudyPhase = (status: DisplayStudyPhase): StatusColor => {
  switch (status) {
    case 'COMPLETED':
      return '#47A4DD'
    case 'DRAFT':
      return '#C22E49'
    case 'LIVE':
      return '#63A650'
    default:
      return '#4f527d'
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
      <strong>Created by</strong>
      {survey.ownerId}
    </ParticipantsIconContainer>
  )

  const displayStatus = 'Unknown'
  const shouldHaveSpaceAfterName = false
  const statusColor = getColorForStudyPhase('WITHDRAWN')
  return (
    <CardWithMenu
      name={survey.title}
      identifier={survey.identifier}
      onSetAnchor={onSetAnchor}
      isMenuOpen={isMenuOpen}
      onRename={onRename}
      isRename={isRename}
      shouldHighlight={shouldHighlight}
      topStatus={displayStatus}
      statusColor={statusColor}
      shouldHaveSpaceAfterName={shouldHaveSpaceAfterName}
      leftBottomChild={leftBottomChild}
      rightBottomChild={rightBottomChild}
    />
  )
}

export default SurveyCard
