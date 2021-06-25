import { Box, CircularProgress, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect } from 'react'
import { latoFont } from '../../../style/theme'
import {
  EnrollmentType,
  ParticipantAccountSummary,
  Study,
  ParticipantActivityType,
  EnrolledAccountRecord,
} from '../../../types/types'
import clsx from 'clsx'
import ParticipantService from '../../../services/participants.service'

const useStyles = makeStyles(theme => ({
  root: {
    width: '80%',
    fontFamily: latoFont,
    fontSize: '16px',
  },
  idList: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2.5),
    marginTop: theme.spacing(2),
    '& span': {
      display: 'block',
    },
    maxHeight: '200px',
    overflow: 'auto',
  },
  smsIdListContainer: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(1, 1, 1, 2),
    textAlign: 'left',
    marginBottom: theme.spacing(3.5),
  },
}))

type DialogContentsProps = {
  participantsWithError: ParticipantAccountSummary[]
  selectedParticipants: ParticipantAccountSummary[]
  study: Study
  isProcessing: boolean
  // if this is false, then sms is implied to be true
  isRemove: boolean
  selectingAll: boolean
  tab: ParticipantActivityType
  token: string
}

function formatIds(
  studyId: string,
  enrollmentType: EnrollmentType,
  participants: EnrolledAccountRecord[],
): string[] {
  return participants.map((participant: EnrolledAccountRecord) =>
    enrollmentType === 'PHONE'
      ? participant.participant.phone?.nationalFormat ||
        participant.externalId ||
        'unknown'
      : participant.externalId || 'unknown',
  )
}

const DialogContents: React.FunctionComponent<DialogContentsProps> = ({
  participantsWithError,
  selectedParticipants,
  study,
  isProcessing,
  isRemove,
  selectingAll,
  tab,
  token,
}) => {
  const classes = useStyles()
  const [participantData, setParticipantData] = React.useState<
    EnrolledAccountRecord[]
  >([])
  const [loadingData, setLoadingData] = React.useState(false)

  const setData = async () => {
    const result1 = await ParticipantService.getAllParticipantsInEnrollmentType(
      study.identifier,
      token,
      'enrolled',
      false,
    )
    const dataWithoutTestMembers = result1.items
    if (tab === 'TEST') {
      const result2 = await ParticipantService.getAllParticipantsInEnrollmentType(
        study.identifier,
        token,
        'enrolled',
        true,
      )
      const dataWithTestMembers = result2.items
      const testParticipants = dataWithTestMembers.filter(
        el =>
          dataWithoutTestMembers.find(
            participant => participant.externalId === el.externalId,
          ) === undefined,
      )
      setParticipantData(testParticipants)
    } else {
      dataWithoutTestMembers.filter(el => el.withdrawnOn === undefined)
      setParticipantData(dataWithoutTestMembers)
    }
    setLoadingData(false)
  }

  useEffect(() => {
    setLoadingData(true)
    if (selectingAll) {
      setData()
      return
    }
    const formattedData = selectedParticipants.map(participant => {
      return {
        enrolledBy: {},
        enrolledOn: new Date(participant.createdOn || ''),
        externalId: participant.externalIds[study.identifier] || '',
        participant: {
          identifier: participant.id,
          phone: participant.phone,
        },
        studyId: study.identifier,
        withdrawnBy: {},
        withdrawnOn: new Date(),
      } as EnrolledAccountRecord
    })
    setParticipantData(formattedData)
    setLoadingData(false)
  }, [selectingAll, selectedParticipants])

  if (selectedParticipants.length === 0) {
    // this should never happen
    return (
      <Box className={classes.root}>
        {`Please select participants you would like to ${
          isRemove ? 'removed' : 'send message to'
        }`}
      </Box>
    )
  }

  if (isProcessing || loadingData) {
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
    study.clientData.enrollmentType!,
    participantData,
  )

  const idsWithErrorsList = formatIds(
    study!.identifier,
    study!.clientData.enrollmentType!,
    participantData,
  )

  if (participantsWithError.length === 0) {
    return (
      <Box className={classes.root}>
        {!isProcessing && participantsWithError.length === 0 && (
          <Box display="flex" flexDirection="column">
            <Box mb={1}>
              {isRemove
                ? 'Are you sure you would like to permanently remove the following participant(s):'
                : `You will be sending the following SMS to the following ${participantData.length} participant(s) listed below:`}
            </Box>
            {!isRemove && (
              <Box
                fontSize="15px"
                fontStyle="italic"
                width="90%"
                alignSelf="center"
                mb={1}
              >
                Welcome to Sleep & Cognition. Please get started by{' '}
                <strong style={{ textDecoration: 'underline' }}>
                  downloading the app here
                </strong>{' '}
                and enter the following{' '}
                <strong>Study ID: {study.identifier}</strong>.
              </Box>
            )}
            <Paper
              className={clsx(
                classes.idList,
                !isRemove && classes.smsIdListContainer,
              )}
              elevation={0}
            >
              {idsToRemoveList.map(id => (
                <span>{id}</span>
              ))}
            </Paper>
            {isRemove ? (
              <strong>This action cannot be undone.</strong>
            ) : (
              <Box>Please confirm this action.</Box>
            )}
          </Box>
        )}
      </Box>
    )
  } else {
    return (
      <Box className={classes.root}>
        The following participant(s) could not be removed:
        <div
          className={clsx(
            classes.idList,
            !isRemove && classes.smsIdListContainer,
          )}
        >
          {idsWithErrorsList.map(id => (
            <span>{id}</span>
          ))}
        </div>
      </Box>
    )
  }
}

export default DialogContents
