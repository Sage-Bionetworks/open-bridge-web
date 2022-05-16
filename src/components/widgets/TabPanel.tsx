import {Box, Paper} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, {FunctionComponent} from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '310px',
    padding: theme.spacing(2),
    backgroundColor: '#FFF',
  },
  disabled: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#ddd',
    left: 0,
    height: '100%',
    width: '100%',
    opacity: '.8',
  },
}))

type TabPanelProps = {
  children?: React.ReactNode
  innerRef?: any
  disabled?: boolean
  index: any
  value: any
}

const TabPanel: FunctionComponent<TabPanelProps> = ({
  children,
  value,
  index,
  innerRef,
  disabled,
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
      {...other}>
      {value === index && (
        <Box className={classes.root} position="relative">
          <>{children}</>
          {disabled && <Box className={classes.disabled}> </Box>}
        </Box>
      )}
    </Paper>
  )
}

export default TabPanel
