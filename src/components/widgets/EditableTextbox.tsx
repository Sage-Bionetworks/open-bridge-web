import makeStyles from '@mui/styles/makeStyles'
import {ThemeType} from '@style/theme'
import React, {FunctionComponent, useEffect, useRef, useState} from 'react'

interface StyleProps {
  padding?: string
}

const useStyles = makeStyles<ThemeType, StyleProps>(theme => ({
  wrapper: props => ({
    marginRight: theme.spacing(1),

    borderRadius: '5px',
    padding: '8px',
    ...props,

    '&:hover': {
      border: `1px solid ${theme.palette.divider}`,
      // padding: '8px',
      //  ...props,
    },
  }),
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
  styleProps?: StyleProps
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
  styleProps,
  ...props
}) => {
  const [isEditing, setEditing] = useState(false)

  const classes = useStyles(styleProps || {})

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
        <div
          className={classes.wrapper}
          onClick={e => {
            setEditing(true)
            e.stopPropagation()
          }}>
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
  maxCharacters?: number
  styleProps?: StyleProps
}

const EditableTextbox: FunctionComponent<EditableTextboxProps> = ({
  initValue,
  onTriggerUpdate,
  maxCharacters,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [newValue, setNewValue] = React.useState('')
  React.useEffect(() => {
    setNewValue(initValue)
  }, [initValue])

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
        maxLength={maxCharacters ? maxCharacters : Infinity}
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
