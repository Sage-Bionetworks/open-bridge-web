import Utility from '@helpers/utility'
import {Box, CircularProgress, Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import ParticipantService, {
  formatExternalId,
} from '@services/participants.service'
import {latoFont} from '@style/theme'
import {
  EnrolledAccountRecord,
  ParticipantAccountSummary,
  ParticipantActivityType,
  Phone,
  Study,
} from '@typedefs/types'
import clsx from 'clsx'
import React, {useEffect} from 'react'

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

type ParticipantDisplayType = {
  identifier: string
  externalId: string
  phone?: Phone
}

function formatIds(
  studyId: string,
  isEnrolledById: boolean,
  participants: ParticipantDisplayType[]
): string[] {
  return participants.map((participant: ParticipantDisplayType) => {
    if (isEnrolledById) {
      return participant.externalId
        ? formatExternalId(studyId, participant.externalId)
        : 'unknown'
    } else {
      if (participant.phone?.nationalFormat) {
        return participant.phone?.nationalFormat
      } else {
        return participant.externalId
          ? formatExternalId(studyId, participant.externalId)
          : 'unknown'
      }
    }
  })
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
    ParticipantDisplayType[]
  >([])
  const [loadingData, setLoadingData] = React.useState(false)

  const setData = async () => {
    let finalResult: EnrolledAccountRecord[] = []
    const resultEnrolled =
      await ParticipantService.getEnrollmentByEnrollmentType(
        study.identifier,
        token,
        'enrolled',
        false
      )
    const enrolledNonTestParticipants = resultEnrolled.items
    finalResult = enrolledNonTestParticipants
    if (tab === 'TEST') {
      const resultAll = await ParticipantService.getEnrollmentByEnrollmentType(
        study.identifier,
        token,
        'all',
        true
      )
      const resultWithdrawn =
        await ParticipantService.getEnrollmentByEnrollmentType(
          study.identifier,
          token,
          'withdrawn',
          false
        )
      const allParticipants = resultAll.items
      const withdrawnNonTestParticipants = resultWithdrawn.items
      let testParticipants = allParticipants.filter(
        el =>
          enrolledNonTestParticipants.find(
            participant =>
              participant.participant.identifier === el.participant.identifier
          ) === undefined
      )
      testParticipants = testParticipants.filter(
        el =>
          withdrawnNonTestParticipants.find(
            participant =>
              participant.participant.identifier === el.participant.identifier
          ) === undefined
      )
      finalResult = testParticipants
    }
    const formattedData = finalResult.map(participant => {
      return {
        identifier: participant.participant?.identifier,
        externalId: participant.externalId || '',
        phone: participant.participant?.phone,
      } as ParticipantDisplayType
    })
    setParticipantData(formattedData)
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
        identifier: participant.id,
        externalId: participant.externalIds[study.identifier] || '',
        phone: participant.phone,
      } as ParticipantDisplayType
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

  const selectedIds = formatIds(
    study.identifier,
    Utility.isSignInById(study.signInTypes),
    participantData
  )

  const idsWithErrorsList = formatIds(
    study.identifier,
    Utility.isSignInById(study.signInTypes),
    participantData
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
                mb={1}>
                Welcome to Sleep & Cognition. Please get started by{' '}
                <strong style={{textDecoration: 'underline'}}>
                  downloading the app here
                </strong>{' '}
                and enter the following{' '}
                <strong>Study ID: {study.identifier}</strong>.
              </Box>
            )}
            <Paper
              className={clsx(
                classes.idList,
                !isRemove && classes.smsIdListContainer
              )}
              elevation={0}>
              {selectedIds.map((id, index) => (
                <span key={'selected-id' + index}>{id}</span>
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
            !isRemove && classes.smsIdListContainer
          )}>
          {idsWithErrorsList.map(id => (
            <span>{id}</span>
          ))}
        </div>
      </Box>
    )
  }
}

export default DialogContents
