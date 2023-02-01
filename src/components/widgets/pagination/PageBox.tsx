import {Button} from '@mui/material'
import {theme} from '@style/theme'
import React from 'react'

type PageBoxProps = {
  isSelected: boolean
  pageNumber: number
  onPageSelected: Function
  index: number
}

const PageBox: React.FunctionComponent<PageBoxProps> = ({isSelected, pageNumber, onPageSelected, index}) => {
  return (
    <Button
      sx={{
        display: 'inline-block',
        height: '25px',
        marginRight: '5px',
        borderBottom: isSelected ? `1px solid ${theme.palette.primary.main}` : 'none',
        color: isSelected ? theme.palette.primary.main : '#515359',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'none',
          borderBottom: `1px solid ${theme.palette.primary.main}`,
        },
      }}
      id={`pagebox-button-${index}`}
      onClick={() => onPageSelected(pageNumber - 1)}>
      {pageNumber}
    </Button>
  )
}

export default PageBox
