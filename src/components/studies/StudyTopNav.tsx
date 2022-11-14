import ParticipantsIcon from '@assets/group_participants_icon.svg'
import Logo from '@assets/logo_mtb.svg'
import BreadCrumb from '@components/widgets/BreadCrumb'
import HideWhen from '@components/widgets/HideWhen'
import MobileDrawerMenuHeader from '@components/widgets/MobileDrawerMenuHeader'
import Utility from '@helpers/utility'
import BuildTwoToneIcon from '@mui/icons-material/BuildTwoTone'
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone'
import MenuIcon from '@mui/icons-material/Menu'
import PeopleIcon from '@mui/icons-material/People'
import PersonSearchTwoToneIcon from '@mui/icons-material/PersonSearchTwoTone'
import {Alert, Box, Drawer, Hidden, IconButton, LinearProgress} from '@mui/material'
import Toolbar from '@mui/material/Toolbar'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import constants from '@typedefs/constants'
import {ExtendedError, Study, StudyPhase} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {NavLink} from 'react-router-dom'

//import BuildTwoToneIcon from '@mui/icons-material/BuildTwoTone'; builder
//import PersonSearchTwoToneIcon from '@mui/icons-material/PersonSearchTwoTone'; pmanager
//import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone'; adherence
//import PollTwoToneIcon from '@mui/icons-material/PollTwoTone'; rdata

const useStyles = makeStyles(theme => ({
  rootStudyTopNav: {
    backgroundColor: '#F7F7F7',
    padding: theme.spacing(0),
    borderBottom: `1px solid #DFDFDF`,
  },
  logo: {
    '&:hover': {
      opacity: 0.7,
    },
  },
  toolbarStudyHeader: {
    padding: theme.spacing(2.5, 5, 0, 5),
    height: theme.spacing(9),
    display: 'flex',
    backgroundColor: '#F7F7F7', //'#F8F8F8',

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  toolbar: {
    alignItems: 'center',
    minHeight: 'auto',
    display: 'flex',
    justifyContent: 'space-between',

    '&:last-child': {
      paddingRight: 0,
    },
  },

  selectedLink: {
    borderBottom: '4px solid #9499C7',
    paddingBottom: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    float: 'right',
    '&::after': {
      content: '',
      display: 'table',
      clear: 'both',
    },
  },
  drawer: {
    width: '320px',
    flexShrink: 0,
  },
  drawerPaper: {
    width: '320px',

    '& $toolbarLink': {
      flextGroup: 0,
      padding: theme.spacing(1, 2),
      fontStyle: 'normal',
      textTransform: 'uppercase',
    },

    '& $toolbarLink:first-child': {
      paddingLeft: '8px',
    },

    '& $selectedLink': {
      border: 'none',
      fontWeight: 'bolder',
    },
    backgroundColor: '#F8F8F8',
  },
  toolbarLink: {
    padding: theme.spacing(2, 1, 1.5, 1),
    margin: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center',
    fontFamily: latoFont,
    flexGrow: 1,

    fontSize: '16px',
    fontWeight: 900,
    textTransform: 'capitalize',
    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,
    '& svg': {
      marginRight: theme.spacing(1),
      fontSize: '20px',
    },

    '&:first-child': {
      // paddingLeft: theme.spacing(0.5),
    },
    '&:last-child': {
      paddingRight: theme.spacing(0.5),
      paddingLeft: theme.spacing(0.5),
    },
    '&$selectedLink': {
      paddingTop: '20px',
    },
  },
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
  blackXIcon: {
    width: '16px',
    height: '16px',
  },
  accessSettingsDrawerOption: {
    display: 'flex',
    marginTop: theme.spacing(4),
  },
}))

type StudyTopNavProps = {
  study: Study
  error?: ExtendedError | null
  currentSection?: string
}

const StudyTopNav: FunctionComponent<StudyTopNavProps> = ({study, error}: StudyTopNavProps) => {
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
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const classes = useStyles()

  const links = allLinks.filter(link => Utility.isPathAllowed(study.identifier, link.path))

  return (
    <Box className={classes.rootStudyTopNav}>
      <Hidden lgUp>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="end"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={classes.menuButton}
          size="large">
          <MenuIcon></MenuIcon>
        </IconButton>
      </Hidden>
      <Hidden lgDown>
        <Box className={classes.toolbarStudyHeader}>
          <Toolbar
            component="nav"
            variant="dense"
            disableGutters={true}
            className={classes.toolbar}
            style={{
              paddingTop: '0',
              alignItems: 'center',
            }}>
            <NavLink to="/studies" key="/studies" className={classes.toolbarLink} style={{padding: '0 24px 0 0'}}>
              <img src={Logo} className={classes.logo} key="img_home" alt="home" />
            </NavLink>
            <HideWhen hideWhen={study === undefined && !error}>
              <BreadCrumb
                links={[{url: '/studies', text: ''}]}
                currentItem={
                  study?.name && study?.name !== constants.constants.NEW_STUDY_NAME ? study?.name : ''
                }></BreadCrumb>

              <LinearProgress style={{width: '50px'}} />
            </HideWhen>
          </Toolbar>
          <Toolbar className={classes.toolbar}>
            {links
              .filter(section => section.name)
              .map(section =>
                section.status.includes(study?.phase) ? (
                  <NavLink
                    to={section.path.replace(':id', study.identifier)}
                    key={section.path}
                    className={classes.toolbarLink}
                    activeClassName={classes.selectedLink}>
                    {section.icon}
                    {section.name}
                  </NavLink>
                ) : (
                  <span key={section.path} style={{opacity: 0.45}} className={classes.toolbarLink}>
                    {section.icon}
                    {section.name}
                  </span>
                )
              )}
          </Toolbar>
          <Toolbar className={classes.toolbar} style={{width: '200px', overflow: 'hidden'}}>
            {(Utility.isInAdminRole() || true) /* enable all aggess*/ && (
              <NavLink
                to={constants.restrictedPaths.ACCESS_SETTINGS.replace(':id', study.identifier)}
                key={'path-to-access-settings'}
                className={classes.toolbarLink}
                activeClassName={classes.selectedLink}
                style={{display: 'flex'}}>
                <PeopleIcon></PeopleIcon>&nbsp;&nbsp;Access settings
              </NavLink>
            )}
          </Toolbar>
        </Box>
      </Hidden>
      <nav className={classes.drawer}>
        <Drawer
          variant="temporary"
          anchor="right"
          open={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}>
          <MobileDrawerMenuHeader setIsMobileOpen={setIsMobileOpen} type="IN_STUDY"></MobileDrawerMenuHeader>
          {links
            .filter(section => section.name)
            .map(section =>
              section.status.includes(study?.phase) ? (
                <NavLink
                  to={section.path.replace(':id', study.identifier)}
                  key={section.path}
                  className={classes.mobileToolBarLink}
                  activeClassName={classes.mobileSelectedLink}
                  onClick={() => setIsMobileOpen(false)}>
                  {section.name}
                </NavLink>
              ) : (
                <span key={section.path} style={{opacity: 0.45}} className={classes.mobileToolBarLink}>
                  {section.name}
                </span>
              )
            )}
          <NavLink
            to={constants.restrictedPaths.ACCESS_SETTINGS.replace(':id', study.identifier)}
            key={'path-to-access-settings'}
            className={clsx(classes.mobileToolBarLink, classes.accessSettingsDrawerOption)}
            activeClassName={classes.mobileSelectedLink}
            onClick={() => setIsMobileOpen(false)}>
            <img src={ParticipantsIcon} style={{marginRight: '20px'}} alt="access settings"></img>
            Access settings
          </NavLink>
        </Drawer>
      </nav>

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
