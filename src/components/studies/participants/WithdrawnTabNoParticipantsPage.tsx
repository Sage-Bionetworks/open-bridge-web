import BatchEditIcon from '@assets/edit_pencil.svg'
import EditParticipantImage from '@assets/edit_pencil_red.svg'
import JoinedCheckSymbol from '@assets/participants/joined_check_mark.svg'
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {latoFont, poppinsFont} from '@style/theme'
import React from 'react'

const useStyles = makeStyles(theme => ({
  noParticipantsText: {
    '& p': {
      fontFamily: latoFont,
    },
    padding: theme.spacing(7.5, 7.5),
    display: 'flex',
    fontSize: '16px',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(8),
    marginTop: theme.spacing(5),
  },
}))

const WidthrawnTabNoParticipants: React.FunctionComponent<{}> = ({}) => {
  const classes = useStyles()
  return (
    <Box className={classes.noParticipantsText}>
      <Box maxWidth="400px" textAlign="left" mr={8}>
        <Box mb={3} fontWeight="bold" fontFamily={poppinsFont}>
          Withdrawing Participants From the Study
        </Box>
        <p>
          Once a participant signs into the app, they are considered enrolled in
          your study.
        </p>
        <p>
          A{' '}
          <img
            src={JoinedCheckSymbol}
            alt="Check Icon"
            style={{marginBottom: '-4px'}}></img>{' '}
          and timestamp will appear on the Joined column of the Particpant List.
        </p>
        <p>
          To withdraw a participant from a study: on the Participant List tab,
          click on the{' '}
          <img
            src={BatchEditIcon}
            alt="Pencil Icon"
            style={{marginBottom: '-4px'}}></img>{' '}
          icon to Edit Participant Details. Click on Withdraw from study in the
          bottom left corner.
        </p>
        <p>
          Participants who are withdrawn will appear on this Withdrawn
          Participant tab for your study records.
        </p>
      </Box>
      <img src={EditParticipantImage}></img>
    </Box>
  )
}

export default WidthrawnTabNoParticipants
