import {HDWMEnum, Schedule, TimePeriod} from '@typedefs/scheduling'
import {StringDictionary} from '@typedefs/types'
import moment from 'moment'

export function getValueFromPeriodString(periodString: string): number {
  var numberPattern = /\d+/g
  const num = periodString.match(numberPattern)
  return num ? Number(num[0]) : 0
}
export function getUnitFromPeriodString(periodString: string): keyof typeof HDWMEnum {
  return periodString[periodString.length - 1] as keyof typeof HDWMEnum
}

// returns a string in the form "2 weeks", "7 days", ...
// we do not worry about the 'T' months vs minutes because we do not have months
export function getFormattedTimeDateFromPeriodString(periodString: string) {
  const time = getValueFromPeriodString(periodString)
  const unit = getUnitFromPeriodString(periodString)
  return time !== 1 ? `${time} ${HDWMEnum[unit]}` : `${time} ${HDWMEnum[unit].slice(0, -1)}`
}

export function getFormattedTimeDateFromTimePeriod(period: TimePeriod) {
  return `${period.value} ${HDWMEnum[period.unit]}`
}

export function getTimePeriodFromPeriodString(periodString: string): TimePeriod {
  return {
    value: getValueFromPeriodString(periodString),
    unit: getUnitFromPeriodString(periodString),
  }
}

export function getDropdownTimeItems(): StringDictionary<string> {
  const menuItems: StringDictionary<string> = {}
  const date = moment([2021, 1, 1, 8])
  menuItems[date.format('HH:mm')] = date.format('LT')

  for (let i = 0; i < 95; i++) {
    date.add(15, 'm')
    menuItems[date.format('HH:mm')] = date.format('LT')
  }
  return menuItems
}

export function isSameAsDefaultSchedule(schedule: Schedule) {
  //  undefined is the default value for schedule fields, such as delay, interval, etc...
  const nonDefaultSession = schedule.sessions.find(session => {
    const isScheduleDifferentFromDefault =
      session.delay !== undefined ||
      session.interval !== undefined ||
      session.occurrences !== undefined ||
      session.timeWindows.length !== 1
    if (isScheduleDifferentFromDefault) {
      return session
    }
    const sessionTimeWindow = session.timeWindows[0]
    if (
      sessionTimeWindow.expiration !== undefined ||
      sessionTimeWindow.startTime !== '08:00' ||
      sessionTimeWindow.persistent
    ) {
      return session
    }
    return undefined
  })
  return nonDefaultSession === undefined
}
