import CheckIcon from '@mui/icons-material/Check'
import {
  Box,
  Paper,
  Radio,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import {AdminRole} from '@typedefs/types'
import React, {FunctionComponent} from 'react'

const StyledTable = styled(Table, {label: 'StyledTable'})(({theme}) => ({
  [`& .${tableCellClasses.root}`]: {
    borderBottom: '1px solid #EAECEE',
    padding: '10px',

    fontSize: '14px',
    maxWidth: '200px',

    textAlign: 'center',

    fontWeight: 'normal',
    '&:first-of-type': {
      fontWeight: 700,
      textAlign: 'left',
    },
  },

  [`& .${tableCellClasses.head}`]: {
    backgroundColor: '#F1F3F5',
    padding: '10px',
    width: '20%',
    fontSize: '14px',
    maxWidth: '200px',
    '&:first-of-type': {
      width: '40%',
    },
  },
}))

const useStyles = makeStyles(theme => ({
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
  {STUDY_BUILDER: 'Study Builder'},
  {PARTICIPANT_MANAGER_ADHERENCE: 'Participant Manager & Adherence Data'},
  // {ADHERENCE_DATA: 'ADHERENCE DATA'},
  // {STUDY_DATA: 'STUDY DATA'},
  {ACCESS_SETTINGS: 'Access Settings'},
]

export const NO_ACCESS: Access = {
  STUDY_BUILDER: 'NO_ACCESS',
  PARTICIPANT_MANAGER_ADHERENCE: 'NO_ACCESS',
  //ADHERENCE_DATA: 'NO_ACCESS',
  //STUDY_DATA: 'NO_ACCESS',
  ACCESS_SETTINGS: 'VIEWER',
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
}
const AccessGridRadioComponents: React.FunctionComponent<AccessGridRadioComponentsProps> = ({
  restriction,
  role_key,

  currentUserIsAdmin,
  onUpdate,

  isAllowedAccess,
}) => {
  const classes = useStyles()

  const key = Object.keys(role_key)[0] as keyof Access
  let checkboxChecked = false
  if (!currentUserIsAdmin) {
    if (!isAllowedAccess) {
      return null
    }
    return (
      <Box mt={0} height="40px" display="flex" justifyContent="center" alignItems="center">
        <CheckIcon style={{color: 'black'}} />
      </Box>
    )
  }
  /* if (key === 'ACCESS_SETTINGS') {
    checkboxChecked = true
    if (restriction === 'NO_ACCESS') {
      return null
    }
    if (restriction === 'VIEWER' && isCoAdmin) {
      return null
    }
    if (restriction === 'EDITOR' && !isCoAdmin) {
      return (
        <Box fontSize="10px" fontStyle="italic" fontFamily={latoFont} fontWeight="normal">
          Only available to Administrators
        </Box>
      )
    }
  }*/
  return key === 'ACCESS_SETTINGS' && restriction === 'NO_ACCESS' ? null : (
    <Radio
      color="primary"
      checked={checkboxChecked || isAllowedAccess}
      disabled={restriction === 'VIEWER' && key !== 'ACCESS_SETTINGS'}
      value={restriction}
      onChange={e => onUpdate(e)}
      radioGroup={'group_' + Object.keys(role_key)}></Radio>
  )
}

export function userHasCoadminAccess(access: Access) {
  const accessKeys = Object.keys(access)
  const nonAdmin = accessKeys.find(key => access[key as keyof Access] !== 'EDITOR')

  return nonAdmin === undefined
}

const AccessGrid: FunctionComponent<AccessGridProps> = ({
  access,
  onUpdate,

  isThisMe,
  currentUserIsAdmin,
}: AccessGridProps) => {
  const classes = useStyles()

  const isAllowedAccess = (restriction: string, role_key: AccessLabel): boolean => {
    const key = Object.keys(role_key)[0] as keyof Access
    return access[key] === restriction
  }

  const updateAccess = (restriction: typeof AccessRestriction[number] | '', accessObject: AccessLabel) => {
    if (!onUpdate) {
      return
    }
    const accessKey = Object.keys(accessObject)[0]

    const updatedAccess = {...access, [accessKey]: restriction}
    //To be editor of access settings, you have to be study coadmin -- have all editor rights.
    // You can't have ACCESS_SETTINGS editor rights if you don't have editor rights on everything else.
    if (restriction !== 'EDITOR') {
      updatedAccess.ACCESS_SETTINGS = 'VIEWER'
    } else {
      if (accessKey === 'ACCESS_SETTINGS') {
        //if we are giving access settings edit access -- give edit access to everything else

        updatedAccess.PARTICIPANT_MANAGER_ADHERENCE = 'EDITOR'
        updatedAccess.STUDY_BUILDER = 'EDITOR'
      }
    }
    onUpdate(updatedAccess)
  }

  return (
    <Box>
      {!isThisMe && currentUserIsAdmin && (
        <Box>
          {userHasCoadminAccess(access) && (
            <Box mb={4} width={400}>
              Administrators have full access to a study. They can add/delete team members.
              <br />
              <br />
              <strong>Principal Investigators</strong> are required to be part of the study as a Study Administrator in
              order to launch a study.
            </Box>
          )}
        </Box>
      )}
      {isThisMe && userHasCoadminAccess(access) && (
        <Box maxWidth="512px" mb={3} fontFamily={latoFont} fontSize="16px">
          As the Study Administrator of this study, you have full view and editing capability of the entire study and
          its members.
          <br />
          <br />
          If you would like to transfer your responsibilities to another team member, add them to your study as a{' '}
          <strong>Co-administrator.</strong>
          <br />
          <br />
          <strong>Principal Investigators</strong> are required to be part of the study as a Study Administrator in
          order to launch a study.
        </Box>
      )}
      <Paper elevation={2}>
        <StyledTable cellPadding="0" cellSpacing="0" width="100%">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>No Access</TableCell>
              <TableCell>Viewer</TableCell>
              <TableCell>Editor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role_key: AccessLabel, index: number) => (
              <TableRow key={index}>
                <TableCell key={Object.values(role_key)[0] + index}>{Object.values(role_key)}</TableCell>

                {AccessRestriction.map(restriction => (
                  <TableCell key={Object.values(role_key)[0] + restriction + index}>
                    <AccessGridRadioComponents
                      restriction={restriction}
                      role_key={role_key}
                      isCoAdmin={userHasCoadminAccess(access)}
                      currentUserIsAdmin={currentUserIsAdmin && !isThisMe}
                      onUpdate={(e: React.ChangeEvent<HTMLInputElement>) => {
                        let restriction = e.target.value as typeof AccessRestriction[number] | ''
                        updateAccess(restriction, role_key)
                      }}
                      isAllowedAccess={isAllowedAccess(restriction, role_key)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Paper>
    </Box>
  )
}

export default AccessGrid
