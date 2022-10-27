import BlackBorderDropdown from '@components/widgets/BlackBorderDropdown'
import timezoneList from '@helpers/timezones.json'
import React from 'react'

type TimezoneInfoType = {
  label: string
  value: string
}

const TimezoneDropdown: React.FunctionComponent<{
  currentValue: string
  isRequired?: boolean
  onValueChange: (val: string) => void
}> = ({currentValue, onValueChange, isRequired}) => {
  function getAllTimezones() {
    const timezoneNames = timezoneList.timezones as string[]
    const filtered = timezoneNames.filter(el => el.includes('America'))
    const timezoneInfoArray: TimezoneInfoType[] = filtered.map(data => {
      return {
        label: data,
        value: data,
      }
    })
    return timezoneInfoArray
  }
  const timezones = React.useMemo(getAllTimezones, [])
  return (
    <BlackBorderDropdown
      width="100%"
      dropdown={timezones}
      isRequired={isRequired}
      searchableOnChange={onValueChange}
      emptyValueLabel="Select a timezone"
      value={currentValue === '-' ? '' : currentValue}
      itemHeight="48px"
      isSearchable={true}
      onChange={e => onValueChange(e.target.value as string)}
      controlLabel={'Participant Time Zone'}
    />
  )
}

export default TimezoneDropdown
