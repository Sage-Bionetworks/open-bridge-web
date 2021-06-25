import { Box, makeStyles } from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { ReactComponent as DownloadIcon } from '../../../assets/download.svg'
//import { EnrollmentType } from '../../../types/types'

const useStyles = makeStyles(theme => ({
  root: {},
  templateLink: {
    margin: theme.spacing(2, 'auto', 5, 'auto'),
    display:'flex',
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
}> = ({ children, isEnrolledById }) => {
  const classes = useStyles()
  const template =
  isEnrolledById ?  (
      <a href="/participantImport_id_template.csv" download="Ids_Template.csv">
        <strong>Ids_Template.csv</strong>
      </a>
    ): (
      <a
        href="/participantImport_phone_template.csv"
        download="Phones_Template.csv"
      >
        <strong>Phones_Template.csv</strong>
      </a>
    ) 

  const recList = isEnrolledById?  (
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
    ): (
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
      <Box className={classes.templateLink}>
          
        <DownloadIcon  width="20px"/>
        {template}
      </Box>
      <Box mx="auto" my={2} textAlign="center">
        {children}
      </Box>
    </Box>
  )
}

export default ImportParticipantsInstructions
