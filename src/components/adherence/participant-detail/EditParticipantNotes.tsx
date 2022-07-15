import {SimpleTextInput} from '@components/widgets/StyledComponents'
import {Button, CircularProgress} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {useUpdateParticipantInList} from '@services/participantHooks'
import {poppinsFont} from '@style/theme'
import {EnrolledAccountRecord} from '@typedefs/types'
import React, {FunctionComponent} from 'react'

const useStyles = makeStyles(theme => ({
  notesContainer: {
    padding: theme.spacing(0, 2, 2, 0),
    width: '50%',
  },

  notesText: {
    borderColor: '#BBC3CD',
    margin: theme.spacing(2, 0),
    width: '100%',
    '& .MuiOutlinedInput-inputMultiline': {
      background: '#fff',
      padding: theme.spacing(1),
    },
  },
  saveBtn: {
    backgroundColor: '#392D2D',
    '&:hover': {
      backgroundColor: '#392D2D',
      fontWeight: 'bolder',
    },
    color: '#FFFFFF',
    display: 'block',
    margin: 0,
    borderRadius: 0,
    fontFamily: poppinsFont,
  },
  noteHeader: {
    marginLeft: '10px',
    fontWeight: 'bold',
    fontSize: '16px',
    fontFamily: poppinsFont,
  },
}))

type EditParticipantNotesProps = {
  participantId: string
  studyId: string
  enrollment: EnrolledAccountRecord
}

const EditParticipantNotes: FunctionComponent<EditParticipantNotesProps> = ({
  participantId,
  studyId,
  enrollment,
}) => {
  const classes = useStyles()
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
    <div className={classes.notesContainer}>
      <div className={classes.noteHeader}>Participant Notes</div>
      <SimpleTextInput
        className={classes.notesText}
        value={note}
        onChange={e => setNote(e.target.value)}
        multiline={true}
        rows={20}
      />
      <Button
        className={classes.saveBtn}
        variant="contained"
        size="large"
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
