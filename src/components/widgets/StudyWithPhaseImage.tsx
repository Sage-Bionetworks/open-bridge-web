import Utility from '@helpers/utility'
import AssignmentTurnedInTwoToneIcon from '@mui/icons-material/AssignmentTurnedInTwoTone'
import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone'
import SensorsTwoToneIcon from '@mui/icons-material/SensorsTwoTone'
import UndoTwoToneIcon from '@mui/icons-material/UndoTwoTone'
import {Box, styled, Typography} from '@mui/material'
import StudyService from '@services/study.service'
import {shouldForwardProp, theme} from '@style/theme'
import {DisplayStudyPhase, Study} from '@typedefs/types'
import {FunctionComponent} from 'react'

const PhaseIcon = {
  WITHDRAWN: {icon: <UndoTwoToneIcon />, color: '135, 142, 149'},
  COMPLETED: {icon: <AssignmentTurnedInTwoToneIcon />, color: '99, 166, 80'},
  LIVE: {icon: <SensorsTwoToneIcon />, color: '71, 164, 221'},
  DRAFT: {icon: <DesignServicesTwoToneIcon />, color: '194, 46, 73'},
}

const StyledPill = styled(Box, {label: 'StyledPill', shouldForwardProp: shouldForwardProp})<{
  $displayPhase: DisplayStudyPhase
}>(({theme, $displayPhase}) => ({
  display: 'flex',
  whiteSpace: 'nowrap',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: `rgba(${PhaseIcon[$displayPhase].color}, 0.1)`,
  border: `1px solid rgba(${PhaseIcon[$displayPhase].color}, 1)`,
  borderRadius: '25px',
  textTransform: 'uppercase',
  color: `rgba(${PhaseIcon[$displayPhase].color}, 1)`,

  padding: '0 6px',
  fontSize: '12px',

  width: 'fit-content',
  margin: 0,
  '& svg': {
    fontSize: '12px',
  },
}))

const NonDraftHeaderFunctionComponent: FunctionComponent<{
  study: Study | undefined
  excludedPhase?: DisplayStudyPhase
}> = ({study, excludedPhase}) => {
  if (!study) {
    return <></>
  }
  const displayPhase = StudyService.getDisplayStatusForStudyPhase(study.phase)
  if (displayPhase === excludedPhase) {
    return <></>
  }

  return (
    <Box sx={{textAlign: 'left'}}>
      <Box sx={{textAlign: 'left', display: 'flex', marginBottom: theme.spacing(1)}}>
        {Utility.formatStudyId(study.identifier)}
        &nbsp;&nbsp;
        <StyledPill $displayPhase={displayPhase}>
          {' '}
          {PhaseIcon[displayPhase].icon}&nbsp;{StudyService.getDisplayStatusForStudyPhase(study.phase)}
        </StyledPill>
      </Box>
      <Typography variant="h4">{study.name}!</Typography>
    </Box>
  )
}

export default NonDraftHeaderFunctionComponent
