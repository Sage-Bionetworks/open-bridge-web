import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone'
import {Button} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
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
  hasImage?: boolean
}

const ParticipantDownloadTrigger: React.FunctionComponent<ParticipantDownloadTriggerProps> = ({
  onDownload,
  fileDownloadUrl,
  hasItems,
  fileLabel = 'StudyParticipants.csv',
  onDone,
  hasImage,
  children,
}) => {
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
    <Button
      disabled={!hasItems}
      onClick={() => onDownload()}
      startIcon={hasImage ? <DownloadTwoToneIcon /> : <></>}
      sx={{textTransform: 'none !important'}}>
      {children}
    </Button>
  )
}

export default ParticipantDownloadTrigger
