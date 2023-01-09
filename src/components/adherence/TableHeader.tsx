import {Box} from '@mui/material'
import {theme} from '@style/theme'

const TableHeader: React.FunctionComponent<{
  unitWidth: number

  prefixColumns: [React.ReactNode, number][]
}> = ({unitWidth, prefixColumns}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        backgroundColor: '#F1F3F5',
        borderTop: '1px solid #EAECEE',
        borderRight: '1px solid #EAECEE',
        height: '50px',
      }}>
      {prefixColumns.map(([column, width]) => (
        <Box
          sx={{
            padding: theme.spacing(0, 2),
            width: `${width}px`,
            display: 'flex',
            flexShrink: 0,
            alignItems: 'center',
          }}>
          <strong>{column}</strong>
        </Box>
      ))}

      {[...new Array(7)].map((_i, index) => (
        <Box
          key={`day_number_${index}`}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: `${unitWidth}px`,

            borderLeft: '1px solid #EAECEE',
          }}>
          {index + 1}
        </Box>
      ))}
      <Box sx={{padding: theme.spacing(0, 2), flexGrow: 1, display: 'flex', alignItems: 'center'}}>
        <strong>Adherence</strong>
      </Box>
    </Box>
  )
}

export default TableHeader
