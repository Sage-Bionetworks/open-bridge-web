import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  makeStyles,
  Radio,
  TextField,
} from '@material-ui/core'

import React, { FunctionComponent, useState } from 'react'

import { RouteComponentProps, useParams } from 'react-router-dom'
import StudyTopNav from '../studies/StudyTopNav'
import CloseIcon from '@material-ui/icons/Close'

import { callEndpoint } from '../../helpers/utility'
import { useSessionDataState } from '../../helpers/AuthContext'

const useStyles = makeStyles(theme => ({
  root: {
    border: '1px solid black',
    marginTop: theme.spacing(12),
    display: 'flex',
    padding: `${theme.spacing(3)}px, ${theme.spacing(5)}px, ${theme.spacing(
      3,
    )}px, ${theme.spacing(5)}px`,
  },
}))

type SharingOwnProps = {
  title?: string
  paragraph?: string
}

type SharingProps = SharingOwnProps & RouteComponentProps

const Sharing: FunctionComponent<SharingProps> = ({
  title = 'something',
  paragraph,
}) => {
  const classes = useStyles()
  let { id } = useParams<{ id: string }>()
  const [x, setX] = useState<number[]>([])
  const { token } = useSessionDataState()

  const invite = () => {}
  const synapseAliasToUserId = (alias: string = 'agendel@synapse.org') => {
    if (!alias) {
      return Promise.resolve(alias)
    }
    alias = alias.replace('@synapse.org', '').trim()
    if (/^\d+$/.test(alias)) {
      return Promise.resolve(alias)
    }
    return fetch(
      'https://repo-prod.prod.sagebase.org/repo/v1/principal/alias',
      {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alias: alias, type: 'USER_NAME' }),
      },
    ).then(response => {
      return response.json().then(json => {
        return Promise.resolve(json.principalId)
      })
    })
  }

  return (
    <>
      <StudyTopNav studyId={id} currentSection={''}></StudyTopNav>
      <Container maxWidth="lg" className={classes.root}>
        <Box marginRight="40px">
          <h3>Team Members</h3>
          Alina Gendel
          <Divider />
          <Button onClick={() => invite()}>Invite member</Button>
        </Box>
        <Box>
          <h3>Access Type</h3>
          <table>
            <tr>
              <th></th>
              <th>No Access</th>
              <th>Viewer</th>
              <th>Editor</th>
            </tr>
            <tr>
              <td>Full Study Administration</td>
              <td>
                <Radio
                  checked={x[0] === 0}
                  onChange={x => setX([0])}
                  value="a"
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'A' }}
                />
              </td>
              <td>
                {' '}
                <Radio
                  checked={x[0] === 1}
                  onChange={x => setX([1])}
                  value="a"
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'A' }}
                />
              </td>
              <td>
                {' '}
                <Radio
                  checked={x[0] === 2}
                  onChange={x => setX([2])}
                  value="a"
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'A' }}
                />
              </td>
            </tr>

            <tr>
              <td>Study Builder</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td>Participant Manager</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Compliance Dashboard</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td>Data Access</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </Box>
      </Container>
      <Dialog open={true} maxWidth="lg" aria-labelledby="form-dialog-title">
        <DialogTitle>
          Invite Team Members
          <IconButton
            aria-label="close"
            className={'' /*classes.closeButton*/}
            onClick={() => {}}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField multiline={true} label="Email:"></TextField>
        </DialogContent>
        <Button
          onClick={() => synapseAliasToUserId('agendel_test@synapse.org')}
        >
          Next
        </Button>
      </Dialog>
    </>
  )
}

export default Sharing
