import React, { FunctionComponent, useState } from 'react'

import { Box, Typography, makeStyles, Paper } from '@material-ui/core'

import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '310px',
    padding: theme.spacing(2),
    backgroundColor: '#FFF',
  },
}))

type TabPanelProps = {
  children?: React.ReactNode
  innerRef?: any
  index: any
  value: any
}

const TabPanel: FunctionComponent<TabPanelProps> = ({
  children,
  value,
  index,
  innerRef,
  ...other
}: TabPanelProps) => {
  const classes = useStyles()
  return (
    <Paper
      ref={innerRef}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className={classes.root}>
          <>{children}</>
        </Box>
      )}
    </Paper>
  )
}

export default TabPanel
