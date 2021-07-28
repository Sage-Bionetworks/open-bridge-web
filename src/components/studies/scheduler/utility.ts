import moment from 'moment'
import {StringDictionary} from '../../../types/types'
import {Schedule, HDWMEnum} from '../../../types/scheduling'

export function getTimeExpiredAfter(durationString: string) {
  var numberPattern = /\d+/g
  const num = durationString.match(numberPattern)
  return num ? Number(num[0]) : 0
}

// returns a string in the form "2 weeks", "7 days", ...
export function getTimeUnitFormatted(durationString: string) {
  const time = getTimeExpiredAfter(durationString)
  const unit = durationString[
    durationString.length - 1
  ] as keyof typeof HDWMEnum
  const timeUnit = HDWMEnum[unit]
  return `${time} ${timeUnit}`
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
