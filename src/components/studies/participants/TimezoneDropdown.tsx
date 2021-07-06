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
    // For now, only include timezones that are in the America and Mexico timezones.
    const filtered = timezoneNames.filter(
      el => el.includes('America') || el.includes('Mexico')
    )
    const timezoneInfoArray: TimezoneInfoType[] = filtered.map(data => {
      const utcOffset = moment().tz(data).format('Z')
      const timezoneAbbreviation = moment().tz(data).format('z')
      return {
        label: `UTC(${utcOffset}) ${data} ${
          timezoneAbbreviation.startsWith('-') ? '' : timezoneAbbreviation
        }`,
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
      value={currentValue}
      itemHeight="48px"
      isSearchable={true}
      onChange={() => {}}
    />
  )
}

export default TimezoneDropdown
