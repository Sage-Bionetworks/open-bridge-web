import {Box, Drawer, IconButton} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import StudyService from '@services/study.service'
import {Study} from '@typedefs/types'
import clsx from 'clsx'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import {NavLink} from 'react-router-dom'
import CloseIcon from '../../assets/study-builder-icons/left_nav_close_icon.svg'
import OpenIcon from '../../assets/study-builder-icons/left_nav_open_icon.svg'
import {ThemeType} from '../../style/theme'
import SideBarListItem from '../widgets/SideBarListItem'
import {getStudyBuilderSections, StudySection} from './sections'

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
    boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
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
    padding: theme.spacing(0),
  },
  listItemCollapsed: {
    marginLeft: theme.spacing(-0.5),
  },
  disabledElement: {
    opacity: 0.3,
  },
  drawerButton: {
    borderRadius: 0,
    width: '48px',
    height: '100%',
    '&:hover': {
      backgroundColor: 'white',
    },
  },
}))

type StudyLeftNavOwnProps = {
  currentSection?: StudySection
  study: Study
  open: boolean
  onToggle: Function
  disabled: boolean
}

type StudyLeftNavProps = StudyLeftNavOwnProps

const StudyLeftNav: FunctionComponent<StudyLeftNavProps> = ({
  study,
  open,
  onToggle,
  currentSection = 'sessions-creator',
  disabled,
}) => {
  const classes = useStyles()

  const [currentHoveredElement, setCurrentHoveredElement] = React.useState(-1)

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
      }}>
      <Box textAlign="right" height="48px" bgcolor="#F2F2F2">
        <IconButton onClick={toggleDrawer} className={classes.drawerButton} size="large">
          <img style={{width: '12px', height: '22px'}} src={open ? CloseIcon : OpenIcon} alt="Close/Open Icon"></img>
        </IconButton>
      </Box>
      <ul className={classes.list} style={{pointerEvents: disabled ? 'none' : 'all'}}>
        {study &&
          getStudyBuilderSections(StudyService.isStudyInDesign(study)).map((sectionLink, index) => (
            <div
              onMouseOver={() => setCurrentHoveredElement(index)}
              onMouseOut={() => setCurrentHoveredElement(-1)}
              key={sectionLink.path}>
              <NavLink to={`/studies/builder/${study.identifier}/${sectionLink.path}`} style={{textDecoration: 'none'}}>
                <SideBarListItem
                  key={sectionLink.path}
                  isOpen={open}
                  onClick={_.noop}
                  isActive={sectionLink.path === currentSection}
                  styleProps={classes.listItems}
                  inStudyBuilder={true}>
                  <div
                    style={{display: 'flex', textDecoration: 'none'}}
                    className={clsx(
                      classes.navIconImageContainer,
                      sectionLink.path === currentSection && !open && classes.listItemCollapsed
                    )}>
                    <img
                      src={
                        sectionLink.path === currentSection || index === currentHoveredElement
                          ? sectionLink.hoverIcon
                          : sectionLink.navIcon
                      }
                      className={clsx(
                        classes.navIcon,
                        disabled && sectionLink.path !== 'session-creator' && classes.disabledElement
                      )}
                      alt={sectionLink.name}
                    />
                    <span
                      style={{textDecoration: 'none'}}
                      className={clsx(disabled && sectionLink.path !== 'session-creator' && classes.disabledElement)}>
                      {sectionLink.name}
                    </span>
                  </div>
                </SideBarListItem>
              </NavLink>
            </div>
          ))}
      </ul>
    </Drawer>
  )
}

export default StudyLeftNav
