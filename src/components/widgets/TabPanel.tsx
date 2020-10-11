import React, { FunctionComponent, useState } from 'react'

import { Box, Typography, makeStyles } from '@material-ui/core'

import clsx from 'clsx'

const useStyles = makeStyles({
  root: {
    minHeight: '310px',
    padding: '20px',
    backgroundColor: '#E2E2E2',
  },
})

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
    <div
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
    </div>
  )
}

export default TabPanel
