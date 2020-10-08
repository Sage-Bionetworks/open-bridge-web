import { makeStyles } from '@material-ui/core'
import React, { useState, useEffect, FunctionComponent, useRef } from 'react'
import clsx from 'clsx'


const useStyles = makeStyles(theme => ({
    wrapper: {
      width: '100%',
      borderRadius: '5px',
  
      '&:hover': {
        border: `1px solid ${theme.palette.divider}`,
      },
    }

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
  
  export const Editable: FunctionComponent<EditableProps> = ({
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
            <span>
              {text || placeholder || 'blah'}
            </span>
          </div>
        )}
      </section>
    )
  }







type EditableTextboxProps = {
  initValue: string
  onTriggerUpdate: Function
}

const EditableTextbox: FunctionComponent<EditableTextboxProps> = ({
  initValue,
  onTriggerUpdate,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [newValue, setNewValue] = React.useState('')

  return (
    <Editable
      text={newValue}
      placeholder={initValue}
      childRef={inputRef}
      onReset={() => setNewValue(initValue)}
      onTriggerUpdate={() => onTriggerUpdate(newValue)}
      type="input"
    >
      <input
        ref={inputRef}
        type="text"
        name="task"
        placeholder={initValue}
        value={newValue}
        style={{width: '100%'}}
        onBlur={e => {
          if(newValue) {onTriggerUpdate(newValue)}
        }}
        onChange={e => {
          setNewValue(e.target.value)
        }}
      />
    </Editable>
  )
}

export default EditableTextbox
