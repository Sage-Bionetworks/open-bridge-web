
import ParticipantAdherenceContentShell from '@components/widgets/ParticipantAdherenceContentShell'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {Box, CircularProgress} from '@mui/material'
import Alert from '@mui/material/Alert'
import StudyService from '@services/study.service'
import {useStudy} from '@services/studyHooks'
import {theme} from '@style/theme'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import StudyBuilderHeader from '../StudyBuilderHeader'
import DownloadTrigger from '../DownloadTrigger'

/*** main component */

type StudyDataOwnProps = {
  title?: string
  paragraph?: string
  studyId?: string
}

type StudyDataProps = StudyDataOwnProps & RouteComponentProps

const StudyData: FunctionComponent<StudyDataProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  const {token} = useUserSessionDataState()
  const {data: study, isLoading: isStudyLoading} = useStudy(studyId)

  const [loadingIndicators, setLoadingIndicators] = React.useState<{
    isDeleting?: boolean
    isDownloading?: boolean
  }>({})

  const [error, setError] = React.useState<Error>()
  const [fileDownloadUrl, setFileDownloadUrl] = React.useState<string | undefined>(undefined)
  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const [count, setCount] = React.useState<number>(0)

  if (!study) {
    return isStudyLoading ? (
      <Box mx="auto" my={5} textAlign="center">
        <CircularProgress />
      </Box>
    ) : (
      <></>
    )
  }

  const downloadScores = async () => {
    setLoadingIndicators({isDownloading: true})
    try {
      // Request a job guid to start building the table
      const jobGuid = await StudyService.startUploadTableJob(studyId, token!)
      let keepGoing = true
      while (keepGoing) {
        const job = await StudyService.getUploadTableJobStatus(studyId, jobGuid, token!)
        if (job.status === 'in_progress') {
            // If the job is still in progress, then increment the count and wait for 1 second before trying again
            setCount(count + 1)
            await sleep(1000)
        } else {
          // Whether successful or not, the job has ended - stop trying
          keepGoing = false
          if (job.status === 'succeeded' && job.url) {
            // If the job succeeded and it has a non-null url, then set the URL
            console.log(`Job successful: ${job.url!}`)
            setFileDownloadUrl(job.url)
          } else {
            throw Error(`Failed to build CVS scores tables. Try again later.`)
          }
        }
      }
    } catch (error) {
      setError(error as Error)
    } finally {
      setLoadingIndicators({isDownloading: false})
    }
  }

  return (
    <Box id="StudyData">
      <StudyBuilderHeader study={study} />
          <ParticipantAdherenceContentShell title="Study Data">
            <DownloadTrigger
                hasImage={true}
                onDownload={() => downloadScores() }
                fileDownloadUrl={fileDownloadUrl}
                hasItems={true}
                onDone={() => {
                  URL.revokeObjectURL(fileDownloadUrl!)
                  setFileDownloadUrl(undefined)
                }}>
                  {!loadingIndicators.isDownloading ? 'Assessment Scores and Survey Answers' : 
                    <><CircularProgress size={24} />{` Building CSV files... [${count}]`}</>}
              </DownloadTrigger> 
          </ParticipantAdherenceContentShell>
          <Box sx={{backgroundColor: '#fff', padding: theme.spacing(0)}}>
          {error && (
                      <Alert color="error" onClose={() => setError(undefined)}>
                        {error.message}
                      </Alert>
                    )}
          </Box>
    </Box>
  )
}

export default StudyData
