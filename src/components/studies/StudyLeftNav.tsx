import { Box, Drawer, IconButton, makeStyles } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SomeIcon from '@material-ui/icons/SentimentVerySatisfied'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
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
    boxShadow:
      '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
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
      <Box textAlign='right' height="48px" bgcolor='#FAFAFA'>
        <IconButton
          onClick={toggleDrawer}
          style={{ borderRadius: 0, width: '48px', height: '100%' }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <ul className={classes.list}>
        {sectionLinks.map((sectionLink, index) => (
          <SideBarListItem
            key={sectionLink.path}
            isOpen={open}
            isActive={sectionLink.path === currentSection}
            onClick={() => onNavigate(sectionLink.path)}
          >
            <div style={{ display: 'flex' }}>
              <SomeIcon style={{ marginRight: "16px" }} />
              <span>{sectionLink.name}</span>
            </div>
          </SideBarListItem>
        ))}
      </ul>
    </Drawer>
  )
}

export default StudyLeftNav
