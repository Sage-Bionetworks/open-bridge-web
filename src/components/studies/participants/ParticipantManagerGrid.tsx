import { Box, Button, Grid, Paper, Switch, Tab, Tabs } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { CSVReader } from 'react-papaparse'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useAsync } from '../../../helpers/AsyncHook'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import ParticipantService from '../../../services/participants.service'
import { ParticipantAccountSummary } from '../../../types/types'
import CollapsibleLayout from '../../widgets/CollapsibleLayout'
import HideWhen from '../../widgets/HideWhen'
import TabPanel from '../../widgets/TabPanel'
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
    id: 'phone',
    numeric: false,
    disablePadding: true,
    label: 'Phone',
  },
  {
    id: 'id',
    numeric: true,
    disablePadding: false,
    label: 'Health Code',
  },

  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  {
    id: 'externalId',
    numeric: true,
    disablePadding: false,
    label: 'Reference Id',
  },

  /* {
    id: 'createdOn',
    numeric: true,
    disablePadding: false,
    label: 'createdOn',
  },*/
]

const participantRecordTemplate: ParticipantAccountSummary = {
  status: 'unverified',
  isSelected: false,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  id: '',
  externalIds: {},
}
type keys = keyof ParticipantAccountSummary

function parseCSVToJSON(rows: any[]): Partial<ParticipantAccountSummary>[] {
  const keys = Object.keys(participantRecordTemplate) as keys[]
  let i = 0
  const objects: Partial<ParticipantAccountSummary>[] = []
  for (const row of rows) {
    console.log('row')
    console.log(row.data)
    console.log(JSON.stringify(row.data))
    let index = 0
    let o: Partial<ParticipantAccountSummary> = {}
    // const newParticipant = {...participantRecordTemplate}
    for (const key of keys) {
      o[key] = row.data[index]
      //@ts-ignore
      console.log(o[key])
      index++
    }
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
  const [isOpen, setIsOpen] = React.useState(false)
  const [tab, setTab] = React.useState(0)
  const handleError = useErrorHandler()
  const classes = useStyles()
  //if you need search params use the following
  //const { param } = useParams<{ param: string}>()
  //<T> is the type of data you are retrieving
  const { token } = useUserSessionDataState()

  const { data, status, error, run, setData } = useAsync<
    ParticipantAccountSummary[]
  >({
    status: 'PENDING',
    data: null,
  })
  const [exportData, setExportData] = React.useState<any[] | null>(null)

  React.useEffect(() => {
    if (!data) {
      return
    }
    const result = data.map(record => {
      return {
        healthCode: record.id,
        clinicVisit: '',
        status: record.status,
        referenceId: record.studyExternalId,
        notes: '',
      }
    })
    setExportData(result)
  }, [data])

  React.useEffect(() => {
    /* if (! studyId) {
          return
      }*/
    ///your async call
    return run(ParticipantService.getParticipants('mtb-user-testing', token!))
  }, [studyId, run])

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

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setTab(newValue)
  }

  if (status === 'PENDING') {
    return <>loading component here</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'RESOLVED') {
    return (
      <CollapsibleLayout expandedWidth={300}>
        <div>
          <Paper square>
            <Tabs
              value={tab}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab label="Upload .csv " />
              <Tab label="Enter details" />
            </Tabs>

            <TabPanel value={tab} index={0}>
              To add new participants to your study, we will need the following<br/>
              information by columns: Phone Number<br/>
              Clinic Visit (can be<br/>
              updated later) Reference ID (Alternate ID for your reference)<br/>
              Notes (for your reference) Please make sure that your .csv matches<br/>
              this template: ParticipantPhones_Template.csv<br/>
              <Button>Upload CSV File</Button>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              Item Two
            </TabPanel>
          </Paper>
        </div>

        <div>
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
            rows={data || []}
            headCells={headCells}
          ></ParticipantTable>
          <CSVReader onDrop={handleOnDrop} onError={handleOnError}>
            <span>Drop CSV file here or click to upload.</span>
          </CSVReader>
          <Button onClick={() => uploadFromCsv()}>Upload from CSV</Button>
        </div>
      </CollapsibleLayout>
    )
  }
  return <>bye</>
}
export default ParticipantManager
