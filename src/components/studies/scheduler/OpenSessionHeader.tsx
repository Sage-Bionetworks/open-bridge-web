import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone'
import {Box, Typography} from '@mui/material'
import {theme} from '@style/theme'
import {StudySession} from '@typedefs/scheduling'
import React from 'react'

const OpenSessionHeader: React.FunctionComponent<{
  session?: StudySession
}> = ({session}) => {
  if (!session) {
    return <></>
  }

  const {name, assessments = []} = session

  const totalTime = assessments.reduce((total, curr) => {
    const time = curr.minutesToComplete
    return total + (time ? time : 0)
  }, 0)
  const result = (
    <>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '20px',
          color: '#22252A',
          marginBottom: theme.spacing(1.5),
        }}>
        {name}
      </Typography>
      <Box
        sx={{
          fontWeight: '400',
          fontSize: '16px',
        }}>
        {totalTime} minutes &nbsp;
        <AccessTimeTwoToneIcon sx={{fontSize: '16px', verticalAlign: 'middle'}}></AccessTimeTwoToneIcon>
      </Box>
    </>
  )
  return result
}

export default OpenSessionHeader
