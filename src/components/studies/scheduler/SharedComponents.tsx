import DeleteIcon from '@mui/icons-material/Close'
import {Box, IconButton, Typography} from '@mui/material'
import {theme} from '@style/theme'

export const StyledSmallSectionHeader: React.FunctionComponent<{onClick: () => void; title: string}> = ({
  onClick,
  title,
}) => (
  <Box
    sx={{
      position: 'relative',
      height: theme.spacing(3),
      backgroundColor: '#FBFBFC',
      padding: theme.spacing(0.5, 1),
    }}>
    <Typography sx={{ontWeight: 400, fontSize: '12px', color: '#878E95'}}>{title} </Typography>
    <IconButton
      aria-label="delete-button"
      style={{position: 'absolute', top: '-4px', right: '-2px'}}
      edge="end"
      size="small"
      onClick={onClick}>
      <DeleteIcon></DeleteIcon>
    </IconButton>
  </Box>
)
