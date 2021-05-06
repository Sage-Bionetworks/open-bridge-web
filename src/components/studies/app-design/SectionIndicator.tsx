import React from 'react'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  container: {
    width: '38px',
    height: '38px',
    borderRadius: '18px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    backgroundColor: 'black',
    fontWeight: 'bold',
    fontSize: '16px',
  },
}))

type SectionIndicatorProps = {
  index: Number
  className?: string
}

const SectionIndicator: React.FunctionComponent<SectionIndicatorProps> = ({
  index,
  className,
}) => {
  const classes = useStyles()
  return (
    <div className={clsx(classes.container, className && className)}>
      {index}
    </div>
  )
}

export default SectionIndicator
