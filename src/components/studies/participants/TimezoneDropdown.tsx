import moment from 'moment-timezone'
import React from 'react'
import BlackBorderDropdown from '../../widgets/BlackBorderDropdown'

type TimezoneInfoType = {
  label: string
  value: string
}

const TimezoneDropdown: React.FunctionComponent<{
  currentValue: string
  onValueChange: (val: string) => void
}> = ({currentValue, onValueChange}) => {
  function getAllTimezones() {
    const timezoneNames = moment.tz.names()
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
      searchableOnChange={onValueChange}
      emptyValueLabel="Select a timezone"
      value={currentValue === '-' ? '' : currentValue}
      itemHeight="48px"
      isSearchable={true}
      onChange={e => onValueChange(e.target.value as string)}
      searchableDescription={'Participant Time Zone'}
    />
  )
}

export default TimezoneDropdown
