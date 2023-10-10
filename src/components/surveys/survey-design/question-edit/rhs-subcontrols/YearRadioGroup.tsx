import {SimpleTextInput, SimpleTextLabel} from '@components/widgets/StyledComponents'
import {Box, FormControl, FormControlLabel, Radio, RadioGroup} from '@mui/material'
import {theme} from '@style/theme'
import React from 'react'

export const DEFAULT_MIN_YEAR = 1900
export const DEFAULT_MAX_YEAR = new Date().getFullYear()

export type YearFormatType = 'ANY' | 'CURRENT' | 'SET'

const capitalizeFirstLetter = (val: string) => {
  return `${val.charAt(0).toUpperCase()}${val.substring(1)}`
}

const yearFormatToAllowValueMap: Record<YearFormatType, boolean | undefined> = {
  SET: undefined,
  ANY: true,
  CURRENT: false,
}

function yearFormatToAllowValue(yearFormat: YearFormatType) {
  return yearFormatToAllowValueMap[yearFormat]
}

function allowValueToYearFormat(allowValue: boolean | undefined): YearFormatType {
  return (
    (Object.keys(yearFormatToAllowValueMap) as YearFormatType[]).find(
      key => yearFormatToAllowValueMap[key] === allowValue
    ) || 'ANY'
  )
}

function setYearValue(yearFormat: YearFormatType, yearValue: number | undefined) {
  return yearFormat === 'SET' ? yearValue : undefined
}

type YearRadioGroupProps = {
  type: 'min' | 'max'
  allowValue: boolean | undefined
  yearValue: number | undefined
  hasError: boolean
  onChange: (allowValue: boolean | undefined, yearValue: number | undefined) => void
}

const YearRadioGroup: React.FunctionComponent<YearRadioGroupProps> = ({
  type,
  allowValue,
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
  const yearFormat: YearFormatType = allowValueToYearFormat(allowValue)
  const defaultYearValue = type === 'min' ? DEFAULT_MIN_YEAR : DEFAULT_MAX_YEAR

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
          onChange(
            yearFormatToAllowValue(yearFormat),
            setYearValue(yearFormat, parseInt(e.target.value) || defaultYearValue)
          )
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
            const newYearFormat = e.target.value as YearFormatType
            onChange(yearFormatToAllowValue(newYearFormat), setYearValue(newYearFormat, yearValue || defaultYearValue))
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
