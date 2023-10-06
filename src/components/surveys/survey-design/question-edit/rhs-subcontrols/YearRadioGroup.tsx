import {SimpleTextInput, SimpleTextLabel} from '@components/widgets/StyledComponents'
import {Box, FormControl, FormControlLabel, Radio, RadioGroup} from '@mui/material'
import {theme} from '@style/theme'
import React from 'react'

export type YearFormatType = 'ANY' | 'CURRENT' | 'SET'

const capitalizeFirstLetter = (val: string) => {
  return `${val.charAt(0).toUpperCase()}${val.substring(1)}`
}

type YearRadioGroupProps = {
  type: 'min' | 'max'
  yearFormat: YearFormatType
  yearValue: number | undefined
  hasError: boolean
  onChange: (yearFormat: YearFormatType, yearValue: number | undefined) => void
}

const YearRadioGroup: React.FunctionComponent<YearRadioGroupProps> = ({
  type,
  yearFormat,
  yearValue,
  hasError,
  onChange,
}) => {
  const id = `${type}YearGroup`
  const CONFIG = {
    min: {
      tense: 'past',
      yearLabel: 'Minimum Year',
    },
    max: {
      tense: 'future',
      yearLabel: 'Maximum Year',
    },
  }

  const inlineInput = (
    <Box display="flex" alignItems="center">
      {`Set ${capitalizeFirstLetter(type)} Value`}
      <SimpleTextInput
        sx={{width: '80px', ml: '12px'}}
        id={`${type}YearValue`}
        error={hasError}
        value={yearValue ?? ''}
        type="number"
        disabled={yearValue === undefined}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          onChange(yearFormat, parseInt(e.target.value))
        }}
      />
    </Box>
  )

  return (
    <>
      <FormControl fullWidth sx={{marginTop: 2}} error={hasError}>
        <SimpleTextLabel id={id} sx={{marginBottom: 1}}>{`${CONFIG[type].yearLabel}`}</SimpleTextLabel>
        <RadioGroup
          aria-labelledby={id}
          id={`${type}YearFormat`}
          value={yearFormat}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value as YearFormatType, yearValue)
          }}>
          <FormControlLabel
            value="ANY"
            sx={{mt: theme.spacing(1.5), alignItems: 'center'}}
            control={<Radio />}
            label={`Allow anytime in the ${CONFIG[type].tense}`}
          />
          <FormControlLabel value="CURRENT" sx={{alignItems: 'center'}} control={<Radio />} label={'Current Year'} />
          <FormControlLabel value="SET" sx={{alignItems: 'center'}} control={<Radio />} label={inlineInput} />
        </RadioGroup>
      </FormControl>
    </>
  )
}

export default YearRadioGroup
