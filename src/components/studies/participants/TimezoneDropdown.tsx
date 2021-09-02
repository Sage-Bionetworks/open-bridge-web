import React from 'react'
import SaveBlackBorderDropdown from '../../widgets/BlackBorderDropdown'
import moment from 'moment-timezone'

type TimezoneInfoType = {
  label: string
  value: string
}

const TimezoneDropdown: React.FunctionComponent<{
  currentValue: string
  onValueChange: Function
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
    <SaveBlackBorderDropdown
      width="100%"
      dropdown={timezones}
      searchableOnChange={(event: string) => onValueChange(event)}
      emptyValueLabel="Select a timezone"
      value={currentValue === '-' ? '' : currentValue}
      itemHeight="48px"
      isSearchable={true}
      onChange={() => {}}
    />
  )
}

export default TimezoneDropdown
