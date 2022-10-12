import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import SomeIcon from '@mui/icons-material/FaceOutlined'
import {Box} from '@mui/material'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {MTBHeadingH1, MTBHeadingH2, MTBHeadingH3, MTBHeadingH4, MTBHeadingH5} from '../widgets/Headings'

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
    [theme.breakpoints.down('lg')]: {
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

const cards = [1, 2, 3, 4, 5]

const SessionsLayout: FunctionComponent<RouteComponentProps> = ({}) => {
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)

  const toggleDrawer = () => {
    setOpen(prev => !prev)
  }
  return (
    <Box paddingTop="16px" bgcolor="#997cbf29" display="flex" position="relative">
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
        }}>
        <div>
          <IconButton onClick={toggleDrawer} size="large">
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {['Study Protocol', 'Sessions Creator', 'Scheduler', 'Participant Groups'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <SomeIcon /> : <SomeIcon />}</ListItemIcon>
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
          })}>
          <MTBHeadingH1>H1_Playfair Display_italic_21 </MTBHeadingH1>
          <MTBHeadingH2>H2_Poppins_Semibold_18pt</MTBHeadingH2>
          <MTBHeadingH3>H3_Lato_Regular, 15pt, Top nav</MTBHeadingH3>
          <MTBHeadingH4>H4_Lato_Bold, 15pt Selected top nav</MTBHeadingH4>
          <MTBHeadingH5>H5_Poppins Regular, 14pt Left Nav Button</MTBHeadingH5>
          <Box
            display="grid"
            padding="8px"
            gridTemplateColumns="repeat(auto-fill,280px)"
            columnGap="16px"
            rowGap="16px">
            {cards.map(card => (
              <Box width="280px" height="511px" border="1px solid black" bgcolor="#d5e5ec">
                card
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SessionsLayout
