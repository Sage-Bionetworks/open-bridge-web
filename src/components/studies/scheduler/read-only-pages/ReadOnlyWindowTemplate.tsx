import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone'
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone'
import {Box, Paper} from '@mui/material'
import {theme} from '@style/theme'

const ReadOnlyWindowTemplate: React.FunctionComponent<{title: string; type: 'SESSION' | 'NOTIFICATION'}> = ({
  title,
  type,
  children,
}) => {
  return (
    <Paper elevation={2}>
      <Box
        sx={{
          height: '25px',
          backgroundColor: '#FBFBFC',
          position: 'relative',
          fontWeight: '400',
          fontSize: '12px',
          color: '#878E95',
          padding: '5px 10px',
          '& svg': {
            position: 'absolute',
            right: '10px',
            top: '3px',
          },
        }}>
        {title}
        {type === 'SESSION' ? <AccessTimeTwoToneIcon /> : <NotificationsNoneTwoToneIcon />}{' '}
      </Box>
      <Box sx={{padding: theme.spacing(2, 10)}}>{children}</Box>
    </Paper>
  )
}

export default ReadOnlyWindowTemplate
