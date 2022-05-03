import {useUpdateParticipantInList} from '@components/studies/participantHooks'
import {SimpleTextInput} from '@components/widgets/StyledComponents'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {Button, CircularProgress, Paper} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {poppinsFont} from '@style/theme'
import {EnrolledAccountRecord} from '@typedefs/types'
import React, {FunctionComponent} from 'react'

const useStyles = makeStyles(theme => ({
  notesContainer: {
    // marginTop: theme.spacing(8),
    padding: theme.spacing(4),
    width: '50%',
    marginRight: theme.spacing(5),
  },
  notesText: {
    '& .MuiOutlinedInput-inputMultiline': {
      background: '#fff',
      padding: theme.spacing(1),
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#BBC3CD',
    },
    margin: theme.spacing(2, 0),
    width: '100%',
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
  const [isSaving, setIsSaving] = React.useState(false)
  const [note, setNote] = React.useState(enrollment.note)
  const {token} = useUserSessionDataState()

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
    <Paper className={classes.notesContainer}>
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
    </Paper>
  )
}

export default EditParticipantNotes
