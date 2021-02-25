import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  pageBoxSurrounding: {
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '25px',
    width: '25px',
    minWidth: '0px',
    borderRadius: '0px',
  },
  withBlackBorder: {
    border: `1px solid black`,
  },
  withGrayBorder: {
    border: `1px solid ${theme.palette.background.default}`,
  },
}))

type PageBoxProps = {
  isSelected: boolean
  pageNumber: number
  onPageSelected: Function
}

const PageBox: React.FunctionComponent<PageBoxProps> = ({
  isSelected,
  pageNumber,
  onPageSelected,
}) => {
  const classes = useStyles()
  return (
    <Button
      className={`${classes.pageBoxSurrounding} ${
        isSelected ? classes.withBlackBorder : classes.withGrayBorder
      }`}
      onClick={() => onPageSelected(pageNumber)}
    >
      {pageNumber}
    </Button>
  )
}

export default PageBox
