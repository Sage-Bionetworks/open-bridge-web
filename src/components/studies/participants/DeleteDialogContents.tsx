import { Box, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { isSignInById } from '../../../helpers/utility'
import { latoFont } from '../../../style/theme'
import {
  ParticipantAccountSummary,
  Study
} from '../../../types/types'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0, 11, 3, 11),
    fontSize: '16px',
    fontFamily: latoFont,
  },
  idList: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),

    '& span': {
      display: 'block',
    },
  },
}))

type DeleteDialogContentsProps = {
  participantsWithError: ParticipantAccountSummary[]
  selectedParticipants: ParticipantAccountSummary[]
  study: Study
  isProcessing: boolean
}

function formatIds(
  studyId: string,
  isEnrolledById: boolean,
  participants: ParticipantAccountSummary[],
): string[] {
  return participants.map(participant =>
    !isEnrolledById
      ? participant.phone?.nationalFormat ||
        participant.externalIds[studyId] ||
        'unknown'
      : participant.externalIds[studyId] || 'unknown',
  )
}

const DeleteDialogContents: React.FunctionComponent<DeleteDialogContentsProps> = ({
  participantsWithError,
  selectedParticipants,
  study,
  isProcessing,
}) => {
  const classes = useStyles()

  if (selectedParticipants.length === 0) {
    return (
      <Box className={classes.root}>
        Please select participants you would like to remove
      </Box>
    )
  }

  if (isProcessing) {
    return (
      <Box className={classes.root}>
        <Box textAlign="center" mx="auto">
          <CircularProgress />
        </Box>
      </Box>
    )
  }

  const idsToRemoveList = formatIds(
    study.identifier,
    isSignInById( study.signInTypes),

    selectedParticipants,
  )

  const idsWithErrorsList = formatIds(
    study!.identifier,
    isSignInById( study.signInTypes),
    participantsWithError,
  )

  if (participantsWithError.length === 0) {
    return (
      <Box className={classes.root}>
        {!isProcessing && participantsWithError.length === 0 && (
          <>
            Are you sure you would like to permanently remove the following
            participant(s):
            <div className={classes.idList}>
              {idsToRemoveList.map(id => (
                <span>{id}</span>
              ))}
            </div>
            <strong>This action cannot be undone.</strong>
          </>
        )}
      </Box>
    )
  } else {
    return (
      <Box className={classes.root}>
        The following participant(s) could not be removed:
        <div className={classes.idList}>
          {idsWithErrorsList.map(id => (
            <span>{id}</span>
          ))}
        </div>
      </Box>
    )
  }
}

export default DeleteDialogContents
