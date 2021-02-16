import { Box, createStyles, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

export interface TimelinePlotProps {
  something: string
}

const TimelinePlot: React.FunctionComponent<TimelinePlotProps> = ({something}: TimelinePlotProps) => {


  return (
    <Box border="1px solid black" padding="30px" bgcolor="#ECECEC">
      This timeline viewer will update to provide a visual summary of the
      schedules you’ve defined below for each session.
    </Box>
  )
}

export default TimelinePlot
