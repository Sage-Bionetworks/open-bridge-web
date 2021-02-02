import { Box, Button, Grid, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { CSVReader } from 'react-papaparse'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useAsync } from '../../../helpers/AsyncHook'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import ParticipantService from '../../../services/participants.service'
import { ParticipanRecord } from '../../../types/types'
import HideWhen from '../../widgets/HideWhen'
import ObjectDebug from '../../widgets/ObjectDebug'
import StudyTopNav from '../StudyTopNav'
import ParticipantTable, { HeadCell } from './ParticipantTable'

const useStyles = makeStyles({
  root: {},
  switchRoot: {
    //padding: '8px'
  },
})

type ParticipantManagerOwnProps = {
  title?: string
  paragraph?: string
  studyId?: string
}

interface Data {
  id: string
  [key: string]: string | number
}

const headCells: HeadCell<Data>[] = [
  {
    id: 'firstName',
    numeric: false,
    disablePadding: true,
    label: 'firstName',
  },
  { id: 'lastName', numeric: true, disablePadding: false, label: 'lastName' },

  {
    id: 'createdOn',
    numeric: true,
    disablePadding: false,
    label: 'createdOn',
  },
  { id: 'status', numeric: true, disablePadding: false, label: 'status' },
]

const participantRecordTemplate: ParticipanRecord = {
 
  phoneNumber: '',
  healthCode: '',
  clinicVisit: null,
  status: '',
  altId: '',
  notes: '',
}
type keys = keyof ParticipanRecord 

function parseCSVToJSON(rows: any[]):Partial<ParticipanRecord>[] {
  const keys = Object.keys(participantRecordTemplate) as keys[]
  let i = 0
  const objects:Partial<ParticipanRecord>[] = []
  for (const row of rows) {
    console.log('row'+i)
    console.log(row.data)
    console.log(JSON.stringify(row.data))
    let index = 0
    let o: Partial<ParticipanRecord> = {}
    // const newParticipant = {...participantRecordTemplate}
    for (const key of keys) {
      o[key] = row.data[index]
      //@ts-ignore
      console.log(o[key])
      index++
    }
    i++
    objects.push(o)
  }
  return objects
}

type ParticipantManagerProps = ParticipantManagerOwnProps & RouteComponentProps

const ParticipantManager: FunctionComponent<ParticipantManagerProps> = ({
  studyId,
}) => {
  let { id } = useParams<{ id: string }>()
  const [isEdit, setIsEdit] = React.useState(false)
  const handleError = useErrorHandler()
  const classes = useStyles()
  //if you need search params use the following
  //const { param } = useParams<{ param: string}>()
  //<T> is the type of data you are retrieving
  const { token } = useUserSessionDataState()
  const { data, status, error, run, setData } = useAsync<any>({
    status: 'PENDING',
    data: null,
  })

  const uploadFromCsv = () => {}
  const handleOnDrop = (data: any) => {
    console.log('---------------------------')
    //console.log(data)
    const objects = parseCSVToJSON(data)
    debugger
    console.log(objects)
    console.log('---------------------------')
  }

  const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.log(err)
  }

  React.useEffect(() => {
    /* if (! studyId) {
          return
      }*/
    ///your async call
    return run(ParticipantService.getParticipants(token!))
  }, [studyId, run])
  if (status === 'PENDING') {
    return <>loading component here</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'RESOLVED') {
    return (
      <div className={classes.root}>
        <StudyTopNav studyId={id} currentSection={''}></StudyTopNav>
        StudyId: {id}
        <ObjectDebug label="part" data={data}></ObjectDebug>
        <Box border="1px slid black">
          <Grid component="label" container alignItems="center" spacing={0}>
            <Grid item>View</Grid>
            <Grid item>
              <Switch
                checked={isEdit}
                classes={{ root: classes.switchRoot }}
                onChange={e => setIsEdit(e.target.checked)}
                name="viewEdit"
              />
            </Grid>
            <Grid item>Edit</Grid>
          </Grid>

          <Box>
            <HideWhen hideWhen={!isEdit}>
              <div style={{ display: 'inline' }}>
                <Button>Move to</Button>

                <Button>Unlink phone number</Button>
                <Button>
                  <DeleteIcon />
                </Button>
              </div>
            </HideWhen>
            <Button>Download</Button>
          </Box>
          <ParticipantTable
            rows={data}
            headCells={headCells}
          ></ParticipantTable>
          <CSVReader onDrop={handleOnDrop} onError={handleOnError}>
            <span>Drop CSV file here or click to upload.</span>
          </CSVReader>
          <Button onClick={() => uploadFromCsv()}>Upload from CSV</Button>
        </Box>
      </div>
    )
  }
  return <></>
}

export default ParticipantManager
