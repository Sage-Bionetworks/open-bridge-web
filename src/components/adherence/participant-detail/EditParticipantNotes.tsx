import {makeStyles, Paper, TextField, Button} from '@material-ui/core'
import {MTBHeadingH4} from '@components/widgets/Headings'
import ParticipantService from '@services/participants.service'
import { useUserSessionDataState } from '@helpers/AuthContext' 
import {ExtendedError, ParticipantAccountSummary, EnrolledAccountRecord} from '@typedefs/types'
import React, {FunctionComponent} from 'react'

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
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            // border:'1px solid #BBC3CD',
            width: '55%',
        },      
        textArea: {
            backgroundColor: '#f8f8f8',
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
            fontFamily: 'Poppins',       }
      }))
    const classes = useStyles()

    const [note, setNote] = React.useState(enrollment.note)
    const {token} = useUserSessionDataState()

    const updateNotes = async(
        particpantId: string,
        updatedFields: {
        [Property in keyof ParticipantAccountSummary]?: ParticipantAccountSummary[Property]  
        }
    ) => {
        try {
        await ParticipantService.updateParticipant(
            studyId,
            token!,
            participantId,
            updatedFields
        ) 
        } catch (e) {
        alert((e as ExtendedError).message)
        }
    }
    return(
        <Paper className={classes.notesContainer}>
            <MTBHeadingH4 style={{marginLeft:"10px", fontSize:'16px', lineHeight:'24px', fontFamily:'Poppins'}}>Participant Notes</MTBHeadingH4>
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
            disableElevation
            size = 'large'
            onClick={()=>{
                const data = {note: note}
                updateNotes(participantId,data)
            }
            }>Save</Button>
    </Paper>
    )
}

export default EditParticipantNotes