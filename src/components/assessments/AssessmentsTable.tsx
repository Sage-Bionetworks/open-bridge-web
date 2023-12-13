import {StyledLink} from '@components/widgets/StyledComponents'
import {
  Box,
  Checkbox,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import {theme} from '@style/theme'
import {Assessment} from '@typedefs/types'
import {FunctionComponent, ReactNode} from 'react'
import {Link, match} from 'react-router-dom'

const RowStyle = {
  display: 'table-row',
  textDecoration: 'none',
  /* '&:hover': {
    '> td': {
      backgroundColor: theme.palette.accent.purple,
      color: '#fff',
      '&  svg': {
        fill: '#fff',
      },
    },
  },*/
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
}

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

const StyledTableRowLink = styled(Link)(({theme}) => RowStyle)
const StyledTableRow = styled(TableRow)(({theme}) => ({...RowStyle, cursor: 'pointer'}))

type AssessmentTableProps = {
  assessments: Assessment[]
  selectedAssessments?: Assessment[]
  onSelectAssessment?: (assessment: Assessment) => void
  onSelectAll?: (checked: boolean) => void
  match?: match
}

const Row: FunctionComponent<{children: ReactNode[]; type: 'link' | 'row'; to?: string; onClick?: () => void}> = ({
  children,
  type,
  to,
  onClick,
}) => {
  if (type === 'link' && to) {
    return <StyledTableRowLink to={to}>{children}</StyledTableRowLink>
  } else {
    return <StyledTableRow onClick={onClick}>{children}</StyledTableRow>
  }
}

const AssessmentTable: FunctionComponent<AssessmentTableProps> = ({
  assessments,
  selectedAssessments,
  onSelectAssessment,
  onSelectAll,
  match,
}) => {
  const rowType = onSelectAssessment && selectedAssessments ? 'row' : 'link'
  return (
    <TableContainer component={Box}>
      <Table
        sx={{minWidth: 650, border: `1px solid ${theme.palette.grey[300]}`}}
        aria-label="simple table"
        size="small">
        <TableHead>
          <TableRow>
            {selectedAssessments && [
              <StyledTableCell>
                <Checkbox
                  checked={selectedAssessments.length === assessments.length}
                  onChange={e => (onSelectAll ? onSelectAll(e.target.checked) : undefined)}
                />
              </StyledTableCell>,
            ]}
            <StyledTableCell>Assessment Title</StyledTableCell>

            <StyledTableCell>Tags</StyledTableCell>
            <StyledTableCell>Minutes</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assessments.map((row, index) => (
            <Row
              type={rowType}
              to={`${match?.url}/${row.guid}`}
              key={row.guid}
              onClick={onSelectAssessment ? () => onSelectAssessment(row) : undefined}>
              {selectedAssessments ? (
                [
                  <StyledTableCell>
                    <Checkbox checked={selectedAssessments.find(a => a.guid === row.guid) !== undefined} />
                  </StyledTableCell>,
                  <StyledTableCell>{row.title}</StyledTableCell>,
                ]
              ) : (
                <StyledTableCell>
                  <StyledLink to={`${match?.url}/${row.guid}?viewType=LIST`}>{row.title}</StyledLink>
                </StyledTableCell>
              )}
              <StyledTableCell>{row.tags.join(', ')}</StyledTableCell>
              <StyledTableCell>{row.minutesToComplete}</StyledTableCell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AssessmentTable
