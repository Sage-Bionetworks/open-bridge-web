import StudyWithPhaseImage from '@components/widgets/StudyWithPhaseImage'
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone'
import {Box} from '@mui/material'
import constants from '@typedefs/constants'
import {DisplayStudyPhase, Study} from '@typedefs/types'

import {getStyledToolbarLinkStyle} from '@components/widgets/StyledComponents'
import Utility from '@helpers/utility'
import {styled} from '@mui/material'
import StudyService from '@services/study.service'
import {theme} from '@style/theme'
import {NavLink} from 'react-router-dom'

const BG_COLOR: Record<DisplayStudyPhase, string> = {
  DRAFT: 'rgba(194, 46, 73, .1)',
  LIVE: 'rgba(71, 164, 221, .1)',
  COMPLETED: 'rgba(99, 166, 80, .1)',
  WITHDRAWN: 'rgba(135, 142, 149, .1)',
}

const StyledAccessLink = styled(NavLink, {label: 'StyledAccessLink'})(({theme}) => ({
  ...getStyledToolbarLinkStyle(theme),
  fontSize: '14px',
  color: theme.palette.primary.main,
  margin: 0,
  justifyContent: 'flex-end',
  textTransform: 'capitalize',
}))

const StudyBuilderHeader: React.FunctionComponent<{study: Study}> = ({study}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        marginLeft: '-3px',
        padding: theme.spacing(3, 7, 2, 7),
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: BG_COLOR[StudyService.getDisplayStatusForStudyPhase(study.phase)],
      }}>
      <StudyWithPhaseImage study={study} />

      {(Utility.isInAdminRole() || true) /* enable all aggess*/ && (
        <StyledAccessLink
          to={constants.restrictedPaths.ACCESS_SETTINGS.replace(':id', study.identifier)}
          key={'path-to-access-settings'}>
          <SettingsTwoToneIcon />
          &nbsp; Access settings
        </StyledAccessLink>
      )}
    </Box>
  )
}

export default StudyBuilderHeader
