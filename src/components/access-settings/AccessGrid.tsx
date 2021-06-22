import { Box, makeStyles, Radio } from '@material-ui/core'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { latoFont } from '../../style/theme'
import { AdminRole } from '../../types/types'

const useStyles = makeStyles(theme => ({
  cell: {
    borderBottom: '1px solid black',
    padding: '10px',
    fontFamily: latoFont,
    fontSize: '14px',
  },
  data: {
    width: '100px',
    textAlign: 'center',
    fontFamily: latoFont,
    fontSize: '14px',
  },
  dot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    margin: 'auto',
    backgroundColor: 'black',
  },
}))

export const AccessRestriction = ['NO_ACCESS', 'VIEWER', 'EDITOR']

type AccessGridProps = {
  access: Access
  onUpdate?: Function
  isEdit?: boolean
  isCoadmin?: boolean
}

export type AccessLabel = {
  [key: string]: string
}

export type Access = {
  STUDY_BUILDER: typeof AccessRestriction[number]
  PARTICIPANT_MANAGER: typeof AccessRestriction[number]
  ADHERENCE_DATA: typeof AccessRestriction[number]
  STUDY_DATA: typeof AccessRestriction[number]
  ACCESS_SETTINGS: typeof AccessRestriction[number]
}

const roles: AccessLabel[] = [
  { STUDY_BUILDER: 'STUDY BUILDER' },
  { PARTICIPANT_MANAGER: 'PARTICIPANT MANAGER' },
  { ADHERENCE_DATA: 'ADHERENCE DATA' },
  { STUDY_DATA: 'STUDY DATA' },
  { ACCESS_SETTINGS: 'ACCESS SETTINGS' },
]

export const NO_ACCESS: Access = {
  STUDY_BUILDER: 'NO_ACCESS',
  PARTICIPANT_MANAGER: 'NO_ACCESS',
  ADHERENCE_DATA: 'NO_ACCESS',
  STUDY_DATA: 'NO_ACCESS',
  ACCESS_SETTINGS: 'NO_ACCESS',
}

export function getRolesFromAccess(access: Access): AdminRole[] {
  if (access.STUDY_BUILDER === 'EDITOR') {
    return ['org_admin', 'admin', 'researcher', 'developer']
  }
  if (access.ADHERENCE_DATA === 'VIEWER') {
    return ['researcher']
  }
  return ['study_coordinator', 'developer']
}

export function getAccessFromRoles(roles: AdminRole[]): Access {
  if (roles.includes('org_admin')) {
    return {
      STUDY_BUILDER: 'EDITOR',
      PARTICIPANT_MANAGER: 'EDITOR',
      ADHERENCE_DATA: 'EDITOR',
      STUDY_DATA: 'EDITOR',
      ACCESS_SETTINGS: 'EDITOR',
    }
  }

  if (roles.includes('researcher')) {
    return {
      STUDY_BUILDER: 'VIEWER',
      PARTICIPANT_MANAGER: 'EDITOR',
      ADHERENCE_DATA: 'EDITOR',
      STUDY_DATA: 'VIEWER',
      ACCESS_SETTINGS: 'VIEWER',
    }
  }

  if (roles.includes('developer')) {
    return {
      STUDY_BUILDER: 'EDITOR',
      PARTICIPANT_MANAGER: 'VIEWER',
      ADHERENCE_DATA: 'VIEWER',
      STUDY_DATA: 'VIEWER',
      ACCESS_SETTINGS: 'VIEWER',
    }
  }

  return NO_ACCESS
}

const AccessGrid: FunctionComponent<AccessGridProps> = ({
  access,
  onUpdate,
  isEdit,
  isCoadmin,
}: AccessGridProps) => {
  const classes = useStyles()

  const isEqualToCurrentValue = (
    restriction: string,
    role_key: AccessLabel,
  ): boolean => {
    const key = Object.keys(role_key)[0] as keyof Access
    return access[key] === restriction
  }

  const updateAccess = (restriction: string, accessObject: AccessLabel) => {
    if (!onUpdate) {
      return
    }
    const accessKey = Object.keys(accessObject)[0]
    onUpdate({ ...access, [accessKey]: restriction })
  }

  const getRadioButtonDisplay = (
    restriction: string,
    role_key: AccessLabel,
    isCoadmin: boolean,
  ) => {
    const key = Object.keys(role_key)[0] as keyof Access
    let checkboxChecked = false
    if (key === 'ACCESS_SETTINGS') {
      checkboxChecked = true
      if (restriction === 'NO_ACCESS') {
        return null
      }
      if (restriction === 'VIEWER' && isCoadmin) {
        return null
      }
      if (restriction === 'EDITOR' && !isCoadmin) {
        return (
          <Box
            fontSize="10px"
            fontStyle="italic"
            fontFamily={latoFont}
            mt={-2.5}
            fontWeight="bold"
          >
            Only available to Administrators
          </Box>
        )
      }
    }

    return (
      <Radio
        checked={
          checkboxChecked || isEqualToCurrentValue(restriction, role_key)
        }
        value={restriction}
        onChange={e => {
          updateAccess(e.target.value, role_key)
        }}
        radioGroup={'group_' + Object.keys(role_key)}
      ></Radio>
    )
  }

  return (
    <Box>
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
                key={Object.values(role_key)[0] + index}
              >
                {Object.values(role_key)}
              </td>

              {AccessRestriction.map(restriction => (
                <td
                  className={clsx(classes.cell, classes.data)}
                  key={Object.values(role_key)[0] + restriction + index}
                >
                  {!isEdit && isEqualToCurrentValue(restriction, role_key) ? (
                    <div className={classes.dot} />
                  ) : (
                    <>&nbsp;</>
                  )}
                  {isEdit &&
                    getRadioButtonDisplay(
                      restriction,
                      role_key,
                      isCoadmin ||
                        getRolesFromAccess(access).includes('org_admin'),
                    )}
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
