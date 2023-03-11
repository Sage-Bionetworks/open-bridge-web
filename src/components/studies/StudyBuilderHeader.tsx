import StudyWithPhaseImage from '@components/widgets/StudyWithPhaseImage'
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone'
import {Box, Button, Dialog, SxProps} from '@mui/material'
import {DisplayStudyPhase, Study} from '@typedefs/types'

import AccessSettings from '@components/access-settings/AccessSettings'
import DialogTitleWithClose from '@components/widgets/DialogTitleWithClose'
import Utility from '@helpers/utility'
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone'
import {styled} from '@mui/material'
import StudyService from '@services/study.service'
import {theme} from '@style/theme'
import React from 'react'
import {useHistory} from 'react-router-dom'

const BG_COLOR: Record<DisplayStudyPhase, string> = {
  DRAFT: 'rgba(194, 46, 73, .1)',
  LIVE: 'rgba(71, 164, 221, .1)',
  COMPLETED: 'rgba(99, 166, 80, .1)',
  WITHDRAWN: 'rgba(135, 142, 149, .1)',
}

const StyledStudyHeader = styled(Box, {label: 'StyledStudyHeader'})(({theme}) => ({
  display: 'flex',

  padding: theme.spacing(3, 8, 2, 8),
  justifyContent: 'space-between',
  alignItems: 'center',
  //marginBottom: theme.spacing(4),
}))

const StudyBuilderHeader: React.FunctionComponent<{study: Study; isReadOnly?: boolean; sx?: SxProps}> = ({
  study,
  isReadOnly,
  sx = {},
}) => {
  const history = useHistory()
  const [isOpenAS, setIsOpenAS] = React.useState(false)

  return (
    <>
      <StyledStudyHeader
        sx={{
          ...sx,
          backgroundColor: BG_COLOR[StudyService.getDisplayStatusForStudyPhase(study.phase)],
        }}>
        <StudyWithPhaseImage study={study} />

        {(Utility.isInAdminRole() || true) /* enable all aggess*/ && (
          <Button variant="text" onClick={() => setIsOpenAS(true)} startIcon={<SettingsTwoToneIcon />}>
            Access settings
          </Button>
        )}
      </StyledStudyHeader>
      {isReadOnly && (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 168, 37, 0.15)',
            textAlign: 'left',
            fontSize: '16px',

            display: 'flex',
            padding: theme.spacing(1, 8),
          }}>
          <ErrorTwoToneIcon sx={{color: '#FFA825'}}></ErrorTwoToneIcon>&nbsp;&nbsp;This study is in read-only mode and
          can not be edited.
        </Box>
      )}
      <Dialog open={isOpenAS} fullWidth={true} maxWidth="lg" scroll="body">
        <DialogTitleWithClose onCancel={() => setIsOpenAS(false)} title={'    Access Settings'} />
        <AccessSettings study={study} />
      </Dialog>
    </>
  )
}

export default StudyBuilderHeader
