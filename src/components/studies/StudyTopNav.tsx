import React, { FunctionComponent } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'

import Logo from '../../assets/logo_mtb.svg'
import { Hidden, IconButton, Paper, Typography } from '@material-ui/core'

import { NavLink } from 'react-router-dom'
import BreadCrumb from '../widgets/BreadCrumb'
import PeopleIcon from '@material-ui/icons/People'
import MenuIcon from '@material-ui/icons/Menu'

const useStyles = makeStyles(theme => ({
  toolbarStudyHeader: {
    height: '104px',
    display: 'flex',

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  toolbar: {
    overflowX: 'auto',
    alignItems: 'baseline',
    minHeight: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(8),
  },
  toolbarLink: {
    padding: '0 16px 0 16px',
    paddingBottom: theme.spacing(2),
    flexGrow: 1,

    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,
  },
  selectedLink: {
    borderBottom: '2px solid black',
    paddingBottom: '17px',
    marginButtom: '-1px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    float: 'right',
    '&::after':  {
      content: "",
      display: 'table',
      clear: 'both'
    }
  },
}))

type StudyTopNavProps = {
  //sections:? { name: string; path: string }[]
  studyId: string
  studyName?: string
  currentSection?: string
}

const StudyTopNav: FunctionComponent<StudyTopNavProps> = ({
  studyId,
  studyName,
  currentSection,
}: StudyTopNavProps) => {
  const links = [
    { path: '/studies/builder/:id/', name: 'STUDY BUILDER' },
    { path: '/studies/:id/participant-manager', name: 'PARTICIPANT MANAGER' },
    { path: '/studies/:id/compliance', name: 'ADHERENCE DATA' },
    { path: '/studies/:id/study-data', name: 'STUDY DATA' },
  ]
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const classes = useStyles()
  //const sessionData = useSessionDataState()

  return (
    <>
    <Hidden lgUp>
    <IconButton
      color="inherit"
      aria-label="Open drawer"
      edge="end"
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className={classes.menuButton}
    >
      <MenuIcon></MenuIcon>
    </IconButton>
  </Hidden>
  <Hidden mdDown>
    <Paper className={classes.toolbarStudyHeader} elevation={0}>
      <Toolbar
        component="nav"
        variant="dense"
        disableGutters
        className={classes.toolbar}
        style={{
          marginTop: '48px',
          paddingTop: '0',
          alignItems: 'center',
        }}
      >
        <NavLink
          to={'/'}
          key="home"
          className={classes.toolbarLink}
          style={{ paddingBottom: '0' }}
        >
          <img src={Logo} key="home" />
        </NavLink>

        <BreadCrumb
          links={[{ url: '/Studies', text: '' }]}
          currentItem={studyName || 'Utitled Study '}
        ></BreadCrumb>
      </Toolbar>
      <Toolbar className={classes.toolbar}>
        {links
          .filter(section => section.name)
          .map(section => (
            <NavLink
              to={section.path.replace(':id', studyId)}
              key={section.path}
              className={classes.toolbarLink}
              activeClassName={classes.selectedLink}
            >
              {section.name}
            </NavLink>
          ))}
      </Toolbar>
      <Toolbar className={classes.toolbar}>
        <NavLink
          to={'path-to-shared-settings'.replace(':id', studyId)}
          key={'path-to-shared-settings'}
          className={classes.toolbarLink}
          activeClassName={classes.selectedLink}
          style={{ display: 'flex' }}
        >
          <PeopleIcon></PeopleIcon>&nbsp;&nbsp;Shared settings
        </NavLink>
      </Toolbar>
      {currentSection && (
        <Typography component="h1">{currentSection}</Typography>
      )}
    </Paper>
 
 </Hidden> 
 </>)
}

export default StudyTopNav
