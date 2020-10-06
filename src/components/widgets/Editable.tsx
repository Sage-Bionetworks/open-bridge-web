import { makeStyles } from '@material-ui/core'
import React, { useState, useEffect, FunctionComponent } from 'react'

const useStyles = makeStyles(theme => ({
  wrapper: {
    width: '100%',
    borderRadius: '5px',

    '&:hover': {
      border: `1px solid ${theme.palette.divider}`,
    },
  },
}))

type EditableProps = {
  text: string
  type: string
  placeholder: string
  children: React.ReactNode
  childRef: React.MutableRefObject<any>
  onReset: Function
  onTriggerUpdate: Function
}

const Editable: FunctionComponent<EditableProps> = ({
  text,
  type,
  placeholder,
  children,
  childRef,
  onReset,
  onTriggerUpdate,
  ...props
}) => {
  const [isEditing, setEditing] = useState(false)
  const classes = useStyles()

  useEffect(() => {
    if (childRef && childRef.current && isEditing === true) {
      childRef.current.focus()
    }
  }, [isEditing, childRef])

  const handleKeyDown = (event: React.KeyboardEvent, type: string) => {
    const { key } = event
    const keys = ['Escape', 'Tab']
    const enterKey = 'Enter'
    const allKeys = [...keys, enterKey]
    console.log(key)
    if (key === 'Escape') {
      onReset()
    }
    if (key === 'Tab' || key === enterKey) {
      onTriggerUpdate()
    }
    if (
      (type === 'textarea' && keys.indexOf(key) > -1) ||
      (type !== 'textarea' && allKeys.indexOf(key) > -1)
    ) {
      setEditing(false)
    }
  }

  return (
    <section {...props}>
      {isEditing ? (
        <div
          onBlur={() => setEditing(false)}
          onKeyDown={e => handleKeyDown(e, type)}
        >
          {children}
        </div>
      ) : (
        <div className={classes.wrapper} onClick={() => setEditing(true)}>
          <span className={`${text ? 'text-black' : 'text-gray-500'}`}>
            {text || placeholder || 'Editable content'}
          </span>
        </div>
      )}
    </section>
  )
}

export default Editable
