import {DisplayStudyPhase} from '@typedefs/types'
import NoEditIcon from '../../assets/no_edit_icon.svg'
import SaveIcon from '../../assets/save_icon.svg'
import Alert_Icon from '../../assets/scheduler/white_alert_icon.svg'

export type BannerInfoType = {
  bgColor: string
  displayText: string[]
  icon: string[]
  textColor: string
  type: DisplayStudyPhase | 'success' | 'error'
}

const bannerMap = new Map<
  DisplayStudyPhase | 'success' | 'error',
  BannerInfoType
>()

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

bannerMap.set('LIVE', {
  bgColor: '#2196F3',
  displayText: [
    'This page is view only. We currently don’t support scheduling related editing of lives studies. To make adjustments to your study, create a duplicate of this study and launch again.',
    'You may edit this page.',
  ],
  icon: [NoEditIcon],
  textColor: 'white',
  type: 'LIVE',
})

bannerMap.set('COMPLETED', {
  bgColor: '#EE6352',
  displayText: ['The study is officially closed and cannot be edited.'],
  icon: [NoEditIcon],
  textColor: 'white',
  type: 'COMPLETED',
})
bannerMap.set('WITHDRAWN', {
  bgColor: '#AA00FF',
  displayText: ['The study was cancelled and cannot be edited.'],
  icon: [NoEditIcon],
  textColor: 'white',
  type: 'WITHDRAWN',
})

const bannerInfo = {
  bannerMap: bannerMap,
}

export default bannerInfo
