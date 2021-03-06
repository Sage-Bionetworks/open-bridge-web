import { Box, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import {
  EnrollmentType,
  ParticipantAccountSummary,
  Study
} from '../../../types/types'

const useStyles = makeStyles(theme => ({}))

type DeleteDialogContentsProps = {
  participantsWithError: ParticipantAccountSummary[]
  selectedParticipants: ParticipantAccountSummary[]
  study: Study
  isProcessing: boolean
}

function formatIds(
  studyId: string,
  enrollmentType: EnrollmentType,
  participants: ParticipantAccountSummary[],
): string[] {
  return participants.map(participant =>
    enrollmentType === 'PHONE'
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

  return (
    <Box>
      {!isProcessing && participantsWithError.length === 0 && (
        <>
          <p>
            Are you sure you would like to permanently remove the following
            participant(s):
          </p>
          <p>
            {
              formatIds(
                study.identifier,
                study.clientData.enrollmentType!,
                selectedParticipants,
              ).map(id => (
                <span>
                  {id}
                  <br />
                </span>
              ))}
          </p>
          <p>This action cannot be undone.</p>
        </>
      )}
      {isProcessing && (
        <Box textAlign="center" mx="auto">
          <CircularProgress />
        </Box>
      )}

      {participantsWithError.length > 0 && !isProcessing && (
        <>
          The following participant(s) could not be removed:
          <br />
          {formatIds(
            study!.identifier,
            study!.clientData.enrollmentType!,
            participantsWithError,
          ).map(id => (
            <span>
              {id}
              <br />
            </span>
          ))}
        </>
      )}
    </Box>
  )
}

export default DeleteDialogContents
