import React from 'react'
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {latoFont, poppinsFont} from '../../../../style/theme'

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '404px',
    marginTop: theme.spacing(4.25),
  },
  header: {
    fontFamily: poppinsFont,
    fontSize: '14px',
    lineHeight: '21px',
  },
  valueText: {
    fontSize: '15px',
    lineHeight: '15px',
    fontFamily: latoFont,
    width: '100%',
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(2, 2),
    marginTop: theme.spacing(1),
  },
}))

const ReadOnlyTextbox: React.FunctionComponent<{
  header: string
  value: string
}> = ({header, value}) => {
  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <strong className={classes.header}>{header}</strong>
      <Box className={classes.valueText}>{value}</Box>
    </Box>
  )
}

export default ReadOnlyTextbox
