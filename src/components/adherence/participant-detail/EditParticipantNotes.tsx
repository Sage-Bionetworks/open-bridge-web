import {makeStyles, Paper, TextField, Button, CircularProgress} from '@material-ui/core'
import { useUserSessionDataState } from '@helpers/AuthContext' 
import {EnrolledAccountRecord} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import { poppinsFont } from '@style/theme'
import { useUpdateParticipantInList } from '@components/studies/participantHooks'

const useStyles = makeStyles(theme => ({
    notesContainer: {
      marginTop: theme.spacing(8),
      padding: theme.spacing(4)
    },
    notesText: {
        "& .MuiOutlinedInput-inputMultiline": {
            background: '#fff',
            padding: theme.spacing(1),
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: '#BBC3CD',
        },
        margin: theme.spacing(2,0),
        width: '55%',
    },      
    saveBtn: {
        backgroundColor: '#392D2D',
        "&:hover": {
            backgroundColor:'#392D2D',
            fontWeight: 'bolder',            
        },
        color: '#FFFFFF',
        display: 'block',
        margin: 0,
        borderRadius: 0,
        fontFamily: poppinsFont,       
    },
    noteHeader: {
        marginLeft:'10px',
        fontWeight: 'bold', 
        fontSize:'16px', 
        fontFamily: poppinsFont,
    }
  }))

type EditParticipantNotesProps = {
    participantId : string,
    studyId: string,
    enrollment: EnrolledAccountRecord
}

const EditParticipantNotes: FunctionComponent<EditParticipantNotesProps> = ({
    participantId,
    studyId,
    enrollment
}) => {

    const classes = useStyles()
    const [isSaving, setIsSaving] = React.useState(false)
    const [note, setNote] = React.useState(enrollment.note)
    const {token} = useUserSessionDataState()

    const {isLoading, mutateAsync} = useUpdateParticipantInList()

    const updateNotes = async(particpantId:string, updatedFields:any) => {
        const userIdArr = [particpantId] as Array<string>
        mutateAsync({
            studyId, 
            action:'UPDATE',
            userId:userIdArr,
            updatedFields})
    }
    return(
        <Paper className={classes.notesContainer}>
            <div className={classes.noteHeader}>Participant Notes</div>
            <TextField 
            className={classes.notesText}
            value={note}
            onChange={e => setNote(e.target.value)}
            multiline={true} 
            rows={20}
            variant='outlined'/> 
            <Button 
            className={classes.saveBtn}
            variant='contained'
            size = 'large'
            onClick={()=>{
                const data = {note: note}
                updateNotes(participantId,data)
            }
            }>{isLoading ? <CircularProgress/>: <>Save</>  }</Button>

    </Paper>
    )
}

export default EditParticipantNotes