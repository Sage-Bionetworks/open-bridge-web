import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles(theme => ({
  container: {
    width: '38px',
    height: '38px',
    borderRadius: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#EAECEE',
    fontWeight: 600,
    fontSize: '16px',

    color: '#22252A',
    fontStyle: latoFont,
  },
}))

type SectionIndicatorProps = {
  index: Number
  className?: string
}

const SectionIndicator: React.FunctionComponent<SectionIndicatorProps> = ({index, className}) => {
  const classes = useStyles()
  return <Box className={clsx(classes.container, className && className)}>{index}</Box>
}

export default SectionIndicator
