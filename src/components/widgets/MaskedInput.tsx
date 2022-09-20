import React from 'react'
import {IMaskInput} from 'react-imask'

const MASKS = {
  PHONE: '(000)000-0000',
  ID: '000-000',
}

type TextMaskProps = {
  inputRef: (ref: HTMLInputElement | null) => void
  maskType?: keyof typeof MASKS
  customMask?: (string | RegExp)[]
  placeholderChar?: string
  placeholder?: string
  onAccept: Function
}

const TextMask: React.FunctionComponent<TextMaskProps> = ({
  inputRef,
  maskType,
  customMask,
  placeholderChar = ' ',
  placeholder,
  onAccept,
  ...other
}) => {
  if (!maskType || customMask) {
    throw new Error('You must specify either mask type or a custom mask')
  }

  return (
    <IMaskInput
      {...other}
      mask={customMask || MASKS[maskType]}
      unmask={true} // true|false|'typed'
      lazy={false} // make placeholder always visible
      placeholderChar={placeholderChar} // defaults to '_'
      inputRef={(ref: any) => {
        inputRef(ref ? ref.inputElement : null)
      }} // access to nested input
      // DO NOT USE onChange TO HANDLE CHANGES!
      // USE onAccept INSTEAD
      onAccept={
        // depending on prop above first argument is
        // `value` if `unmask=false`,
        // `unmaskedValue` if `unmask=true`,s
        // `typedValue` if `unmask='typed'`
        (value: any, mask: any) => {
          onAccept(value)
        }
      }
      // ...and more mask props in a guide

      // input props also available
      placeholder={placeholder}
    />
  )
}

export default TextMask
