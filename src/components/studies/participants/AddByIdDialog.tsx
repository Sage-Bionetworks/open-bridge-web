import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  LinearProgress,
  Radio,
  RadioGroup
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { FunctionComponent } from 'react'
import { generateNonambiguousCode } from '../../../helpers/utility'
import ParticipantService from '../../../services/participants.service'
import { Study } from '../../../types/types'
import DialogTitleWithClose from '../../widgets/DialogTitleWithClose'
import HideWhen from '../../widgets/HideWhen'
import SmallTextBox from '../../widgets/SmallTextBox'

const useStyles = makeStyles(theme => ({
  root: {},
}))

type AddByIdDialogProps = {
  token: string
  study: Study
  onAdded: Function
}

const AddByIdDialog: FunctionComponent<AddByIdDialogProps> = ({
  onAdded,
  study,
  token,
}) => {
  console.log('rerender')

  const [isOpenIdQuestion, setIsOpenIdQuestion] = React.useState(true)
  const [shouldGenerateIds, setShouldGenerateIds] = React.useState(false)
  const [numOfIds, setNumOfIds] = React.useState(10)
  const [progress, setProgress] = React.useState(0)

  const enrollWithGeneratedIds = async (numberToEnroll: number) => {
    let itemValue = 100 / numberToEnroll

    const studyPrefix = study.identifier.substr(0, 3)
    for (let i = 0; i < numberToEnroll; i++) {
      const id = `${generateNonambiguousCode(6)}-${studyPrefix}`
      const add = await ParticipantService.addParticipant(
        study.identifier,
        token,
        { externalId: id},
      )
      console.log('add', add)
      setProgress(_prev => _prev + itemValue)
    }

    onAdded(true)
    setIsOpenIdQuestion(false)
  }

  return (
    <Dialog
      open={isOpenIdQuestion && progress === 0}
      maxWidth="sm"
      fullWidth
      aria-labelledby="form-dialog-title"
    >
      <DialogTitleWithClose
        onCancel={() => setIsOpenIdQuestion(false)}
      ></DialogTitleWithClose>
      <DialogContent>
        <HideWhen hideWhen={progress > 0 && progress < 100}>
          <div>
            How would you like to generate the Participant IDs?
            <RadioGroup
              aria-label="generateIds"
              name="generateIds"
              value={shouldGenerateIds}
              onChange={e => setShouldGenerateIds(e.target.value === 'true')}
            >
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Define my own IDs"
              />
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Generate new participant IDs for me"
              />
            </RadioGroup>
            <HideWhen hideWhen={shouldGenerateIds === false}>
              <div>
                Number of Ids
                <SmallTextBox
                  isLessThanOneAllowed={false}
                  type="number"
                  inputWidth={8}
                  value={numOfIds}
                  onChange={e => setNumOfIds(Number(e.target.value))}
                ></SmallTextBox>
              </div>
            </HideWhen>
          </div>
          <div>
            <LinearProgress variant="determinate" value={progress} />
          </div>
        </HideWhen>
      </DialogContent>
      {progress === 0 && (
        <DialogActions>
          <Button
            onClick={() => setIsOpenIdQuestion(false)}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              shouldGenerateIds
                ? enrollWithGeneratedIds(numOfIds)
                : setIsOpenIdQuestion(false)
            }}
            color="primary"
            variant="contained"
          >
            &nbsp;Continue
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
export default AddByIdDialog
