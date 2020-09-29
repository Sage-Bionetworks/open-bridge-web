import React, { FunctionComponent, useState } from 'react'

import {
  Box,
  Typography,
  makeStyles,
  Menu,
  MenuItem,
  Button,
} from '@material-ui/core'

import clsx from 'clsx'
import AssessmentCard from '../../assessments/AssessmentCard'
import { StudySession } from '../../../types/types'

const useStyles = makeStyles({
  root: {
    padding: '10px 10px',
    fontSize: '14px',
  },
})

type AddableAssessmentProps = {
  children?: React.ReactNode
  sessions: StudySession[]
  onAddFn: Function
}

const AddableAssessment: FunctionComponent<AddableAssessmentProps> = ({
  sessions = [],
  onAddFn,
  children,
}: AddableAssessmentProps) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const addToSession = (sessionId?: string) => {
    onAddFn(sessionId)
    handleClose()
  }

  const handleClose = () => {

    setAnchorEl(null)
  }

  const renderMenuItems = (sessions: StudySession[]): JSX.Element[] => {
    if (sessions.length === 0) {
      return [
        <MenuItem
          onClick={() => handleClose()}
          key={-1}
          className={classes.root}
        >
          Please create a session first
        </MenuItem>,
      ]
    } else {
      return sessions.map((session, index) => (
        <MenuItem
          onClick={() => addToSession(session.id)}
          key={index}
          className={classes.root}
        >
          Add to: {session.name}
        </MenuItem>
      ))
    }
  }

  return (
    <>
      <Button aria-haspopup="true" onClick={(evt: any) => handleClick(evt)}>
        {children}
      </Button>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
      >
        {renderMenuItems(sessions)}
      </Menu>
    </>
  )
}

export default AddableAssessment
