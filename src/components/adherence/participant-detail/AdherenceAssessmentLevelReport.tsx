import {BorderedTableCell} from '@components/widgets/StyledComponents'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import {Box, Divider, styled, Table, TableBody, tableCellClasses, TableHead, TableRow, Typography} from '@mui/material'
import {AdherenceAssessmentLevelReport} from '@typedefs/types'
import {FunctionComponent} from 'react'
import AdherenceUtility from '../adherenceUtility'

const COLORS: Record<string, string> = {
  declined: '#fff7f7',
  completed: '#f8fcf8',
}

const StyledDivider = styled(Divider, {label: 'StyledDivider'})(theme => ({
  margin: '8px',
  height: '10px',
  borderColor: '#CCC',
}))

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

const AdherenceAssessmentLvlReport: FunctionComponent<{data: AdherenceAssessmentLevelReport}> = ({data}) => {
  return (
    <>
      {data.sessionRecords.map(sr => (
        <>
          <Typography variant="h5" sx={{fontWeight: 700}}>
            {sr.sessionName}
          </Typography>
          <Box sx={{display: 'flex', height: '40px', alignItems: 'center'}}>
            <Box>
              <Typography variant="h4" component={'span'}>
                Session Start&nbsp;&nbsp;
              </Typography>{' '}
              {AdherenceUtility.getDateTimeForDisplay(sr.sessionStart)}
            </Box>
            <StyledDivider orientation="vertical" />
            <Box>
              <Typography variant="h4" component={'span'}>
                Session End&nbsp;&nbsp;
              </Typography>{' '}
              {AdherenceUtility.getDateTimeForDisplay(sr.sessionCompleted) || '-'}
            </Box>
            <StyledDivider orientation="vertical" />
            <Box>
              <Typography variant="h4" component={'span'}>
                Expiration Date &nbsp;&nbsp;
              </Typography>{' '}
              {AdherenceUtility.getDateTimeForDisplay(sr.sessionExpiration)}
            </Box>
          </Box>
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
                    '& td': {
                      textAlign: 'center',
                    },
                  }}>
                  <BorderedTableCell>{ar.assessmentName}</BorderedTableCell>{' '}
                  <BorderedTableCell>{AdherenceUtility.getDateTimeForDisplay(ar.assessmentStart)}</BorderedTableCell>{' '}
                  <BorderedTableCell>
                    {AdherenceUtility.getDateTimeForDisplay(ar.assessmentCompleted)}
                  </BorderedTableCell>
                  <BorderedTableCell>
                    <div>
                      {ar.assessmentStatus === 'completed' && (
                        <CheckCircleTwoToneIcon sx={{color: '#63A650', marginRight: '4px'}} />
                      )}

                      {ar.assessmentStatus === 'not_completed' ? 'not completed' : 'completed'}
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

export default AdherenceAssessmentLvlReport
