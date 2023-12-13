import {SimpleTextInput, SimpleTextLabel} from '@components/widgets/StyledComponents'
import {Button, CircularProgress, FormControl} from '@mui/material'
import {useUpdateParticipantInList} from '@services/participantHooks'
import {theme} from '@style/theme'
import {EnrolledAccountRecord} from '@typedefs/types'
import React, {FunctionComponent} from 'react'

type EditParticipantNotesProps = {
  participantId: string
  studyId: string
  enrollment: EnrolledAccountRecord
}

const EditParticipantNotes: FunctionComponent<EditParticipantNotesProps> = ({participantId, studyId, enrollment}) => {
  const [note, setNote] = React.useState(enrollment.note)
  const {isLoading, mutateAsync} = useUpdateParticipantInList()

  const updateNotes = async (particpantId: string, updatedFields: any) => {
    const userIdArr = [particpantId] as Array<string>
    mutateAsync({
      studyId,
      action: 'UPDATE',
      userId: userIdArr,
      updatedFields,
    })
  }
  return (
    <div>
      <FormControl fullWidth>
        <SimpleTextLabel>Participant Notes</SimpleTextLabel>

        <SimpleTextInput
          sx={{
            '& .MuiOutlinedInput-root': {backgroundColor: '#FFF'},
          }}
          inputProps={{style: {backgroundColor: '#FFF'}}}
          value={note}
          onChange={e => setNote(e.target.value)}
          multiline={true}
          rows={5}
        />
      </FormControl>

      <Button
        sx={{float: 'right', marginTop: theme.spacing(2)}}
        variant="contained"
        color="primary"
        onClick={() => {
          const data = {note: note}
          updateNotes(participantId, data)
        }}>
        {isLoading ? <CircularProgress /> : <>Save</>}
      </Button>
    </div>
  )
}

export default EditParticipantNotes
