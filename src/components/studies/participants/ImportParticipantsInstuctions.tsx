import { Box } from "@material-ui/core"
import React, { FunctionComponent } from "react"
import { EnrollmentType } from "../../../types/types"

// -----------------  Import participants tab control
const ImportParticipantsInstructions: FunctionComponent<{
    enrollmentType: EnrollmentType
    children: React.ReactNode
  }> = ({ children, enrollmentType }) => {
    const template =
      enrollmentType === 'PHONE' ? (
        <a
          href="/participantImport_phone_template.csv"
          download="participantImport_phone_template.csv"
        >
          <strong>participantImport_phone_template.csv</strong>
        </a>
      ) : (
        <a
          href="/participantImport_id_template.csv"
          download="participantImport_id_template"
        >
          <strong>participantImport_id_template</strong>
        </a>
      )
  
    const recList =
      enrollmentType === 'PHONE' ? (
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
            <strong>Notes</strong> (for your reference)
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <strong>ParticipantID* </strong>
          </li>
          <li>
            <strong>Clinic Visit </strong>(can be updated later)
          </li>
          <li>
            <strong>Notes</strong> (for your reference)
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
        {template}
        <Box mx="auto" my={2} textAlign="center">
          {children}
        </Box>
      </Box>
    )
  }


  export default ImportParticipantsInstructions