import {useUserSessionDataState} from '@helpers/AuthContext'
import UtilityObject from '@helpers/utility'
import {Box, Button, FormControlLabel, Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import {useUpdateSurveyAssessment} from '@services/assessmentHooks'
import {Assessment} from '@typedefs/types'
import React from 'react'
import {latoFont, poppinsFont} from '../../../style/theme'
import {SimpleTextInput} from '../../widgets/StyledComponents'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelDuration: {
      fontFamily: poppinsFont,
      marginLeft: 0,
      fontSize: '18px',
      fontWeight: 600,
      textAlign: 'left',
      alignSelf: 'start',
      alignItems: 'flex-start',
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(3.75),
      minWidth: '300px',
    },
    formControl: {
      fontSize: '18px',
      width: '100%',
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },

    divider: {
      width: '100%',
      marginBottom: theme.spacing(3),
    },
    headerText: {
      fontSize: '18px',
      fontFamily: 'Poppins',
      lineHeight: '27px',
    },
    description: {
      fontFamily: 'Lato',
      fontStyle: 'italic',
      fontSize: '15px',
      fontWeight: 'lighter',
      lineHeight: '18px',
    },
    middleContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    weekInformation: {
      fontStyle: 'italic',
      fontFamily: latoFont,
      fontSize: '12px',
      lineHeight: '20px',
      marginLeft: theme.spacing(2.25),

      marginTop: theme.spacing(19),
      textAlign: 'left',
      listStyle: 'none',
    },
    hint: {
      fontStyle: 'italic',
      fontFamily: latoFont,
      fontSize: '11px',
      fontWeight: 'bold',
      display: 'block',
    },
    continueButton: {
      display: 'flex',
      height: '45px',
      marginTop: theme.spacing(8),
      alignSelf: 'flex-start',
    },
  })
)

export interface IntroInfoProps {
  survey?: Assessment
}

/*type BasicInfo = {
  identifier?: string

  osName?: 'Android' | 'iPhone OS' | 'Both' //iPhone OS"
  ownerId?: string //sage-bionetworks"
  title: string
  minutesToComplete?: number
  tags: string[]

  version: number
}*/
const IntroInfo: React.FunctionComponent<IntroInfoProps> = ({
  survey: _survey,
}: IntroInfoProps) => {
  // const [survey, setSurvey] = React.useState<Assessment|undefined>(_survey)
  const [reloadGuid, setReloadGuid] = React.useState('')
  const {token, orgMembership} = useUserSessionDataState()

  const [basicInfo, setBasicInfo] = React.useState<Assessment>({
    title: '',
    tags: [],
    version: 0,
    revision: 1,
    osName: 'Both',
    identifier: UtilityObject.generateNonambiguousCode(6, 'CONSONANTS'),
    ownerId: orgMembership!,
  })
  React.useEffect(() => {
    console.log('setting basic info')
    if (_survey) {
      setBasicInfo(_survey)
    }
  }, [_survey])

  const {
    isSuccess: surveyUpdateSuccess,
    isError: surveyUpdateError,
    mutate: mutateAssessment,
  } = useUpdateSurveyAssessment()

  const saveAssessment = async () => {
    console.log('bi', basicInfo)
    mutateAssessment(
      {survey: basicInfo, action: basicInfo.guid ? 'UPDATE' : 'CREATE'},
      {
        onSuccess: info => {
          console.log('success')
          console.log(info)
          //  setReloadGuid(info.guid!)
          console.log('reloading')
        },
        onError: info => {
          console.log('error')
          console.log(info)
        },
      }
    )
  }
  console.log(_survey, 's')
  console.log(basicInfo)

  /* if (reloadGuid) {
    return <Redirect to={`/surveys/${reloadGuid}/design`} />
  }*/

  return (
    <Box>
      <div>
        <FormControlLabel
          /*classes={{labelPlacementStart: classes.labelDuration}}*/
          label={
            <Box width="210px" marginRight="40px">
              <strong /*className={classes.headerText}*/>Survey Name*</strong>
              <br /> <br />
              <Box /* className={classes.description}*/>
                This will be used to reference the survey in Survey Library.
              </Box>{' '}
            </Box>
          }
          /* className={classes.formControl}*/
          labelPlacement="start"
          control={
            <SimpleTextInput
              fullWidth
              value={basicInfo?.title}
              onChange={e =>
                setBasicInfo(prev => ({...prev, title: e.target.value}))
              }
            />
          }
        />

        <Box /*className={classes.middleContainer}*/>
          <FormControlLabel
            /* classes={{
              labelPlacementStart: classes.labelDuration,
            }}*/
            label={
              <Box width="210px" marginRight="40px">
                <strong>How long will this survey take?!</strong>
                <br /> <br />
              </Box>
            }
            /* className={classes.formControl}*/
            labelPlacement="start"
            control={
              <Box>
                <SimpleTextInput
                  onChange={e =>
                    setBasicInfo(prev => ({
                      ...prev,
                      minutesToComplete: parseInt(e.target.value),
                    }))
                  }
                  value={basicInfo?.minutesToComplete || ''}></SimpleTextInput>
              </Box>
            }
          />
        </Box>
        <Button
          /* className={classes.continueButton}*/
          variant="contained"
          color="primary"
          key="saveButton"
          onClick={e => saveAssessment()}
          disabled={!basicInfo?.title}>
          Title Page
        </Button>
      </div>
    </Box>
  )
}

export default IntroInfo
