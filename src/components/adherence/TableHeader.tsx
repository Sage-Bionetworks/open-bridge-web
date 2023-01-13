import {BorderedTableCell} from '@components/widgets/StyledComponents'
import {TableHead, TableRow} from '@mui/material'
import {theme} from '@style/theme'

const TableHeader: React.FunctionComponent<{
  unitWidth: number

  prefixColumns: [React.ReactNode, number][]
}> = ({unitWidth, prefixColumns}) => {
  return (
    <TableHead
      sx={{
        width: '100%',
        backgroundColor: '#F1F3F5',
        borderTop: '1px solid #EAECEE',
        borderRight: '1px solid #EAECEE',
        height: '50px',
      }}>
      <TableRow>
        {prefixColumns.map(([column, width]) => (
          <BorderedTableCell
            sx={{
              padding: theme.spacing(0, 2),
              width: `${width}px`,
              textAlign: 'center',
            }}>
            <strong>{column}</strong>
          </BorderedTableCell>
        ))}

        {[...new Array(7)].map((_i, index) => (
          <BorderedTableCell
            key={`day_number_${index}`}
            sx={{
              textAlign: 'center',
              width: `${unitWidth}px`,
            }}>
            {index + 1}
          </BorderedTableCell>
        ))}
        <BorderedTableCell sx={{padding: theme.spacing(0, 2), textAlign: 'center'}}>
          <strong>Adherence</strong>
        </BorderedTableCell>
      </TableRow>
    </TableHead>
  )
}

export default TableHeader
