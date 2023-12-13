import motion from '@assets/passive-features/recorders_motion.svg'
import noise from '@assets/passive-features/recorders_noise.svg'
import weather from '@assets/passive-features/recorders_weather.svg'
import {MTBHeadingH3} from '@components/widgets/Headings'
import {
  Box,
  Container,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import StudyService from '@services/study.service'
import {useStudy, useUpdateStudyDetail} from '@services/studyHooks'
import {theme} from '@style/theme'
import {BackgroundRecorders} from '@typedefs/types'
import React from 'react'
import {BuilderWrapper} from '../StudyBuilder'

const StyledSection = styled('section', {label: 'StyledSection'})(({theme}) => ({
  background: '#FFFFFF',
  boxShadow: '0px 4px 4px #EAECEE',
  maxWidth: '1008px',

  margin: theme.spacing(2, 'auto'),
  padding: theme.spacing(5),
  display: 'flex',
  alignItems: 'center',
}))

const StyledTable = styled(Table, {label: 'StyledTable'})(({theme}) => ({
  fontSize: '14px',
  [`& .${tableCellClasses.body}`]: {
    fontSize: '16px',
    lineHeight: '20px',
    padding: theme.spacing(1, 3),
    width: '33%',
    verticalAlign: 'top',
    '&:first-of-type': {
      paddingLeft: '0',
    },
    '&:last-of-type': {
      paddingRight: '0',
    },
  },
  [`& .${tableCellClasses.head}`]: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 700,
    padding: theme.spacing(1, 3),
    '&:first-of-type': {
      paddingLeft: '0',
    },
    '&:last-of-type': {
      paddingRight: '0',
    },
  },
}))

type recorderTypeKeys = keyof BackgroundRecorders
export type RecorderInfo = {
  [K in recorderTypeKeys]: {
    value: boolean
    title: string
    description: string
    burden: string
    frequency: string
    img: string
  }
}

const sensors: Partial<RecorderInfo> = {
  motion: {
    description:
      'Motion sensors may use accelerometers, gyroscopes and magnetometers to capture the changes in position of the phone. Changes in position of the phone while the participant is completing their activities may be used to estimate changes in physical activity, which may be considered in the analysis of background distraction.',
    title: 'Motion Sensors',
    frequency: 'While using the app.',
    img: motion,
    burden:
      'Files generated by motion sensors can become very large if the participant moves a lot. Large files consume more data bandwidth to transmit, so consider that not all participants have unlimited data plans on their phones. Files larger than 100MB will fail to transmit.',
    value: false,
  },
  microphone: {
    description:
      'Noise can be distracting. The phone microphone can record background noise, which is converted into a measure of decibels relative to full scale. Recordings are not kept.  Assessments that use audio to present content, such as Spelling and Arranging Pictures will always have background noise capture disabled.',
    frequency: 'While performing App activities.',
    title: 'Background Noise',
    img: noise,
    burden:
      'Noise capture may consume additional battery and require more frequent charging while the app is in use for the duration of the study.',

    value: false,
  },
  weather: {
    description:
      "The phone GPS indicates phone location that can be used to collect data about weather and air quality at that location. Precise location is not used and GPS data isn't stored to maintain participant's privacy.",
    frequency: 'While using the App',
    title: 'Weather and Air Pollution',
    img: weather,
    burden:
      'Location services may consume additional battery and require more frequent charging while the app is in use for the duration of the study.',

    value: false,
  },
}

export interface PassiveFeaturesProps {
  id: string
  children: React.ReactNode
}

const PassiveFeatures: React.FunctionComponent<PassiveFeaturesProps> = ({id, children}) => {
  const {data: study} = useStudy(id)

  const {mutateAsync: mutateStudy} = useUpdateStudyDetail()

  const onUpdate = async (recorders: BackgroundRecorders) => {
    if (!study) {
      return
    }
    const updatedStudy = {
      ...study,
    }

    updatedStudy.clientData.backgroundRecorders = recorders
    try {
      const result = await mutateStudy({study: updatedStudy})
      console.log(`study ${result.identifier} updated`)
    } catch (e) {
      alert(e)
    } finally {
      console.log('finishing update')
    }
  }

  if (!study) {
    return <>...</>
  }

  const features: BackgroundRecorders = study.clientData.backgroundRecorders || {}

  const PFSection = ({
    recorderType,
    value = false,
    callbackFn,
  }: {
    recorderType: keyof BackgroundRecorders
    value?: boolean
    callbackFn: Function
  }): JSX.Element => {
    if (!recorderType) {
      return <></>
    }

    return (
      <StyledSection>
        <Box display="flex">
          <img src={sensors[recorderType]!.img} alt={sensors[recorderType]!.title} style={{marginRight: 'auto'}} />
          <Box sx={{marginLeft: theme.spacing(7)}}>
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                flextGrow: 1,
                flexDirection: 'row',
                height: theme.spacing(3),
                marginBottom: theme.spacing(2),
                justifyContent: 'space-between',
              }}>
              <Typography variant="h3">{sensors[recorderType]!.title}</Typography>
              {!isReadOnly && (
                <div>
                  <Switch color="primary" checked={value} onChange={e => callbackFn(e.target.checked)}></Switch>
                </div>
              )}
            </Box>

            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Frequency</TableCell>
                  <TableCell>User Burden</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{sensors[recorderType]!.description}</TableCell>
                  <TableCell>{sensors[recorderType]!.frequency}</TableCell>
                  <TableCell>{sensors[recorderType]!.burden}</TableCell>
                </TableRow>
              </TableBody>
            </StyledTable>
          </Box>
        </Box>
      </StyledSection>
    )
  }
  const isReadOnly = !StudyService.isStudyInDesign(study)
  const displayMotionSection = !isReadOnly || (isReadOnly && features?.motion)
  const displayMicrophoneSection = !isReadOnly || (isReadOnly && features.microphone)
  const displayWeatherSection = !isReadOnly || (isReadOnly && features?.weather)
  return (
    <>
      {' '}
      <BuilderWrapper sectionName="Optional Background Monitoring" isReadOnly={isReadOnly}>
        <Container maxWidth="lg">
          <Box sx={{fontSize: '16px'}}>
            {isReadOnly ? (
              <MTBHeadingH3 style={{marginBottom: '24px'}}>
                {Object.values(features).filter(o => o === true).length > 0
                  ? 'You’ve added the following Optional Monitoring to your study:'
                  : 'No Optional Monitoring was added to your study.'}
              </MTBHeadingH3>
            ) : (
              <Container maxWidth="md" sx={{textAlign: 'left', marginBottom: theme.spacing(4)}}>
                <Typography paragraph sx={{fontSize: '16px'}}>
                  Open Bridge lets you add optional contextual/sensor monitoring to your study. This can be used to
                  assess the impact of environmental factors on test performance.
                </Typography>
                <Typography sx={{fontSize: '16px'}} paragraph>
                  When adding monitoring, please consider the impact on the participant's experience and potential added
                  burden. Participants' devices may perform differently based on their device type.
                </Typography>
                <Typography sx={{fontSize: '16px'}} paragraph>
                  Participants can turn optional monitoring on/off at any time. You may not receive any data if a
                  participant opts-out or you may receive incomplete data if a participant changes their opt-in status
                  during your study.
                </Typography>
              </Container>
            )}
            {displayMotionSection && (
              <PFSection
                recorderType={'motion'}
                value={features?.motion}
                callbackFn={(e: boolean) => {
                  onUpdate({...features, motion: e})
                }}></PFSection>
            )}
            {displayMicrophoneSection && (
              <PFSection
                recorderType={'microphone'}
                value={features?.microphone}
                callbackFn={(e: boolean) => {
                  onUpdate({...features, microphone: e})
                }}></PFSection>
            )}
            {displayWeatherSection && (
              <PFSection
                recorderType={'weather'}
                value={features?.weather}
                callbackFn={(e: boolean) => {
                  onUpdate({...features, weather: e})
                }}></PFSection>
            )}
          </Box>
        </Container>
      </BuilderWrapper>
      {!isReadOnly && children}
    </>
  )
}

export default PassiveFeatures
