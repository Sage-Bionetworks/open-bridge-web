import React, {FunctionComponent, useState, useEffect } from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import LoadingComponent from '../../widgets/Loader'
import { useAsync } from '../../../helpers/AsyncHook'
import ParticipantService from '../../../services/participants.service'
import { useSessionDataState } from '../../../helpers/AuthContext'
import ObjectDebug from '../../widgets/ObjectDebug'

const useStyles = makeStyles({
    root: {},
})
 

type ParticipantManagerOwnProps = {
  title?: string
  paragraph?: string
  studyId?: string
}

type ParticipantManagerProps = ParticipantManagerOwnProps & RouteComponentProps

const ParticipantManager: FunctionComponent<ParticipantManagerProps> = ({studyId}) => {
  let { id } = useParams<{ id: string }>()
  const handleError = useErrorHandler()
  const classes = useStyles()
  //if you need search params use the following
  //const { param } = useParams<{ param: string}>()
  //<T> is the type of data you are retrieving
  const { token } = useSessionDataState()
  const { data, status, error, run, setData } = useAsync<any>({
      status: 'PENDING', 
      data: null
  })
  React.useEffect(() => {
     /* if (! studyId) {
          return
      }*/
      ///your async call
      return run( ParticipantService.getParticipants(token!))
  }, [ studyId, run])
  if (status === 'PENDING') {
      return <>loading component here</>
  } else if (status === 'REJECTED') {
      handleError(error!)
   }else if (status === 'RESOLVED') {
  return ( <div className={classes.root}>
      <ObjectDebug label="part" data={data}></ObjectDebug>
  </div> );
  }
   return<></>
 
}

export default ParticipantManager
