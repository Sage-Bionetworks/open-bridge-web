import {makeStyles} from '@material-ui/core'
import React, {FunctionComponent, useEffect, useRef, useState} from 'react'
const useStyles = makeStyles(theme => ({
  wrapper: {
    marginRight: theme.spacing(2),

    borderRadius: '5px',

    '&:hover': {
      border: `1px solid ${theme.palette.divider}`,
      padding: '8px',
    },
  },
}))

type EditableProps = {
  text: string
  type: string
  placeholder: string
  component?: React.ElementType
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
  component: WrapperElement = 'span',
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
    const {key} = event
    const keys = ['Escape', 'Tab']
    const enterKey = 'Enter'
    const allKeys = [...keys, enterKey]
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
    <div {...props}>
      {isEditing ? (
        <div
          onBlur={() => setEditing(false)}
          onKeyDown={e => handleKeyDown(e, type)}>
          {children}
        </div>
      ) : (
        <div className={classes.wrapper} onClick={() => setEditing(true)}>
          <WrapperElement style={{margin: 0}}>
            {text || placeholder || ' '}
          </WrapperElement>
        </div>
      )}
    </div>
  )
}

type EditableTextboxProps = {
  initValue: string
  onTriggerUpdate: Function
  component?: React.ElementType
  shouldLimitCharacters?: boolean
}

const EditableTextbox: FunctionComponent<EditableTextboxProps> = ({
  initValue,
  onTriggerUpdate,
  shouldLimitCharacters,
  ...rest
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
      {...rest}>
      <input
        maxLength={shouldLimitCharacters ? 18 : Infinity}
        ref={inputRef}
        type="text"
        name="task"
        placeholder={initValue}
        value={newValue}
        style={{width: '100%', padding: '8px'}}
        onBlur={e => {
          if (newValue) {
            onTriggerUpdate(newValue)
          }
        }}
        onChange={e => {
          setNewValue(e.target.value)
        }}
      />
    </Editable>
  )
}

export default EditableTextbox
