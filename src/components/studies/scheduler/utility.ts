import moment from 'moment'
import { StringDictionary } from '../../../types/types'
import { Schedule } from '../../../types/scheduling'

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
  const defaultSessionDelay = undefined
  const defaultSessionInterval = undefined
  const defaultSessionOccurences = undefined
  for (const session of schedule.sessions) {
    const sessionDelay = session.delay
    const sessionInterval = session.interval
    const sessionOccurences = session.occurrences
    const isScheduleDifferentFromDefault =
      sessionDelay !== defaultSessionDelay ||
      sessionInterval !== defaultSessionInterval ||
      sessionOccurences !== defaultSessionOccurences ||
      session.timeWindows.length !== 1
    if (isScheduleDifferentFromDefault) {
      return false
    }
    const sessionTimeWindow = session.timeWindows[0]
    if (
      sessionTimeWindow.expiration !== undefined ||
      sessionTimeWindow.startTime !== '08:00' ||
      sessionTimeWindow.persistent
    ) {
      return false
    }
  }
  return true
}
