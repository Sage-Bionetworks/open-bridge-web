import CloseIcon from '@assets/study-builder-icons/left_nav_close_icon.svg'
import OpenIcon from '@assets/study-builder-icons/left_nav_open_icon.svg'
import SideBarListItem from '@components/widgets/SideBarListItem'
import {Box, Drawer, IconButton, List, styled} from '@mui/material'
import StudyService from '@services/study.service'
import {latoFont, shouldForwardProp} from '@style/theme'
import {Study} from '@typedefs/types'
import _ from 'lodash'
import {FunctionComponent} from 'react'
import {NavLink} from 'react-router-dom'
import {getStudyBuilderSections, StudySection} from './sections'

const drawerWidth = 212

const DrawerStyled = styled(Drawer, {label: 'DrawerStyled', shouldForwardProp: prop => prop !== 'isOpen'})<{
  isOpen?: boolean
}>(({theme, isOpen}) => ({
  width: isOpen ? drawerWidth : '58px',

  flexShrink: 0,
  whiteSpace: 'nowrap',
  backgroundColor: 'white',

  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: isOpen ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
  }),
  overflowX: isOpen ? 'auto' : 'hidden',
  overflowY: 'hidden',

  '& .MuiDrawer-paper': {
    fontSize: '14px',
    position: 'static',
    border: 'none',

    height: '100%',
    boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  },
}))

const StyledNavIconContainer = styled(Box, {label: 'StyledNavIconContainer', shouldForwardProp: shouldForwardProp})<{
  $isDisabled: boolean
}>(({theme, $isDisabled}) => ({
  display: 'flex',
  justifyContent: 'center',
  textDecoration: 'none',
  alignItems: 'center',
  flexDirection: 'row',
  pointerEvents: $isDisabled ? 'none' : 'all',
  '&:hover': {
    '& svg': {
      // fill: '#fff',
    },
    '> span': {
      // color: '#fff',
    },
  },
  '> div': {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
    width: '58px',
    height: '48px',
    alignSelf: 'center',
    justifyContent: 'center',
    opacity: $isDisabled ? 0.3 : 1,
  },

  '& span': {
    textDecoration: 'none',
    opacity: $isDisabled ? 0.3 : 1,
    fontWeight: 900,
    fontSize: '14px',
    lineHeight: '16px',

    fontFamily: latoFont,
  },
}))

type StudyLeftNavOwnProps = {
  currentSection?: StudySection
  study: Study
  open: boolean
  onToggle: Function
  disabled: boolean
  hasSchedule: boolean
}

type StudyLeftNavProps = StudyLeftNavOwnProps

const StudyLeftNav: FunctionComponent<StudyLeftNavProps> = ({
  study,
  open,
  onToggle,
  currentSection = 'study-details',
  disabled,
  hasSchedule,
}) => {
  const toggleDrawer = () => {
    onToggle()
  }

  const isLinkDisabled = (section: StudySection) => {
    return (
      (!['session-creator', 'study-details'].includes(section) && disabled) ||
      (section !== 'study-details' && !hasSchedule)
    )
  }

  return (
    <DrawerStyled isOpen={open} variant="permanent" elevation={1}>
      <Box sx={{textAlign: 'right', height: '48px'}}>
        <IconButton
          onClick={toggleDrawer}
          sx={{
            borderRadius: 0,
            width: '58px',
            height: '100%',
            backgroundColor: '#F2F2F2',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
          size="large">
          <img style={{width: '12px', height: '22px'}} src={open ? CloseIcon : OpenIcon} alt="Close/Open Icon"></img>
        </IconButton>
      </Box>
      <List
        sx={{
          margin: '0',
          padding: '0',
          position: 'relative',
          listStyle: 'none',
          //  pointerEvents: disabled ? 'none' : 'all',
        }}>
        {study &&
          getStudyBuilderSections(StudyService.isStudyInDesign(study)).map((sectionLink, index) => (
            <div key={sectionLink.path}>
              <NavLink
                to={`/studies/builder/${study.identifier}/${sectionLink.path}`}
                style={{textDecoration: 'none', pointerEvents: isLinkDisabled(sectionLink.path) ? 'none' : 'all'}}>
                <SideBarListItem
                  key={sectionLink.path}
                  isOpen={open}
                  onClick={_.noop}
                  isActive={sectionLink.path === currentSection}
                  inStudyBuilder={true}>
                  <StyledNavIconContainer $isDisabled={isLinkDisabled(sectionLink.path)}>
                    <Box>{sectionLink.navIcon}</Box>

                    <span>{sectionLink.name}</span>
                  </StyledNavIconContainer>
                </SideBarListItem>
              </NavLink>
            </div>
          ))}
      </List>
    </DrawerStyled>
  )
}

export default StudyLeftNav
