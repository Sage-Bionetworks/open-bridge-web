import {BorderedTableCell} from '@components/widgets/StyledComponents'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Table,
  TableBody,
  tableCellClasses,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {styled} from '@mui/material/styles'
import {theme} from '@style/theme'
import {AdherenceAssessmentLevelReport, AdherenceAssessmentLevelReportSessionRecord} from '@typedefs/types'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import AdherenceUtility from '../adherenceUtility'

const COLORS: Record<string, string> = {
  declined: '#fff7f7',
  completed: '#f8fcf8',
}

const StyledDivider = styled(Divider, {label: 'StyledDivider'})(({theme}) => ({
  margin: theme.spacing(1),
  height: '10px',
  borderColor: '#CCC',
}))

const StyledTable = styled(Table, {label: 'StyledTable'})(({theme}) => ({
  border: '1px solid #EAECEE',
  marginBottom: theme.spacing(2),
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
  const [records, setRecords] = React.useState<Record<string, AdherenceAssessmentLevelReportSessionRecord[]>>({})
  React.useEffect(() => {
    const grouped = _.groupBy(data.sessionRecords, 'sessionName')
    setRecords(grouped)
  }, [data])

  return (
    <>
      {Object.keys(records).map((sn, index) => (
        <Accordion
          TransitionProps={{unmountOnExit: true}}
          key={sn}
          sx={{
            margin: theme.spacing(1.5, -5),
            boxShadow: '0px 2px 2px #EAECEE',
            '&.Mui-expanded': {
              margin: theme.spacing(2, -5),
            },
          }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={sn}
            id={sn}
            sx={{backgroundColor: '#FBFBFC', padding: theme.spacing(0, 5)}}>
            <Typography variant="h3" sx={{marginBottom: 0}}>
              {sn}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{marginLeft: theme.spacing(5), marginRight: theme.spacing(5)}}>
            {records[sn].map((sr: any) => (
              <>
                {sr.burstName && (
                  <Typography variant="h5" sx={{fontWeight: 700}}>
                    {sr.burstName}
                  </Typography>
                )}
                {sr.burstId && (
                  <Typography variant="h5" sx={{fontWeight: 700}}>
                    {sr.burstId}
                  </Typography>
                )}
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
                      <BorderedTableCell>Event</BorderedTableCell> <BorderedTableCell>Start Date</BorderedTableCell>
                      <BorderedTableCell>Completion Date</BorderedTableCell>
                      <BorderedTableCell>Status</BorderedTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sr.assessmentRecords.map((ar: any) => (
                      <TableRow
                        sx={{
                          backgroundColor: COLORS[ar.assessmentStatus.toLowerCase()] || '#fffbf4',
                          '& td': {
                            textAlign: 'center',
                          },
                        }}>
                        <BorderedTableCell>{ar.assessmentName}</BorderedTableCell>{' '}
                        <BorderedTableCell>
                          {AdherenceUtility.getDateTimeForDisplay(ar.assessmentStart)}
                        </BorderedTableCell>{' '}
                        <BorderedTableCell>
                          {AdherenceUtility.getDateTimeForDisplay(ar.assessmentCompleted)}
                        </BorderedTableCell>
                        <BorderedTableCell>
                          <div>
                            {ar.assessmentStatus === 'completed' && (
                              <CheckCircleTwoToneIcon sx={{color: '#63A650', marginRight: '4px'}} />
                            )}

                            {ar.assessmentStatus.replace('_', ' ')}
                          </div>
                        </BorderedTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </StyledTable>
              </>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  )
}

export default AdherenceAssessmentLvlReport
