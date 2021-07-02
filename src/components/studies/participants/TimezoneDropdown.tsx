import React from 'react'
import SaveBlackBorderDropdown from '../../widgets/BlackBorderDropdown'
import moment from 'moment-timezone'

type TimezoneInfoType = {
  label: string
  value: string
}

const TimezoneDropdown: React.FunctionComponent<{}> = ({}) => {
  const [currentTimeZone, setCurrentTimeZone] = React.useState('')

  function getAllTimezones() {
    const timezoneNames = moment.tz.names()
    const timezoneInfoArray: TimezoneInfoType[] = timezoneNames.map(data => {
      return {
        label: `UTC(${moment().tz(data).format('Z')}) ${data}`,
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
      onChange={event => setCurrentTimeZone(event.target.value as string)}
      emptyValueLabel="Select a timezone"
      value={currentTimeZone}
      itemHeight="44px"></SaveBlackBorderDropdown>
  )
}

export default TimezoneDropdown
