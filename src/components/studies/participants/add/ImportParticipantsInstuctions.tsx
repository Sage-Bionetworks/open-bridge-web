import {Box, makeStyles} from '@material-ui/core'
import EventService from '@services/event.service'
import {SchedulingEvent} from '@typedefs/scheduling'
import React, {FunctionComponent} from 'react'
import {jsonToCSV} from 'react-papaparse'
import {ReactComponent as DownloadIcon} from '../../../../assets/download.svg'
import ParticipantDownloadTrigger from '../download/ParticipantDownloadTrigger'
//import { EnrollmentType } from '../../../types/types'

const useStyles = makeStyles(theme => ({
  root: {},
  templateLink: {
    margin: theme.spacing(2, 'auto', 5, 'auto'),
    display: 'flex',
    justifyContent: 'center',

    '& a': {
      color: '#1C1C1C',
      textDecoration: 'underline',
      marginLeft: theme.spacing(0.5),
    },
  },
}))

// -----------------  Import participants tab control
const ImportParticipantsInstructions: FunctionComponent<{
  isEnrolledById: boolean
  children: React.ReactNode
  studyEvents: SchedulingEvent[]
}> = ({children, isEnrolledById, studyEvents}) => {
  const classes = useStyles()
  const [fileDownloadUrl, setFileDownloadUrl] = React.useState<
    string | undefined
  >(undefined)

  const createDownloadTemplate = async () => {
    const templateData: Record<string, string> = {
      externalId: '',
    }
    if (!isEnrolledById) {
      templateData['phoneNumber'] = ''
    }

    studyEvents?.forEach(e => {
      templateData[EventService.formatCustomEventIdForDisplay(e.identifier)] =
        ''
    })
    templateData['note'] = ''
    //csv and blob it
    const csvData = jsonToCSV([templateData])
    const blob = new Blob([csvData], {
      type: 'text/csv;charset=utf8;',
    })
    // get the fake link
    const fileObjUrl = URL.createObjectURL(blob)
    setFileDownloadUrl(fileObjUrl)
    // setLoadingIndicators({isDownloading: false})
  }

  const template = isEnrolledById ? (
    <a href="/participantImport_id_template.csv" download="Ids_Template.csv">
      <strong>Ids_Template.csv</strong>
    </a>
  ) : (
    <a
      href="/participantImport_phone_template.csv"
      download="Phones_Template.csv">
      <strong>Phones_Template.csv</strong>
    </a>
  )

  const recList = isEnrolledById ? (
    <ul>
      <li>
        <strong>ParticipantID* </strong>
      </li>
      <li>
        <strong>Clinic Visit </strong>(can be updated later)
      </li>
      <li>
        <strong>Note</strong> (for your reference)
      </li>
    </ul>
  ) : (
    <ul>
      <li>
        <strong>Phone Number* </strong>
      </li>
      <li>
        <strong>Clinic Visit </strong>(can be updated later)
      </li>
      <li>
        <strong>Reference ID</strong> (Alternate ID for your reference)
      </li>
      <li>
        <strong>Note</strong> (for your reference)
      </li>
    </ul>
  )

  return (
    <Box>
      <p>
        To add <strong>new participants</strong> to your study, we will need the
        following information by columns:
      </p>
      {recList}
      Please make sure that your .csv matches this template:
      <br />
      <ParticipantDownloadTrigger
        onDownload={() => createDownloadTemplate()}
        fileDownloadUrl={fileDownloadUrl}
        hasItems={true}
        fileLabel={'ParticipantImportTemplate'}
        onDone={() => {
          URL.revokeObjectURL(fileDownloadUrl!)
          setFileDownloadUrl(undefined)
        }}>
        <Box className={classes.templateLink}> </Box>
        <DownloadIcon width="20px" />
        &nbsp;
        {'Participant Import Template'}{' '}
      </ParticipantDownloadTrigger>
      <Box mx="auto" my={2} textAlign="center">
        {children}
      </Box>
    </Box>
  )
}

export default ImportParticipantsInstructions
