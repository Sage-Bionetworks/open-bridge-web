import Alert_Icon from '../../assets/scheduler/white_alert_icon.svg'
import SaveIcon from '../../assets/save_icon.svg'
import NoEditIcon from '../../assets/no_edit_icon.svg'

const bannerMap = new Map<
  string,
  {
    bgColor: string
    displayText: string[]
    icon: string[]
    textColor: string
    type: string
  }
>()

bannerMap.set('error', {
  bgColor: '#EE6070',
  displayText: ['The following fields are required to launch your study.'],
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
bannerMap.set('live', {
  bgColor: '#2196F3',
  displayText: [
    'This page is view only. We currently don’t support scheduling related editing of lives studies. To make adjustments to your study, create a duplicate of this study and launch again.',
    'You may edit this page.',
  ],
  icon: [NoEditIcon],
  textColor: 'white',
  type: 'live',
})
bannerMap.set('completed', {
  bgColor: '#EE6352',
  displayText: ['The study is officially closed and cannot be edited.'],
  icon: [NoEditIcon],
  textColor: 'white',
  type: 'completed',
})
bannerMap.set('withdrawn', {
  bgColor: '#AA00FF',
  displayText: ['The study was cancelled and cannot be edited.'],
  icon: [NoEditIcon],
  textColor: 'white',
  type: 'withdrawn',
})

const bannerInfo = {
  bannerMap: bannerMap,
}

export default bannerInfo
