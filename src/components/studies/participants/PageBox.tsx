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
}))

const PageBox: React.FC<{
  isSelected: boolean
  pageNumber: number
  onPageSelected: Function
}> = props => {
  const classes = useStyles()
  return (
    <Button
      className={classes.pageBoxSurrounding}
      style={{
        border: `1px solid ${props.isSelected ? 'black' : '#E5E5E5'}`,
      }}
      onClick={() => props.onPageSelected(props.pageNumber)}
    >
      {props.pageNumber}
    </Button>
  )
}

export default PageBox
