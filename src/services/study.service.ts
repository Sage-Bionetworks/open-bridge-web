import {Schedule} from '@typedefs/scheduling'
import Utility from '../helpers/utility'
import constants from '../types/constants'
import {
  DisplayStudyPhase,
  ExtendedError,
  FileRevision,
  Study,
  StudyPhase,
} from '../types/types'
import ScheduleService from './schedule.service'

const StudyService = {
  editStudyLogo,
  getDefaultClientData,
  getDisplayStatusForStudyPhase,
  getStudies,
  getStudy,
  isStudyInDesign,
  isStudyClosedToEdits,
  createStudy,
  copyStudy,
  launchStudy,
  removeStudy,
  renameStudy,
  updateStudy,
  completeStudy,
  withdrawStudy,
}

function getDisplayStatusForStudyPhase(phase: StudyPhase): DisplayStudyPhase {
  switch (phase) {
    case 'design':
      return 'DRAFT'
    case 'in_flight':
    case 'recruitment':
      return 'LIVE'
    case 'completed':
    case 'analysis':
      return 'COMPLETED'
    default:
      return 'WITHDRAWN'
  }
}

function getDefaultClientData() {
  return {
    welcomeScreenData: {
      welcomeScreenHeader: '',
      welcomeScreenBody: '',
      welcomeScreenFromText: '',
      welcomeScreenSalutation: '',
      useOptionalDisclaimer: true,
      isUsingDefaultMessage: true,
    },
  }
}

function isStudyInDesign(study: Study) {
  return study.phase === 'design'
}

function isStudyClosedToEdits(study: Study) {
  return (
    study.phase !== 'design' &&
    study.phase !== 'recruitment' &&
    study.phase !== 'in_flight'
  )
}

async function editStudyLogo(
  studyId: string,
  token: string,
  fileSize: number,
  fileName: string,
  fileBody: string,
  mimeType: string,
  file: File
): Promise<Study> {
  try {
    // upload to the backend
    const uploadToBackendEndpoint = `${constants.endpoints.studies}/${studyId}/logo`
    const bodyForUploadBackendEndpoint: FileRevision = {
      name: fileName,
      mimeType: mimeType,
      size: fileSize,
      fileGuid: fileBody,
    }
    const uploadResult = await Utility.callEndpoint<FileRevision>(
      uploadToBackendEndpoint,
      'POST',
      bodyForUploadBackendEndpoint,
      token
    )
    const uploadData = uploadResult.data
    // upload to aws
    let headers: HeadersInit = new Headers()
    headers.set('Content-Type', mimeType)
    headers.set('Content-Disposition', 'inline')
    const config = {
      method: 'PUT',
      headers,
      body: file,
    }
    const uploadURL = uploadData.uploadURL!
    await fetch(uploadURL, config)
    // Tell the backend that we have successfully finished uploading file to aws
    const successfulUploadEndpoint = `${constants.endpoints.studies}/${studyId}/logo/${uploadData.createdOn}`
    const successfulUploadResponse = await Utility.callEndpoint<Study>(
      successfulUploadEndpoint,
      'POST',
      {},
      token
    )
    return successfulUploadResponse.data
  } catch (error) {
    throw error
  }
}

async function getStudies(
  token: string,
  pageSize?: number,
  offsetBy?: number
): Promise<{items: Study[]; total: number}> {
  if (!pageSize) {
    return Utility.getAllPages<Study>(getStudies, [token])
  }
  const studies = await Utility.callEndpoint<{items: Study[]; total: number}>(
    constants.endpoints.studies,
    'GET',
    {pageSize: pageSize, offsetBy: offsetBy},
    token
  )

  return {items: studies.data.items, total: studies.data.total}
}

async function getStudy(id: string, token: string): Promise<Study | undefined> {
  const response = await Utility.callEndpoint<Study>(
    constants.endpoints.study.replace(':id', id),
    'GET',
    {},
    token
  )
  const study = response.data
  if (!study.clientData) {
    study.clientData = getDefaultClientData()
  }
  return study
}

async function createStudy(study: Study, token: string): Promise<number> {
  const newVersion = await Utility.callEndpoint<{version: number}>(
    constants.endpoints.study.replace(':id', ''),
    'POST', // once we add things to the study -- we can change this to actual object
    study,
    token
  )

  return newVersion.data.version
}

async function renameStudy(
  studyId: string,
  newName: string,
  token: string
): Promise<Study> {
  const study = await getStudy(studyId, token)
  if (!study) {
    throw new Error('No study found')
  }
  study.name = newName
  await updateStudy(study, token)
  return study
}

async function copyStudy(
  studyId: string,
  appId: string,
  token: string
): Promise<{study: Study; schedule?: Schedule}> {
  // get original study
  const studyToCopy = await getStudy(studyId, token)
  if (!studyToCopy) {
    throw Error('No matching study found')
  }

  let scheduleToCopy = undefined
  try {
    scheduleToCopy = await ScheduleService.getSchedule(
      studyToCopy.identifier,
      appId,
      token!
    )
  } catch (error) {
    console.log(error, 'no schedule')
  } //dont' do anything . no schedule
  const newStudyId = Utility.generateNonambiguousCode(6, 'CONSONANTS')
  const newStudy = {
    ...studyToCopy,
    identifier: newStudyId,
    version: 1,
    name: `Copy of ${studyToCopy.name}`,
    phase: 'design' as StudyPhase,
    createdOn: new Date(),
    modifiedOn: new Date(),
  }
  //@ts-ignore
  delete newStudy.scheduleGuid

  await createStudy(newStudy, token)
  let copiedSchedule
  if (scheduleToCopy) {
    copiedSchedule = {
      duration: scheduleToCopy.duration,
      guid: '',
      name: newStudyId + 'test',
      sessions: scheduleToCopy.sessions.map(s => ({...s, guid: undefined})),
      studyBursts: scheduleToCopy.studyBursts
        ? [...scheduleToCopy.studyBursts]
        : [],
    }

    copiedSchedule = await ScheduleService.createSchedule(
      newStudyId,
      copiedSchedule,
      token!
    )
  }
  return {study: newStudy, schedule: copiedSchedule}
}

async function updateStudy(study: Study, token: string): Promise<number> {
  try {
    const result = await Utility.callEndpoint<{version: number}>(
      constants.endpoints.study.replace(':id', study.identifier),
      'POST',
      study,
      token
    )
    return result.data.version
  } catch (error) {
    //we might need to retry if there is a verison mismatch
    if ((error as ExtendedError).statusCode === 409) {
      console.log('409')
      const updatedStudy = await getStudy(study.identifier, token)
      if (!updatedStudy) {
        throw new Error('No study')
      }
      study.version = updatedStudy.version
      return updateStudy(study, token)
    } else {
      throw error
    }
  }
}

async function removeStudy(studyId: string, token: string): Promise<Study[]> {
  await Utility.callEndpoint<{items: Study[]}>(
    constants.endpoints.study.replace(':id', studyId),
    'DELETE',
    {},
    token
  )
  const data = await getStudies(token)
  return data.items
}

async function completeStudy(studyId: string, token: string): Promise<Study[]> {
  await Utility.callEndpoint<{items: Study[]}>(
    constants.endpoints.studyConduct.replace(':id', studyId),
    'POST',
    {},
    token
  )
  await Utility.callEndpoint<{items: Study[]}>(
    constants.endpoints.studyAnalyze.replace(':id', studyId),
    'POST',
    {},
    token
  )
  await Utility.callEndpoint<{items: Study[]}>(
    constants.endpoints.studyComplete.replace(':id', studyId),
    'POST',
    {},
    token
  )
  const data = await getStudies(token)
  return data.items
}
async function withdrawStudy(studyId: string, token: string): Promise<Study[]> {
  await Utility.callEndpoint<{items: Study[]}>(
    constants.endpoints.studyWithdraw.replace(':id', studyId),
    'POST',
    {},
    token
  )
  const data = await getStudies(token)
  return data.items
}

async function launchStudy(studyId: string, token: string): Promise<Study> {
  await Utility.callEndpoint<{items: Study[]}>(
    constants.endpoints.studyLaunch.replace(':id', studyId),
    'POST',
    {},
    token
  )
  const data = await getStudy(studyId, token)
  if (!data) {
    throw Error('No study found')
  }
  return data
}
export default StudyService
