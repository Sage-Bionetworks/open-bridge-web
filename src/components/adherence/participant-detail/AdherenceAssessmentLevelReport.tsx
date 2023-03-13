import {BorderedTableCell} from '@components/widgets/StyledComponents'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import {styled, Table, TableBody, tableCellClasses, TableHead, TableRow} from '@mui/material'
import {AdherenceAssessmentLevelReport as AdherenceAssessmentLevelReportType} from '@typedefs/types'
import {FunctionComponent} from 'react'
import AdherenceUtility from '../adherenceUtility'

const COLORS: Record<string, string> = {
  declined: '#fff7f7',
  completed: '#f8fcf8',
}

const StyledTable = styled(Table, {label: 'StyledTable'})(theme => ({
  border: '1px solid #EAECEE',
  [`& .${tableCellClasses.head}`]: {
    height: '50px',
    backgroundColor: '#F1F3F5',
    fontWeight: 700,
    textAlign: 'center',
  },

  [`& .${tableCellClasses.body}`]: {
    width: '25%',
    textAlign: 'center',
    borderBottom: '1px solid  #EAECEE',
    verticalAlign: 'middle',
    '& > div': {
      display: 'flex',
      justifyContent: 'center',
    },
  },
}))
const StyledTableHead = styled(TableHead, {label: 'StyledTableHead'})(theme => ({
  // height: '50px',
  //backgroundColor: '#F1F3F5',
}))
const data: AdherenceAssessmentLevelReportType = {
  participant: {
    identifier: 'peHyRQJ6k6TI4D6HFCTVC59U',
    firstName: 'Assess',
    lastName: 'Person',
    email: 'jack.nelson+assess@sagebase.org',
  },
  testAccount: true,
  clientTimeZone: 'America/Los_Angeles',
  sessionRecords: [
    {
      sessionName: 'Session #1',
      sessionGuid: 'QhhM4MkrU72ApZ6Tlv2dyRgE',
      sessionStart: '2023-02-21T16:05:00.000Z',
      sessionCompleted: '2023-02-21T16:16:00.000Z',
      assessmentRecords: [
        {
          assessmentName: 'Test assessment',
          assessmentId: 'test-assessment-a',
          assessmentGuid: '3WuLIOleJLJW_HbWlOZi9Y8D',
          assessmentInstanceGuid: 'NU3t9un1mc32XXe5KBpYVg',
          assessmentStatus: 'Completed',
          assessmentStart: '2023-02-21T16:05:00.000Z',
          assessmentCompleted: '2023-02-21T16:10:00.000Z',
          uploadedOn: '2023-02-21T16:10:00.000Z',
        },
        {
          assessmentName: 'adh_test_assess',
          assessmentId: 'adh_test_assess',
          assessmentGuid: '0pnaYdzuMmQzdKliFD8L5z8E',
          assessmentInstanceGuid: 'vyhm8ueBQuvcInNexxM4wA',
          assessmentStatus: 'Completed',
          assessmentStart: '2023-02-21T16:15:00.000Z',
          assessmentCompleted: '2023-02-21T16:16:00.000Z',
        },
      ],
    },
    {
      sessionName: 'Session #1',
      sessionGuid: 'QhhM4MkrU72ApZ6Tlv2dyRgE',
      burstName: 'BurstAA',
      burstId: '1',
      assessmentRecords: [
        {
          assessmentName: 'Test assessment',
          assessmentId: 'test-assessment-a',
          assessmentGuid: '3WuLIOleJLJW_HbWlOZi9Y8D',
          assessmentInstanceGuid: 'o5iJqTFYn01c-uowrjRVSA',
          assessmentStatus: 'Declined',
        },
      ],
    },
  ],
}

const AdherenceAssessmentLevelReport: FunctionComponent<{}> = () => {
  return (
    <>
      {data.sessionRecords.map(sr => (
        <>
          <div>{sr.sessionName}</div>
          <div>
            Session Start {sr.sessionStart} | Session End {sr.sessionCompleted} | Expiration Date TODO
          </div>
          <StyledTable>
            <TableHead>
              <TableRow>
                <BorderedTableCell>Event</BorderedTableCell> <BorderedTableCell>Start Date</BorderedTableCell>{' '}
                <BorderedTableCell>Completion Date</BorderedTableCell>
                <BorderedTableCell>Status</BorderedTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sr.assessmentRecords.map(ar => (
                <TableRow
                  sx={{
                    backgroundColor: COLORS[ar.assessmentStatus.toLowerCase()] || '#fffbf4',
                  }}>
                  <BorderedTableCell>{ar.assessmentName}</BorderedTableCell>{' '}
                  <BorderedTableCell>{AdherenceUtility.getDateTimeForDisplay(ar.assessmentStart)}</BorderedTableCell>{' '}
                  <BorderedTableCell>
                    {AdherenceUtility.getDateTimeForDisplay(ar.assessmentCompleted)}
                  </BorderedTableCell>
                  <BorderedTableCell>
                    <div>
                      {ar.assessmentStatus === 'Completed' && (
                        <CheckCircleTwoToneIcon sx={{color: '#63A650', marginRight: '4px'}} />
                      )}

                      {ar.assessmentStatus}
                    </div>
                  </BorderedTableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </>
      ))}
    </>
  )
}

export default AdherenceAssessmentLevelReport
