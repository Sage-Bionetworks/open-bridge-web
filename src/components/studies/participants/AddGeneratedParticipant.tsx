import {Box, FormControl, FormGroup, LinearProgress} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import React, {FunctionComponent} from 'react'
import {generateNonambiguousCode} from '../../../helpers/utility'
import ParticipantService from '../../../services/participants.service'
import HideWhen from '../../widgets/HideWhen'
import {
  BlueButton,
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'

const useStyles = makeStyles(theme => ({
  root: {},
}))

type AddGeneratedParticipantProps = {
  token: string
  studyIdentifier: string
  onAdded: Function
  isTestAccount?: boolean
}

const AddGeneratedParticipant: FunctionComponent<AddGeneratedParticipantProps> = ({
  onAdded,
  studyIdentifier,
  token,
  isTestAccount,
}) => {
  console.log('rerender')

  const [numOfIds, setNumOfIds] = React.useState(10)
  const [progress, setProgress] = React.useState(0)
  const [error, setError] = React.useState('')

  const enrollWithGeneratedIds = async (
    numberToEnroll: number,
    isTestAccount?: boolean
  ) => {
    setProgress(0)
    setError('')
    let itemValue = 100 / numberToEnroll

    for (let i = 0; i < numberToEnroll; i++) {
      try {
        await ParticipantService.addParticipant(
          studyIdentifier,
          token,
          {externalId: generateNonambiguousCode(6)},
          isTestAccount
        )
      } catch (error) {
        setError(error.toString())
      }

      setProgress(_prev => _prev + itemValue)
    }
    setProgress(0)

    onAdded(true)
  }

  return (
    <>
      <Box mx="auto" textAlign="center" my={2}>
        {error && <Alert color="error">{error}</Alert>}
      </Box>
      <HideWhen hideWhen={progress > 0 && progress < 100}>
        <FormGroup>
          <FormControl>
            <SimpleTextLabel htmlFor="generate">
              How many Ids would you like to add*
            </SimpleTextLabel>
            <SimpleTextInput
              id="generate"
              style={{width: '150px', margin: '40px auto 32px auto'}}
              type="number"
              value={numOfIds}
              onChange={e =>
                setNumOfIds(Number(e.target.value))
              }></SimpleTextInput>
          </FormControl>
        </FormGroup>
        <div>
          <LinearProgress variant="determinate" value={progress} />
        </div>
      </HideWhen>
      <Box textAlign="center" my={2}>
        <BlueButton
          color="primary"
          variant="contained"
          style={{backgroundColor: '#AEDCC9'}}
          disabled={progress > 0}
          onClick={() => enrollWithGeneratedIds(numOfIds, isTestAccount)}>
          + Generate Ids
        </BlueButton>
      </Box>
    </>
  )
}
export default AddGeneratedParticipant
