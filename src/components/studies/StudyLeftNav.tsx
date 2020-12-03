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
  Typography,
} from '@material-ui/core'
import { poppinsFont, ThemeType } from '../../style/theme'
import { SECTIONS as sectionLinks, StudySection } from './sections'
import clsx from 'clsx'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import SomeIcon from '@material-ui/icons/SentimentVerySatisfied';

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

  listItem: {
    color: theme.palette.action.active,
    paddingLeft: theme.spacing(8),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),

    '&$listItemActive': {
      borderLeft: '4px solid #BCD5E4',
      backgroundColor: '#FAFAFA',
      paddingLeft: theme.spacing(7.5),
    },
    '&$listItemCollapsed': {
      paddingLeft:  theme.spacing(1)
    },
    '&$listItemActive&$listItemCollapsed': {
      paddingLeft:  theme.spacing(.5)
    }
  },
  listItemActive: {},
  listItemCollapsed: {},

  link: {
    fontFamily: poppinsFont,
    color: '#282828',
    /*  color: theme.palette.action.active,
    paddingLeft: theme.spacing(8),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),*/
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
      <div
        style={{
          textAlign: 'right',
          height: '48px',
          backgroundColor: '#FAFAFA',
        }}
      >
        <IconButton
          onClick={toggleDrawer}
          style={{ borderRadius: 0, width: '48px', height: '100%' }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>

      <List>
        {sectionLinks.map((sectionLink, index) => (
          <ListItem
            component="a"
            key={sectionLink.path}
            href={sectionLink.path}
            className={clsx(classes.listItem, {
              [classes.listItemActive]: sectionLink.path === currentSection,
              [classes.listItemCollapsed]: !open
            })}
          >
            <ListItemIcon style={{ display: open ? 'none' : 'block' }}>
              <SomeIcon />
            </ListItemIcon>

            <ListItemText
              disableTypography
              primary={
                <Typography component="span" className={classes.link}>
                  {' '}
                  {sectionLink.name}
                </Typography>
              }
              style={{ display: open ? 'block' : 'none' }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default StudyLeftNav
