import {ReactComponent as ParticipantsIcon} from '@assets/participants_icon.svg'
import CardWithMenu, {StatusColor} from '@components/widgets/CardWithMenu'
import {Box, styled} from '@mui/material'
import StudyService from '@services/study.service'
import {DisplayStudyPhase, Study} from '@typedefs/types'
import dayjs from 'dayjs'
import {capitalize} from 'lodash'
import {FunctionComponent} from 'react'
import {useAdherenceForWeek} from './adherenceHooks'

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

type StudyCardProps = {
  study: Study
  onSetAnchor: Function
  isRename?: boolean
  onRename?: Function
  isNewlyAddedStudy?: boolean

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

const StudyCard: FunctionComponent<StudyCardProps> = ({
  study,
  onSetAnchor,
  isRename,
  onRename,
  isNewlyAddedStudy,

  isMenuOpen,
}) => {
  const date = new Date(study.phase === 'design' ? study.modifiedOn! : study.createdOn!)
  const {data: adherenceWeeklyInProcessCount} = useAdherenceForWeek(study.identifier, 0, 5, {
    progressionFilters: ['in_progress'],
  })

  const leftBottomChild = (
    <Box>
      <strong>{study.phase === 'design' ? `Last Edited` : `Launched:`}</strong>
      <br />
      {`${dayjs(date).format('MMM D, YYYY @ h:mma')}`}
    </Box>
  )

  const rightBottomChild =
    study.phase !== 'design' ? (
      <ParticipantsIconContainer>
        <ParticipantsIcon title="Number of Participants" />
        {adherenceWeeklyInProcessCount?.total.toString() || '--'}
      </ParticipantsIconContainer>
    ) : (
      <></>
    )

  const displayStatus = StudyService.getDisplayStatusForStudyPhase(study.phase)

  const shouldHaveSpaceAfterName = study.phase === 'design' ? true : false
  const statusColor = getColorForStudyPhase(displayStatus)
  return (
    <CardWithMenu
      name={study.name}
      identifier={study.identifier}
      onSetAnchor={onSetAnchor}
      isMenuOpen={isMenuOpen}
      onRename={onRename}
      isRename={isRename}
      shouldHighlight={isNewlyAddedStudy}
      topStatus={capitalize(displayStatus)}
      statusColor={statusColor}
      shouldHaveSpaceAfterName={shouldHaveSpaceAfterName}
      leftBottomChild={leftBottomChild}
      rightBottomChild={rightBottomChild}
    />
  )
}

export default StudyCard
