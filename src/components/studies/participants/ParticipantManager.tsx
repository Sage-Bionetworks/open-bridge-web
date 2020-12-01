import React, { FunctionComponent, useState, useEffect } from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import LoadingComponent from '../../widgets/Loader'
import { useAsync } from '../../../helpers/AsyncHook'
import ParticipantService from '../../../services/participants.service'
import { useSessionDataState } from '../../../helpers/AuthContext'
import DeleteIcon from '@material-ui/icons/Delete'
import ObjectDebug from '../../widgets/ObjectDebug'
import {
  Box,
  Button,
  createStyles,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Theme,
  withStyles,
} from '@material-ui/core'
import ParticipantTable, { HeadCell } from './ParticipantTable'

import HideWhen from '../../widgets/HideWhen'

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
  calories: number
  carbs: number
  fat: number
  name: string
  protein: number
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
  const { token } = useSessionDataState()
  const { data, status, error, run, setData } = useAsync<any>({
    status: 'PENDING',
    data: null,
  })

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
              <div style={{display: 'inline'}}>
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
        </Box>
      </div>
    )
  }
  return <></>
}

export default ParticipantManager
