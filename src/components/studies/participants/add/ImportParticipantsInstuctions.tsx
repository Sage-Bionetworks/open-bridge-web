import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone'
import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import EventService, {JOINED_EVENT_ID} from '@services/event.service'
import {theme} from '@style/theme'
import React, {FunctionComponent} from 'react'
import {jsonToCSV} from 'react-papaparse'
import CsvUtility from '../csv/csvUtility'
import DownloadTrigger from '../../DownloadTrigger'
//import { EnrollmentType } from '../../../types/types'

const useStyles = makeStyles(theme => ({
  root: {},
  recList: {listStyle: 'none'},
  /* templateLink: {
    margin: theme.spacing(2, 'auto', 5, 'auto'),
    display: 'flex',
    justifyContent: 'center',

    '& a': {
      color: '#1C1C1C',
      textDecoration: 'underline',
      marginLeft: theme.spacing(0.5),
    },
  },*/
}))

// -----------------  Import participants tab control
const ImportParticipantsInstructions: FunctionComponent<{
  isEnrolledById: boolean
  children: React.ReactNode
  scheduleEventIds: string[]
}> = ({children, isEnrolledById, scheduleEventIds}) => {
  const classes = useStyles()
  const [fileDownloadUrl, setFileDownloadUrl] = React.useState<string | undefined>(undefined)

  const createDownloadTemplate = async () => {
    const templateData = CsvUtility.getDownloadTemplateRow(isEnrolledById, scheduleEventIds)
    //csv and blob it
    const csvData = jsonToCSV([templateData])
    const blob = new Blob([csvData], {
      type: 'text/csv;charset=utf8;',
    })
    // get the fake link
    const fileObjUrl = URL.createObjectURL(blob)
    setFileDownloadUrl(fileObjUrl)
  }

  const instructionItems = scheduleEventIds.map((eventId, i) => (
    <li key={i}>
      <strong>{EventService.formatEventIdForDisplay(eventId)}</strong>{' '}
      {eventId !== JOINED_EVENT_ID ? '(can be updated later)' : ''}
    </li>
  ))

  const recList = isEnrolledById ? (
    <ul className={classes.recList}>
      <li>
        <strong>ParticipantID* </strong>
      </li>
      {instructionItems.map(i => i)}
      <li>
        <strong>Participant Time Zone</strong> (can be updated later)
      </li>
      <li>
        <strong>Notes</strong> (for your reference)
      </li>
    </ul>
  ) : (
    <ul className={classes.recList}>
      <li>
        <strong>Phone Number* </strong>
      </li>
      {instructionItems.map(i => i)}
      <li>
        <strong>Reference ID</strong> (Alternate ID for your reference)
      </li>
      <li>
        <strong>Participant Time Zone</strong> (can be updated later)
      </li>
      <li>
        <strong>Notes</strong> (for your reference)
      </li>
    </ul>
  )

  return (
    <Box>
      <p>
        To add <strong>new participants</strong> to your study, we will need the following information by columns:
      </p>
      {recList}
      Your file should match this template:
      <br />
      <DownloadTrigger
        onDownload={() => createDownloadTemplate()}
        fileDownloadUrl={fileDownloadUrl}
        hasItems={true}
        fileLabel={'ParticipantImportTemplate'}
        onDone={() => {
          URL.revokeObjectURL(fileDownloadUrl!)
          setFileDownloadUrl(undefined)
        }}>
        <br />
        <br />
        <Box
          sx={{
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            backgroundColor: 'transparent',
            padding: theme.spacing(0.75, 1, 0.75, 0.75),

            borderRadius: '6px',
            border: '1px solid #4F527D',
          }}>
          <DownloadTwoToneIcon />
          &nbsp; Participant Import Template
        </Box>
      </DownloadTrigger>
      *Required info. Please include only <strong>new participants</strong> in the .csv.
      <p>&nbsp;</p>
      <Box mx="auto" my={2} textAlign="center">
        {children}
      </Box>
    </Box>
  )
}

export default ImportParticipantsInstructions
