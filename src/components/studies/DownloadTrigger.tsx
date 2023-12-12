import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone'
import {Button} from '@mui/material'
import React from 'react'

type DownloadTriggerProps = {
  onDownload: Function
  onDone: Function
  hasItems: boolean
  fileDownloadUrl?: string
  fileLabel?: string
  children?: React.ReactNode
  hasImage?: boolean
}

const DownloadTrigger: React.FunctionComponent<DownloadTriggerProps> = ({
  onDownload,
  fileDownloadUrl,
  hasItems,
  fileLabel,
  onDone,
  hasImage,
  children,
}) => {
  function magicDownload() {
    // create hidden link
    const element = document.createElement('a')
    document.body.appendChild(element)
    element.setAttribute('href', fileDownloadUrl!)
    // const downloadName = fileLabel ?? new URL(fileDownloadUrl!).pathname.split('/').pop();
    if (fileLabel) {
      element.setAttribute('download', fileLabel)
    } 
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

export default DownloadTrigger
