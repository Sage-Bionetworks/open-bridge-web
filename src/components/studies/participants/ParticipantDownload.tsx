import { Box, Button, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles(theme => ({
  downloadButton: {
    marginBottom: theme.spacing(0),
  },
}))

export type ParticipantDownloadType = 'ALL' | 'SELECTED'

type ParticipantDownloadProps = {
  onDownload: Function
  onDone: Function
  hasItems: boolean
  selectedLength: number
  isProcessing?: boolean
  fileDownloadUrl?: string
}

const ParticipantDownload: React.FunctionComponent<ParticipantDownloadProps> =
  ({
    onDownload,
    isProcessing,
    fileDownloadUrl,
    hasItems,
    selectedLength,
    onDone,
  }) => {
    const classes = useStyles()

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

    return (
      <Box display="flex" alignItems="center">
        <Button
          disabled={!hasItems || selectedLength === 0}
          onClick={() => onDownload()}
        >
          {' '}
          {!isProcessing ? 'Download' : <CircularProgress size={24} />}
        </Button>
      </Box>
    )
  }

export default ParticipantDownload
