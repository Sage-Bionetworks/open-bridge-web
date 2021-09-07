import {Box, Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {latoFont} from '@style/theme'
import React from 'react'

const useStyles = makeStyles(theme => ({
  downloadButton: {
    marginBottom: theme.spacing(0),
  },
}))

type ParticipantDownloadTriggerProps = {
  onDownload: Function
  onDone: Function
  hasItems: boolean
  fileDownloadUrl?: string
  fileLabel?: string
  children?: React.ReactNode
}

const ParticipantDownloadTrigger: React.FunctionComponent<ParticipantDownloadTriggerProps> =
  ({
    onDownload,
    fileDownloadUrl,
    hasItems,
    fileLabel = 'StudyParticipants.csv',
    onDone,
    children,
  }) => {
    const classes = useStyles()

    function magicDownload() {
      // create hidden link
      const element = document.createElement('a')
      document.body.appendChild(element)
      element.setAttribute('href', fileDownloadUrl!)
      element.setAttribute('download', fileLabel)
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
          disabled={!hasItems}
          onClick={() => onDownload()}
          style={{fontFamily: latoFont, fontSize: '14px'}}>
          {children}
        </Button>
      </Box>
    )
  }

export default ParticipantDownloadTrigger
