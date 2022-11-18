import {Box, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow} from '@mui/material'
import {styled} from '@mui/styles'
import makeStyles from '@mui/styles/makeStyles'
import {useAssessmentsWithResources} from '@services/assessmentHooks'
import {theme} from '@style/theme'
import {FunctionComponent, useState} from 'react'

import {Link, RouteComponentProps, useLocation} from 'react-router-dom'
import {Assessment, ExtendedError} from '../../types/types'
import Loader from '../widgets/Loader'
import AssessmentCard from './AssessmentCard'
import AssessmentLibraryWrapper from './AssessmentLibraryWrapper'
import useViewToggle from './ViewHook'

type AssessmentLibraryOwnProps = {
  assessments?: Assessment[]
  tags?: string[]
}

const useStyles = makeStyles(theme => ({
  cardLink: {
    textDecoration: 'none',
  },
}))

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[200],
    padding: theme.spacing(2, 2),
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: 'left',
    padding: theme.spacing(1.75, 2),
  },
}))

const StyledTableRow = styled(Link)(({theme}) => ({
  display: 'table-row',
  textDecoration: 'none',
  '&:hover': {
    border: `1px solid ${theme.palette.grey[700]}`,
  },
  '&:nth-of-type(odd)': {
    backgroundColor: '#fff',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#FBFBFC',
  },

  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

type AssessmentLibraryProps = AssessmentLibraryOwnProps & RouteComponentProps

const AssessmentLibrary: FunctionComponent<AssessmentLibraryProps> = ({match}: AssessmentLibraryProps) => {
  const classes = useStyles()
  //const handleError = useErrorHandler()
  //const view = new URLSearchParams(useLocation().search).get('view')

  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[] | undefined>(undefined)
  const [viewMode, setViewMode] = useViewToggle(useLocation().search)
  const {data, isError, error, status, isLoading} = useAssessmentsWithResources(false, false)
  console.log('data', data)
  const {data: surveys} = useAssessmentsWithResources(false, true)

  if (isError) {
    handleError(error!)
  }

  if (status === 'success' && (!data?.assessments || !data?.tags)) {
    return <>No Data </>
  }

  return (
    <Loader reqStatusLoading={isLoading} variant="full">
      {data && (
        <AssessmentLibraryWrapper
          assessments={data.assessments}
          assessmentsType="OTHER"
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onChangeAssessmentsType={() => {}}
          onChangeTags={(assessments: Assessment[]) => setFilteredAssessments(assessments) /*setFilterTags(tags)*/}>
          {/*    {surveys?.assessments &&
            (surveys?.assessments).map((a, index) => (
              <Link
                to={`${match.url}/${a.guid}`}
                className={classes.cardLink}
                key={a.guid}>
                <AssessmentCard
                  index={index}
                  assessment={a}
                  key={a.guid}></AssessmentCard>
              </Link>
            ))}*/}

          {viewMode === 'GRID' ? (
            <>
              {(filteredAssessments || data.assessments).map((a, index) => (
                <Link to={`${match.url}/${a.guid}`} className={classes.cardLink} key={a.guid}>
                  <AssessmentCard index={index} assessment={a} key={a.guid}></AssessmentCard>
                </Link>
              ))}
            </>
          ) : (
            <TableContainer component={Box}>
              <Table
                sx={{minWidth: 650, border: `1px solid ${theme.palette.grey[300]}`}}
                aria-label="simple table"
                size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>Tags</StyledTableCell>
                    <StyledTableCell>Minutes</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(filteredAssessments || data.assessments).map((row, index) => (
                    <StyledTableRow key={row.guid} to={`${match.url}/${row.guid}`}>
                      <StyledTableCell>{row.title}</StyledTableCell>
                      <StyledTableCell>{row.tags.join(', ')}</StyledTableCell>
                      <StyledTableCell>{row.minutesToComplete}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </AssessmentLibraryWrapper>
      )}
    </Loader>
  )
}

export default AssessmentLibrary
function handleError(arg0: ExtendedError) {
  throw new Error('Function not implemented.')
}
