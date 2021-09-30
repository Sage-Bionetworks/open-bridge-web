import {
  Box,
  FormControlLabel,
  makeStyles,
  Radio,
  Switch,
} from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {latoFont} from '../../style/theme'
import {AdminRole} from '../../types/types'

const useStyles = makeStyles(theme => ({
  cell: {
    borderBottom: '1px solid black',
    padding: '10px',
    fontFamily: latoFont,
    fontSize: '14px',
    maxWidth: '200px',
  },
  data: {
    width: '100px',
    textAlign: 'center',
    fontFamily: latoFont,
    fontSize: '14px',
    fontWeight: 'normal',
  },
  dot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    margin: 'auto',
    backgroundColor: 'black',
  },
}))

export const AccessRestriction = ['NO_ACCESS', 'VIEWER', 'EDITOR'] as const

type AccessGridProps = {
  access: Access
  onUpdate?: Function
  isEdit?: boolean
  isThisMe?: boolean
  //isCoadmin?: boolean
  currentUserIsAdmin: boolean
}

export type AccessLabel = {
  [key: string]: string
}

export type Access = {
  STUDY_BUILDER: typeof AccessRestriction[number]
  PARTICIPANT_MANAGER_ADHERENCE: typeof AccessRestriction[number]
  // ADHERENCE_DATA: typeof AccessRestriction[number]
  //STUDY_DATA: typeof AccessRestriction[number]
  ACCESS_SETTINGS: typeof AccessRestriction[number]
}

const roles: AccessLabel[] = [
  {STUDY_BUILDER: 'STUDY BUILDER'},
  {PARTICIPANT_MANAGER_ADHERENCE: 'PARTICIPANT MANAGER & ADHERENCE DATA'},
  // {ADHERENCE_DATA: 'ADHERENCE DATA'},
  // {STUDY_DATA: 'STUDY DATA'},
  {ACCESS_SETTINGS: 'ACCESS SETTINGS'},
]

export const NO_ACCESS: Access = {
  STUDY_BUILDER: 'NO_ACCESS',
  PARTICIPANT_MANAGER_ADHERENCE: 'NO_ACCESS',
  //ADHERENCE_DATA: 'NO_ACCESS',
  //STUDY_DATA: 'NO_ACCESS',
  ACCESS_SETTINGS: 'NO_ACCESS',
}

export const COADMIN_ACCESS: Access = {
  STUDY_BUILDER: 'EDITOR',
  PARTICIPANT_MANAGER_ADHERENCE: 'EDITOR',
  // ADHERENCE_DATA: 'EDITOR',
  //STUDY_DATA: 'NO_ACCESS',
  ACCESS_SETTINGS: 'EDITOR',
}

export function getRolesFromAccess(access: Access): AdminRole[] {
  const roles: AdminRole[] = []
  if (access.STUDY_BUILDER === 'EDITOR') {
    roles.push('study_designer')
  }
  if (access.PARTICIPANT_MANAGER_ADHERENCE === 'EDITOR') {
    roles.push('study_coordinator')
  }
  if (access.ACCESS_SETTINGS === 'EDITOR') {
    roles.push('org_admin')
  }
  return roles
}

export function getAccessFromRoles(roles: AdminRole[]): Access {
  const access = {...NO_ACCESS}
  if (roles.includes('org_admin')) {
    access.ACCESS_SETTINGS = 'EDITOR'
    // access.STUDY_BUILDER = 'EDITOR'
    // access.PARTICIPANT_MANAGER = 'EDITOR'
    // access.ADHERENCE_DATA = 'EDITOR'
  }

  if (roles.includes('study_coordinator')) {
    //access.ADHERENCE_DATA = 'EDITOR'
    access.PARTICIPANT_MANAGER_ADHERENCE = 'EDITOR'
  }

  if (roles.includes('study_designer')) {
    access.STUDY_BUILDER = 'EDITOR'
  }

  return access
}

type AccessGridRadioComponentsProps = {
  restriction: string
  role_key: AccessLabel
  isCoAdmin: boolean
  currentUserIsAdmin: boolean
  onUpdate: Function
  isAllowedAccess: boolean
  isEdit?: boolean
}
const AccessGridRadioComponents: React.FunctionComponent<AccessGridRadioComponentsProps> =
  ({
    restriction,
    role_key,
    isCoAdmin,
    currentUserIsAdmin,
    onUpdate,
    isEdit,
    isAllowedAccess,
  }) => {
    const classes = useStyles()

    if (!isEdit) {
      return isAllowedAccess ? <div className={classes.dot} /> : <>&nbsp;</>
    }

    const key = Object.keys(role_key)[0] as keyof Access
    let checkboxChecked = false
    if (!currentUserIsAdmin) {
      if (!isAllowedAccess) {
        return null
      }
      return (
        <Box
          mt={-2.5}
          height="40px"
          display="flex"
          justifyContent="center"
          alignItems="center">
          <CheckIcon style={{color: 'black'}} />
        </Box>
      )
    }
    if (key === 'ACCESS_SETTINGS') {
      checkboxChecked = true
      if (restriction === 'NO_ACCESS') {
        return null
      }
      if (restriction === 'VIEWER' && isCoAdmin) {
        return null
      }
      if (restriction === 'EDITOR' && !isCoAdmin) {
        return (
          <Box
            fontSize="10px"
            fontStyle="italic"
            fontFamily={latoFont}
            fontWeight="normal">
            Only available to Administrators
          </Box>
        )
      }
    }
    return (
      <Radio
        checked={checkboxChecked || isAllowedAccess}
        disabled={restriction === 'VIEWER'}
        value={restriction}
        onChange={e => onUpdate(e)}
        radioGroup={'group_' + Object.keys(role_key)}></Radio>
    )
  }

const AccessGrid: FunctionComponent<AccessGridProps> = ({
  access,
  onUpdate,
  isEdit,
  isThisMe,
  currentUserIsAdmin,
}: AccessGridProps) => {
  const classes = useStyles()

  const isAllowedAccess = (
    restriction: string,
    role_key: AccessLabel
  ): boolean => {
    const key = Object.keys(role_key)[0] as keyof Access
    return access[key] === restriction
  }

  const updateAccess = (
    restriction: typeof AccessRestriction[number] | '',
    accessObject: AccessLabel
  ) => {
    if (!onUpdate) {
      return
    }
    const accessKey = Object.keys(accessObject)[0]

    const updatedAccess = {...access, [accessKey]: restriction}
    if (restriction !== 'EDITOR') {
      updatedAccess.ACCESS_SETTINGS = 'VIEWER'
    }
    onUpdate(updatedAccess)
  }
  const updateCoadminAccess = (hasAccess?: boolean) => {
    if (!onUpdate) {
      return
    }
    const result: Access = hasAccess
      ? {...COADMIN_ACCESS}
      : {...access, ACCESS_SETTINGS: 'VIEWER'}

    onUpdate(result)
  }

  const hasCoadminAccess = () => {
    const accessKeys = Object.keys(access)
    const nonAdmin = accessKeys.find(
      key => access[key as keyof Access] !== 'EDITOR'
    )
    console.log('nonadmin' + nonAdmin)
    return nonAdmin === undefined
  }

  return (
    <Box>
      {!isThisMe && (
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={hasCoadminAccess()}
                onChange={e => {
                  updateCoadminAccess(e.target.checked)
                }}
                name="isCoadmin"
                color="primary"
              />
            }
            label="MAKE CO-ADMINISTRATOR OF STUDY"
            style={{
              marginBottom: hasCoadminAccess() ? '12px' : '42px',
              marginTop: '8px',
              fontFamily: latoFont,
            }}
          />
          {hasCoadminAccess() && (
            <Box mb={4} width={400}>
              Administrators have full access to a study. They can add/delete
              team members.
              <br />
              <br />
              <strong>Principal Investigators</strong> are required to be part
              of the study as a Study Administrator in order to launch a study.
            </Box>
          )}
        </Box>
      )}
      {isThisMe && hasCoadminAccess() && (
        <Box maxWidth="512px" mb={3} fontFamily={latoFont} fontSize="16px">
          As the Study Admin of this study, you have full view and editing
          capability of the entire study and its members.
          <br />
          <br />
          If you would like to transfer your responsibilities to another team
          member, add them to your study as a <strong>Co-administrator.</strong>
          <br />
          <br />
          <strong>Principal Investigators</strong> are required to be part of
          the study as a Study Administrator in order to launch a study.
        </Box>
      )}
      <table cellPadding="0" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th></th>
            <th className={classes.data}>No Access</th>
            <th className={classes.data}>Viewer</th>
            <th className={classes.data}>Editor</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role_key: AccessLabel, index: number) => (
            <tr key={index}>
              <td
                className={classes.cell}
                key={Object.values(role_key)[0] + index}>
                {Object.values(role_key)}
              </td>

              {AccessRestriction.map(restriction => (
                <td
                  className={clsx(classes.cell, classes.data)}
                  key={Object.values(role_key)[0] + restriction + index}>
                  <AccessGridRadioComponents
                    isEdit={isEdit}
                    restriction={restriction}
                    role_key={role_key}
                    isCoAdmin={hasCoadminAccess()}
                    currentUserIsAdmin={currentUserIsAdmin}
                    onUpdate={(e: React.ChangeEvent<HTMLInputElement>) => {
                      let restriction = e.target.value as
                        | typeof AccessRestriction[number]
                        | ''
                      updateAccess(restriction, role_key)
                    }}
                    isAllowedAccess={isAllowedAccess(restriction, role_key)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  )
}

export default AccessGrid
