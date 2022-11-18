import {getStyledToolbarLinkStyle} from '@components/widgets/StyledComponents'
import Utility from '@helpers/utility'
import BuildTwoToneIcon from '@mui/icons-material/BuildTwoTone'
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone'
import PersonSearchTwoToneIcon from '@mui/icons-material/PersonSearchTwoTone'
import {Alert, Box, Hidden, styled, Typography} from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import constants from '@typedefs/constants'
import {ExtendedError, Study, StudyPhase} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {NavLink} from 'react-router-dom'

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

const useStyles = makeStyles(theme => ({
  mobileToolBarLink: {
    fontFamily: latoFont,
    fontSize: '15px',
    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,
    height: '56px',
    boxSizing: 'border-box',
    paddingLeft: theme.spacing(3),
    '&:hover': {
      backgroundColor: '#fff',
    },
    display: 'flex',
    alignItems: 'center',
    borderLeft: '4px solid transparent',
  },
  mobileSelectedLink: {
    borderLeft: '4px solid #353535',
    fontWeight: 'bolder',
  },
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
  const classes = useStyles()

  const links = allLinks.filter(link => Utility.isPathAllowed(study.identifier, link.path))

  return (
    <Box>
      <Hidden lgDown>
        <Box id="hight">
          <StyledStudyToolbar>
            {links
              .filter(section => section.name)
              .map(section =>
                section.status.includes(study?.phase) ? (
                  <StyledToolbarLink
                    to={section.path.replace(':id', study.identifier)}
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
        <nav>
          {links
            .filter(section => section.name)
            .map(section =>
              section.status.includes(study?.phase) ? (
                <NavLink
                  to={section.path.replace(':id', study.identifier)}
                  key={section.path}
                  className={classes.mobileToolBarLink}
                  activeClassName={classes.mobileSelectedLink}>
                  {section.name}
                </NavLink>
              ) : (
                <span key={section.path} style={{opacity: 0.45}} className={classes.mobileToolBarLink}>
                  {section.name}
                </span>
              )
            )}
        </nav>
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
