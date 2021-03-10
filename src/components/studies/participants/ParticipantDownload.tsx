import { Box, CircularProgress, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import {
  ButtonWithSelectButton,
  ButtonWithSelectSelect
} from '../../widgets/StyledComponents'

const useStyles = makeStyles(theme => ({
  downloadButton: {
    marginBottom: theme.spacing(0),
  },
}))

export type ParticipantActivityType = 'ACTIVE' | 'WITHDRAWN'
export type ParticipantDownloadType = 'ALL' | 'SELECTED'

type ParticipantDownloadProps = {
  type: ParticipantActivityType
  selection?: ParticipantDownloadType
  onDownload: Function
  onDone: Function
  isProcessing?: boolean
  fileDownloadUrl?: string
}

const ParticipantDownload: React.FunctionComponent<ParticipantDownloadProps> = ({
  type,
  selection: _selection,
  onDownload,
  isProcessing,
  fileDownloadUrl,
  onDone,
}) => {
  const classes = useStyles()
  const [selection, setSelection] = React.useState<ParticipantDownloadType>(
    'SELECTED',
  )

  function magicDownload() {
    // create hidden link
    const element = document.createElement('a')
    document.body.appendChild(element)
    element.setAttribute('href', fileDownloadUrl!)
    element.setAttribute('download', 'StudyParticipants.csv')
    element.style.display = ''

    element.click()

    document.body.removeChild(element)
    //event.stopPropagation();
  }

  React.useEffect(() => {
    if (fileDownloadUrl) {
      console.log('download')
      magicDownload()
      setTimeout(() => onDone(), 1000)
    }
  }, [fileDownloadUrl])

  const items =
    type === 'ACTIVE'
      ? [
          { label: 'All Active Participants', value: 'ALL' },
          { label: 'Selected Participants', value: 'SELECTED' },
        ]
      : [
          { label: 'All Withdrawn Participants', value: 'ALL' },
          { label: 'Selected Participants', value: 'SELECTED' },
        ]
  return (
    <Box display="flex" alignItems="center">
      <ButtonWithSelectSelect
        key="session_select"
        value={selection}
        onChange={e => setSelection(e.target.value as ParticipantDownloadType)}
        inputProps={{ 'aria-label': 'download participants' }}
        disableUnderline={true}
      >
        {items.map(item => (
          <MenuItem value={item.value} key={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </ButtonWithSelectSelect>
      <ButtonWithSelectButton
        key="startDownload"
        variant="contained"
        onClick={() => onDownload(selection)}
        className={classes.downloadButton}
      >
        {!isProcessing ? 'Download' : <CircularProgress size={24} />}
      </ButtonWithSelectButton>
    </Box>
  )
}

export default ParticipantDownload
