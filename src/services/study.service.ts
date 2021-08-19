import Utility from '../helpers/utility'
import constants from '../types/constants'
import {
  DisplayStudyPhase,
  FileRevision,
  Study,
  StudyPhase,
} from '../types/types'

const StudyService = {
  editStudyLogo,
  getDisplayStatusForStudyPhase,
  getStudies,
  getStudy,
  isStudyInDesign,
  isStudyClosedToEdits,
  createStudy,
  launchStudy,
  removeStudy,
  updateStudy,
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

async function getStudies(token: string): Promise<Study[]> {
  const studies = await Utility.callEndpoint<{items: Study[]}>(
    constants.endpoints.studies,
    'GET',
    {},
    token
  )

  return studies.data.items
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
    study.clientData = {}
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
    if (error.statusCode === 409) {
      console.log('409')
      const updatedStudy = await getStudy(study.identifier, token)
      if (!updatedStudy) {
        throw 'No study'
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
  return data
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
