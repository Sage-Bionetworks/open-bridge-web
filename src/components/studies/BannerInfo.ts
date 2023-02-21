import SaveIcon from '../../assets/save_icon.svg'
import Alert_Icon from '../../assets/scheduler/white_alert_icon.svg'

export type BannerInfoType = {
  bgColor: string
  displayText: string[]
  icon: string[]
  textColor: string
  type: 'success' | 'error'
}

const bannerMap = new Map<'success' | 'error', BannerInfoType>()

bannerMap.set('error', {
  bgColor: '#EE6070',
  displayText: ['Please review the following errors before continuing.'],
  icon: [Alert_Icon],
  textColor: 'white',
  type: 'error',
})
bannerMap.set('success', {
  bgColor: '#AEDCC9',
  displayText: ['Page has been saved successfully.'],
  icon: [SaveIcon],
  textColor: 'black',
  type: 'success',
})

const bannerInfo = {
  bannerMap: bannerMap,
}

export default bannerInfo
