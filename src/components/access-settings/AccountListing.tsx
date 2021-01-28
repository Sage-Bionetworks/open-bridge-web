import { Box, Divider, makeStyles, Theme } from '@material-ui/core'
import React, { FunctionComponent, ReactNode } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import AccessService from '../../services/access.service'
import { globals } from '../../style/theme'
import { OrgUser } from '../../types/types'
import Loader from '../widgets/Loader'
import SideBarListItem from '../widgets/SideBarListItem'
import AccessGrid, { Access, getAccessFromRoles } from './AccessGrid'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  listing: {
    width: theme.spacing(39),
    marginRight: theme.spacing(15),
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    paddingTop: theme.spacing(4),
    paddingRight: 0,
  },
  list: globals.listReset,
}))

type AccountListingProps = {
  token: string
  children?: ReactNode
  members: OrgUser[]
}

const NameDisplay: FunctionComponent<any> = ({
  firstName,
  lastName,
  email,
  id,
  ...rest
}): JSX.Element => {
  const firstLine =
    firstName || lastName ? (
      <strong>
        {[firstName, lastName].join(' ')} <br />
      </strong>
    ) : (
      <></>
    )

  return (
    <>
      {firstLine} <span>{email}</span>
    </>
  )
}

const AccountListing: FunctionComponent<AccountListingProps> = ({
  token,
  members,
  children,
}: AccountListingProps) => {
  const classes = useStyles()

  const handleError = useErrorHandler()

  const [currentMemberId, setCurrentMemberId] = React.useState(members[0].id)
  const [access, setAccess] = React.useState<Access | undefined>()
  const [isAccessLoading, setIsAccessLoading] = React.useState(true)

  const updateAccess = async (memberId: string) => {
    setIsAccessLoading(true)
    const member = await AccessService.getIndividualAccount(token, memberId)
    console.log(member.roles.join(','))
    const access = getAccessFromRoles(member.roles)

    setAccess(access)
    setIsAccessLoading(false)
  }

  React.useEffect(() => {
    ;(async function (id) {
      updateAccess(id)
    })(currentMemberId)
  }, [currentMemberId])

  return (
    <Box className={classes.root}>
      <Box className={classes.listing}>
        <h3>Team Members</h3>
        <ul className={classes.list}>
          {members.map((member: any, index: number) => (
            <SideBarListItem
              itemKey={member.id}
              variant={'dark'}
              isOpen={true}
              isActive={member.id === currentMemberId}
              onClick={() => setCurrentMemberId(member.id)}
            >
              <div style={{paddingLeft: '8px', textAlign: 'left'}}>
                <NameDisplay {...member}></NameDisplay>
              </div>
            </SideBarListItem>
          ))}
        </ul>
        <Divider />
        {children}
      </Box>
      <Loader reqStatusLoading={!access || isAccessLoading}>
        <AccessGrid
          access={access!}
          onUpdate={(_access: Access) => setAccess(_access)}
          isEdit={true}
        ></AccessGrid>
      </Loader>
    </Box>
  )
}

export default AccountListing
