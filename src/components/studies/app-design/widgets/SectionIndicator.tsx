import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React from 'react'
import {latoFont} from '../../../../style/theme'

const useStyles = makeStyles(theme => ({
  container: {
    width: '38px',
    height: '38px',
    borderRadius: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    backgroundColor: 'black',
    fontWeight: 'bold',
    fontSize: '16px',
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
