import React, { FunctionComponent, useEffect } from 'react'
import Link from '@material-ui/core/Link'
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
} from '@material-ui/core'
import { ThemeType } from '../../style/theme'
import { SECTIONS as sectionLinks, StudySection } from './sections'
import clsx from 'clsx'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SomeIcon from '@material-ui/icons/FaceOutlined'

const drawerWidth = 212
const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    margin: 0,
    padding: 0,
    listStyle: 'none',

    '& li': {
      padding: '10px 0',
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
    })
  },
  drawerClose: {
   transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },

  llink: {
    color: theme.palette.action.active,
    padding: theme.spacing(1),
  },
  drawerPaper: {
    position: 'static',
  },
}))

type StudyLeftNavOwnProps = {
  currentSection?: StudySection
  id?: string
  open: boolean
  onToggle: Function
}

type StudyLeftNavProps = StudyLeftNavOwnProps

const StudyLeftNav: FunctionComponent<StudyLeftNavProps> = ({
  id,
  open,
  onToggle,
  currentSection = 'sessions-creator',
}) => {
  const classes = useStyles()
  //const [open, setOpen] = React.useState(false)

  const toggleDrawer = () => {
    //setOpen(prev => !prev)
    onToggle()
  }

  return (
    <Drawer
      variant="permanent"
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
      <div>
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
        {sectionLinks.map((sectionLink, index) => (
          <ListItem
            component="a"
            key={sectionLink.path}
            href={sectionLink.path}
          >
            <ListItemIcon>
              <SomeIcon />
            </ListItemIcon>

            <ListItemText primary={sectionLink.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default StudyLeftNav
