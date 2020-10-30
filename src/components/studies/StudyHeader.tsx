import React, { FunctionComponent, useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import { Box, Dialog, DialogContent, Paper } from '@material-ui/core'
import AccountLogin from './../account/AccountLogin'
import { useSessionDataState } from '../../helpers/AuthContext'
import Logout from '../account/Logout'
import SageLogo from '../../assets/sage.svg'
import { NavLink, BrowserRouter as Router } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  toolbarWrapper: {
    padding: `${theme.spacing(7)}px ${theme.spacing(5)}px  ${theme.spacing(
      3,
    )}px ${theme.spacing(5)}px`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbar: {
    justifyContent: 'space-between',
    overflowX: 'auto',

    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarLink: {
    padding: theme.spacing(1),
    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,
  },
  selectedLink: {
    borderBottom: '2px solid black',
  },
}))

type StudyHeaderProps = {
  //sections:? { name: string; path: string }[]
  studyId: string
}

const StudyHeader: FunctionComponent<StudyHeaderProps> = ({
  studyId,
}: StudyHeaderProps) => {
  const links = [
    { path: '/studies/builder/:id/', name: 'STUDY BUILDER' },
    { path: '/studies/:id/participant-manager', name: 'PARTICIPANT MANAGER' },
    { path: '/studies/:id/compliance', name: 'COMPLIANCE' },
    { path: '/studies/:id/study-data', name: 'STUDY DATA' },
  ]

  const classes = useStyles()
  //const sessionData = useSessionDataState()

  return (
    <Paper className={classes.toolbarWrapper} elevation={0}>
      <Toolbar
        component="nav"
        variant="dense"
        disableGutters
        className={classes.toolbar}
      >
        <img src={SageLogo} key="home" />
        {links
          .filter(section => section.name)
          .map(section => (
            <>
              <NavLink
                to={section.path.replace(':id', studyId)}
                key={section.name + '1'}
                className={classes.toolbarLink}
                activeClassName={classes.selectedLink}
              >
                {section.name}
              </NavLink>
            </>
          ))}
      </Toolbar>
    </Paper>
  )
}

export default StudyHeader
