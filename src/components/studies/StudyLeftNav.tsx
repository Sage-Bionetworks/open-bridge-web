import { Box, Drawer, IconButton, makeStyles } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import CreateSessionRegularIcon from '../../assets/study-builder-icons/normal/create_sessions_normal_icon.svg'
import CustomizeAppRegularIcon from '../../assets/study-builder-icons/normal/customize_app_normal_icon.svg'
import LaunchStudyRegularIcon from '../../assets/study-builder-icons/normal/launch_study_normal_icon.svg'
import RecordersRegularIcon from '../../assets/study-builder-icons/normal/recorders_normal_icon.svg'
import PreviewStudyRegaularIcon from '../../assets/study-builder-icons/normal/preview_study_normal_icon.svg'
import ScheduleSessionsRegularIcon from '../../assets/study-builder-icons/normal/schedule_sessions_normal_icon.svg'
import EnrollmentTypeRegularIcon from '../../assets/study-builder-icons/normal/enrollment_type_normal_icon.svg'

import CreateSessionHoveredIcon from '../../assets/study-builder-icons/hovered/create_sessions_hover_icon.svg'
import CustomizeAppHoveredIcon from '../../assets/study-builder-icons/hovered/customize_app_hover_icon.svg'
import LaunchStudyHoveredIcon from '../../assets/study-builder-icons/hovered/launch_study_hover_icon.svg'
import RecordersHoveredIcon from '../../assets/study-builder-icons/hovered/recorders_hover_icon.svg'
import PreviewStudyHoveredIcon from '../../assets/study-builder-icons/hovered/preview_study_hover_icon.svg'
import ScheduleSessionsHoveredIcon from '../../assets/study-builder-icons/hovered/schedule_sessions_hover_icon.svg'
import EnrollmentTypeHoveredIcon from '../../assets/study-builder-icons/hovered/enrollment_type_hover_icon.svg'

import { ThemeType } from '../../style/theme'
import SideBarListItem from '../widgets/SideBarListItem'
import { SECTIONS as sectionLinks, StudySection } from './sections'

const drawerWidth = 212
const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    margin: 0,
    padding: 0,
    listStyle: 'none',

    '& li': {
      padding: theme.spacing(10, 0),
      fontSize: 18,
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(6),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(6),
    },
  },
  list: {
    margin: '0',
    padding: '0',
    position: 'relative',
    listStyle: 'none',
  },
  drawerPaper: {
    fontSize: '14px',
    position: 'static',
    border: 'none',
    backgroundColor: '#F2F2F2',
    height: 'auto',
    boxShadow:
      '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
  },
  navIcon: {
    marginRight: theme.spacing(2),
    width: '48px',
    height: '48px',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  navIconImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  listItems: {
    padding: '0px',
  },
}))

type StudyLeftNavOwnProps = {
  currentSection?: StudySection
  id?: string
  open: boolean
  onToggle: Function
  onNavigate: Function
}

type StudyLeftNavProps = StudyLeftNavOwnProps

const StudyLeftNav: FunctionComponent<StudyLeftNavProps> = ({
  id,
  open,
  onToggle,
  onNavigate,
  currentSection = 'sessions-creator',
}) => {
  const classes = useStyles()

  const [currentHoveredElement, setCurrentHoveredElement] = React.useState(-1)

  const normalNavIcons = [
    CustomizeAppRegularIcon,
    CreateSessionRegularIcon,
    ScheduleSessionsRegularIcon,
    EnrollmentTypeRegularIcon,
    RecordersRegularIcon,
    PreviewStudyRegaularIcon,
    LaunchStudyRegularIcon,
  ]
  const hoverNavIcons = [
    CustomizeAppHoveredIcon,
    CreateSessionHoveredIcon,
    ScheduleSessionsHoveredIcon,
    EnrollmentTypeHoveredIcon,
    RecordersHoveredIcon,
    PreviewStudyHoveredIcon,
    LaunchStudyHoveredIcon,
  ]

  function typeOfIcon(index: number, sectionPath: string) {
    if (index === currentHoveredElement || sectionPath === currentSection) {
      return hoverNavIcons
    } else {
      return normalNavIcons
    }
  }

  const toggleDrawer = () => {
    onToggle()
  }

  return (
    <Drawer
      variant="permanent"
      elevation={1}
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <Box textAlign="right" height="48px" bgcolor="#FAFAFA">
        <IconButton
          onClick={toggleDrawer}
          style={{ borderRadius: 0, width: '48px', height: '100%' }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <ul className={classes.list}>
        {sectionLinks.map((sectionLink, index) => (
          <div
            onMouseOver={() => setCurrentHoveredElement(index)}
            onMouseOut={() => setCurrentHoveredElement(-1)}
          >
            <SideBarListItem
              key={sectionLink.path}
              isOpen={open}
              isActive={sectionLink.path === currentSection}
              onClick={() => onNavigate(sectionLink.path)}
              styleProps={classes.listItems}
              inStudyBuilder={true}
            >
              <div className={classes.navIconImageContainer}>
                <img
                  src={typeOfIcon(index, sectionLink.path)[index]}
                  className={classes.navIcon}
                  alt={sectionLink.name}
                />
                <span>{sectionLink.name}</span>
              </div>
            </SideBarListItem>
          </div>
        ))}
      </ul>
    </Drawer>
  )
}

export default StudyLeftNav
