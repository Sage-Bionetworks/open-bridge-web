import { Box, makeStyles, Radio } from '@material-ui/core'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'

const useStyles = makeStyles(theme => ({
  cell: {
    borderBottom: '1px solid black',
    
    padding: '10px'
  },
  data: {
    width: '100px',
    textAlign: 'center'
    
  },
  dot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    margin: 'auto',
    backgroundColor: 'black'
  }
}))

export const AccessRestriction = ['NO_ACCESS', 'VIEWER', 'EDITOR']

type AccessGridProps = {
  access: Access
  onUpdate?: Function
  isEdit?: boolean
}

export type AccessLabel = {
  [key: string]: string
}

export type Access = {
  STUDY_BUILDER: typeof AccessRestriction[number]
  PARTICIPANT_MANAGER: typeof AccessRestriction[number]
  ADHERENCE_DATA: typeof AccessRestriction[number]
  STUDY_DATA: typeof AccessRestriction[number]
}

const roles: AccessLabel[] = [
  { STUDY_BUILDER: 'STUDY BUILDER' },
  { PARTICIPANT_MANAGER: 'PARTICIPANT MANAGER' },
  { ADHERENCE_DATA: 'ADHERENCE DATA' },
  { STUDY_DATA: 'STUDY DATA' },
]


const AccessGrid: FunctionComponent<AccessGridProps> = ({
  access,
  onUpdate,
  isEdit,
}: AccessGridProps) => {
  const classes = useStyles()


  const isEqualToCurrentValue = (restriction: string, role_key: AccessLabel): boolean =>{
    const key = Object.keys(role_key)[0] as keyof(Access)
    return access[key] === restriction
  }

  const updateAccess = (restriction: string, accessObject: AccessLabel) => {
    if(!onUpdate) {
      return
    }
    const accessKey = Object.keys(accessObject)[0]
    onUpdate({ ...access, [accessKey]: restriction })
  }

  return (
    <Box>
      <h3>Access Type</h3>
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
            <td className={classes.cell} key={Object.values(role_key)[0]+index}>{Object.values(role_key)}</td>

            {AccessRestriction.map(restriction => (
              <td className={clsx(classes.cell, classes.data)}  key={Object.values(role_key)[0]+restriction+index}>
                {! isEdit && isEqualToCurrentValue(restriction,role_key) ? <div className={classes.dot}/> :<>&nbsp;</>
                }
                {isEdit && <Radio
                  checked={isEqualToCurrentValue(restriction,role_key)}
                  value={restriction}
                  onChange={e => {
       
                    updateAccess(e.target.value, role_key)
                  }}
                  radioGroup={'group_' + Object.keys(role_key)}
                ></Radio>}
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
