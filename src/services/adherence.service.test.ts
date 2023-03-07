import { AdherenceAlertCategory } from "@typedefs/types"
import AdherenceService from "./adherence.service"

const studyId = 'hprczm'
const categories = [
  'low_adherence',
  'new_enrollment',
  'study_burst_change',
  'timeline_accessed',
  'upcoming_study_burst',
] as AdherenceAlertCategory[]
const pageSize = 0
const currentPage = 25
const token = "token1234"
const alertIds = ["alert1234", "alert5678"]

describe('adherence.service', () => {
  describe('getAdherenceAlerts', () => {
    test('should get all alerts when all categories provided', async () => {
      const result = await AdherenceService.getAdherenceAlerts(
        studyId, categories, pageSize, currentPage, token
      )

      expect(result.total).toEqual(result.items.length)

      const alertTimelineAccessed = result.items[0]
      expect(alertTimelineAccessed.category).toBe('timeline_accessed')
      expect(alertTimelineAccessed.data).toBeNull()

      const alertLowAdherence = result.items[1]
      expect(alertLowAdherence.category).toBe('low_adherence')
      expect(alertLowAdherence.data?.adherenceThreshold).toBe("50")
    })
    test('should get all alerts when no categories provided', async () => {
      const result = await AdherenceService.getAdherenceAlerts(
        studyId, [], pageSize, currentPage, token
      )
      expect(result.total).toEqual(result.items.length)
    })
  })
  describe('updateAdherenceAlerts', () => {
    test('should call service correctly when marking alerts as read', async () => {
      const result = await AdherenceService.updateAdherenceAlerts(
        studyId, alertIds, 'READ', token
      )
      expect(result.data.message).toBe('Alerts successfully marked as read')
    })
    test('should call service correctly when marking alerts as unread', async () => {
      const result = await AdherenceService.updateAdherenceAlerts(
        studyId, alertIds, 'UNREAD', token
      )
      expect(result.data.message).toBe('Alerts successfully marked as unread')
    })
    test('should call service correctly when deleting alerts', async () => {
      const result = await AdherenceService.updateAdherenceAlerts(
        studyId, alertIds, 'DELETE', token
      )
      expect(result.data.message).toBe('Alerts successfully deleted')
    })
  })
})
