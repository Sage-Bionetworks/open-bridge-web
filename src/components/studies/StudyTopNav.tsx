import CollapsableMenu from '@components/surveys/widgets/MenuDropdown'
import Utility from '@helpers/utility'
import BuildTwoToneIcon from '@mui/icons-material/BuildTwoTone'
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone'
import PersonSearchTwoToneIcon from '@mui/icons-material/PersonSearchTwoTone'
import {Alert, Box} from '@mui/material'
import constants from '@typedefs/constants'
import {ExtendedError, Study, StudyPhase} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {useHistory} from 'react-router-dom'

type StudyTopNavProps = {
  study: Study
  error?: ExtendedError | null
  currentSection?: string
}

const allLinks: {path: string; name: string; status: StudyPhase[]; icon: React.ReactElement}[] = [
  {
    path: `${constants.restrictedPaths.STUDY_BUILDER}`,
    name: 'study builder',
    status: ['design', 'in_flight', 'recruitment', 'completed', 'withdrawn'],
    icon: <BuildTwoToneIcon />,
  },
  {
    path: constants.restrictedPaths.PARTICIPANT_MANAGER,
    name: 'participant manager',
    status: constants.constants.IS_TEST_MODE
      ? ['in_flight', 'legacy', 'recruitment', 'design', 'completed']
      : ['in_flight', 'completed', 'withdrawn', 'recruitment'],
    icon: <PersonSearchTwoToneIcon />,
  },
  {
    path: constants.restrictedPaths.ADHERENCE_DATA,
    name: 'adherence data',
    status: ['in_flight', 'legacy', 'recruitment'],
    icon: <EventAvailableTwoToneIcon />,
  },
]

const StudyTopNav: FunctionComponent<StudyTopNavProps> = ({study, error}: StudyTopNavProps) => {
  const links = allLinks
    .filter(link => Utility.isPathAllowed(study.identifier, link.path) && link.name)
    .map(link => ({
      ...link,
      enabled: link.status.includes(study.phase),
      path: link.path.replace(':id', study.identifier),
      display: link.icon + link.name,
      id: link.path,
    }))

  const history = useHistory()

  return (
    <Box>
      <CollapsableMenu
        items={links}
        selectedFn={section => history.location.pathname.includes(section.path)}
        displayMobileItem={(section, isSelected) => (
          <>
            {section.icon} &nbsp;{section.name}
          </>
        )}
        displayDesktopItem={(section, isSelected) => (
          <>
            {' '}
            {section.icon}
            {section.name}
          </>
        )}
        onClick={section => history.push(section.path)}
      />

      {error && (
        <Box mx="auto" textAlign="center">
          <Alert variant="outlined" color="error" style={{marginBottom: '10px'}}>
            {' '}
            {error.statusCode}
            You do not have the permission to access this feature. Please contact your study administrator
          </Alert>
        </Box>
      )}
    </Box>
  )
}

export default StudyTopNav
