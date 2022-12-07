import MenuDropdown from '@components/surveys/widgets/MenuDropdown'
import {getStyledToolbarLinkStyle} from '@components/widgets/StyledComponents'
import Utility from '@helpers/utility'
import BuildTwoToneIcon from '@mui/icons-material/BuildTwoTone'
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone'
import PersonSearchTwoToneIcon from '@mui/icons-material/PersonSearchTwoTone'
import {Alert, Box, Hidden, styled, Typography} from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import {theme} from '@style/theme'
import constants from '@typedefs/constants'
import {ExtendedError, Study, StudyPhase} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {NavLink, useHistory} from 'react-router-dom'

const StyledStudyToolbar = styled(Toolbar, {label: 'StyledStudyToolbar'})(({theme}) => ({
  alignItems: 'center',
  minHeight: 'unset !important',
  display: 'flex',
  maxWidth: 'fit-content',
  margin: '0 auto',
  padding: 0,
  justifyContent: 'space-between',
  marginTop: theme.spacing(2),

  '&:last-child': {
    paddingRight: 0,
  },
  '&:first-child': {
    paddingLeft: 0,
  },
}))

const StyledToolbarLink = styled(NavLink, {label: 'StyledToolbarLink'})(({theme}) => ({
  ...getStyledToolbarLinkStyle(theme),
  textTransform: 'capitalize',
}))
const StyledToolbarLinkDisabled = styled(Typography, {label: 'StyledToolbarLinkDisabled'})(({theme}) => ({
  ...getStyledToolbarLinkStyle(theme),
  opacity: 0.45,
  textTransform: 'capitalize',
}))

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
    }))

  const history = useHistory()

  return (
    <Box>
      <Hidden lgDown>
        <Box id="hight">
          <StyledStudyToolbar>
            {links.map(section =>
              section.enabled ? (
                <StyledToolbarLink
                  to={section.path}
                  key={section.path}
                  activeStyle={{
                    boxShadow: 'inset 0px -4px 0px 0px #9499C7',
                  }}>
                  {section.icon}
                  {section.name}
                </StyledToolbarLink>
              ) : (
                <StyledToolbarLinkDisabled key={section.path}>
                  {section.icon}
                  {section.name}
                </StyledToolbarLinkDisabled>
              )
            )}
          </StyledStudyToolbar>
        </Box>
      </Hidden>
      <Hidden lgUp>
        <MenuDropdown
          items={links}
          selectedFn={section => section.path === history.location.pathname}
          displayItem={(section, isSelected) => (
            <Box
              sx={{
                textTransform: 'capitalize',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                width: '100%',
                fontSize: isSelected ? '16px' : '18px',
                fontWeight: isSelected ? 900 : 700,
                color: isSelected ? theme.palette.grey.A100 : theme.palette.grey[700],
                height: theme.spacing(6),
              }}>
              {section.icon} &nbsp;{section.name}
            </Box>
          )}
          onClick={section => history.push(section.path)}
        />
      </Hidden>

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
