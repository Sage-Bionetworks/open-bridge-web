import { Box, makeStyles } from '@material-ui/core'
import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'

import clsx from 'clsx'
import { createStyles, useTheme, Theme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'

import List from '@material-ui/core/List'

import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import SomeIcon from '@material-ui/icons/FaceOutlined'

const drawerWidth = 212

const useStyles = makeStyles(theme => ({
  mainArea: {
    margin: '0 auto',
    minHeight: '100px',
    backgroundColor: '#cacacd',
  },
  mainAreaNormal: {
    width: `${280 * 3 + 16 * 3}px`,
  },
  mainAreaWide: {
    width: `${280 * 4 + 16 * 4}px`,
    [theme.breakpoints.down('md')]: {
      width: `${280 * 3 + 16 * 3}px`,
    },
  },

  drawerPaper: {
    position: 'static',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  hide: {
    display: 'none',
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
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    /* ...theme.mixins.toolbar,*/
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))

type SessionsLayoutOwnProps = {
  title?: string
  paragraph?: string
}

type SessionsLayoutProps = SessionsLayoutOwnProps & RouteComponentProps
const cards = [1, 2, 3, 4, 5]

const SessionsLayout: FunctionComponent<SessionsLayoutProps> = ({
  title = 'something',
  paragraph,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  const toggleDrawer = () => {
    setOpen(prev => !prev)
  }
  return (
    <Box
      paddingTop="16px"
      bgcolor="#997cbf29"
      display="flex"
      position="relative"
    >
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
          {[
            'Study Protocol',
            'Sessions Creator',
            'Scheduler',
            'Participant Groups',
          ].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <SomeIcon /> : <SomeIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Box height="500px" bgcolor="#cec8c8" flexGrow="0" flexShrink="0">
          lef nav
        </Box>
      </Drawer>

      <Box textAlign="center" flexGrow="1" bgcolor="#dde0de">
        <Box
          className={clsx(classes.mainArea, {
            [classes.mainAreaNormal]: open,
            [classes.mainAreaWide]: !open,
          })}
          display="grid"
          padding="8px"
          gridTemplateColumns="repeat(auto-fill,280px)"
          gridColumnGap="16px"
          gridRowGap="16px"
        >
          {cards.map(card => (
            <Box
              width="280px"
              height="511px"
              border="1px solid black"
              bgcolor="#d5e5ec"
            >
              card
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default SessionsLayout
