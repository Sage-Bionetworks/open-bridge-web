import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  pageBoxSurrounding: {
    padding: '2px 4px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
const PageBox: React.FC<{
  isSelected: boolean
  pageNumber: number
  onPageSelected: Function
}> = props => {
  const classes = useStyles()
  return (
    <div
      className={classes.pageBoxSurrounding}
      style={{
        border: `1px solid ${props.isSelected ? 'black' : 'white'}`,
      }}
      onClick={() => props.onPageSelected(props.pageNumber)}
    >
      {props.pageNumber}
    </div>
  )
}

export default PageBox
