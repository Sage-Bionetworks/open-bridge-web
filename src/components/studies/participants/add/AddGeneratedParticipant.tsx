import {Box, FormControl, FormGroup, LinearProgress} from '@mui/material'
import Alert from '@mui/material/Alert'
import React, {FunctionComponent} from 'react'
import Utility from '../../../../helpers/utility'
import ParticipantService from '../../../../services/participants.service'
import HideWhen from '../../../widgets/HideWhen'
import {BlueButton, SimpleTextInput, SimpleTextLabel} from '../../../widgets/StyledComponents'

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
  const [numOfIds, setNumOfIds] = React.useState(10)
  const [progress, setProgress] = React.useState(0)
  const [error, setError] = React.useState<Error | undefined>()

  const enrollWithGeneratedIds = async (numberToEnroll: number, isTestAccount?: boolean) => {
    setProgress(0)
    setError(undefined)
    let itemValue = 100 / numberToEnroll

    for (let i = 0; i < numberToEnroll; i++) {
      try {
        await ParticipantService.addParticipant(
          studyIdentifier,
          token,
          {externalId: Utility.generateNonambiguousCode(6)},
          isTestAccount
        )
      } catch (error) {
        setError(error as Error)
      }

      setProgress(_prev => _prev + itemValue)
    }
    setProgress(0)

    onAdded(true)
  }

  return (
    <>
      <Box mx="auto" textAlign="center" my={2}>
        {error && <Alert color="error">{error?.message}</Alert>}
      </Box>
      <HideWhen hideWhen={progress > 0 && progress < 100}>
        <FormGroup>
          <FormControl>
            <SimpleTextLabel htmlFor="generate">How many Ids would you like to add*</SimpleTextLabel>
            <SimpleTextInput
              id="generate"
              inputProps={{min: 1}}
              style={{width: '150px', margin: '40px auto 32px auto'}}
              type="number"
              value={numOfIds}
              onChange={e => setNumOfIds(Number(e.target.value))}></SimpleTextInput>
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
