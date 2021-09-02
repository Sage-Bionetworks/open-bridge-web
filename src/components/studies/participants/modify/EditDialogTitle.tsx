import {ReactComponent as PencilIcon} from '@assets/edit_pencil.svg'
import {ReactComponent as WithdrawIcon} from '@assets/withdraw.svg'
import DialogTitleWithClose from '@components/widgets/DialogTitleWithClose'
import {FunctionComponent} from 'react'

type EditDialogTitleProps = {
  onCancel: Function
  shouldWithdraw?: boolean
  batchEdit?: boolean
}
const EditDialogTitle: FunctionComponent<EditDialogTitleProps> = ({
  onCancel,
  shouldWithdraw,
  batchEdit,
}) => {
  const title = shouldWithdraw
    ? 'Withdraw'
    : !batchEdit
    ? 'Edit Participant Detail'
    : 'Batch Edit Multiple Participant Details '
  const Icon = shouldWithdraw ? WithdrawIcon : PencilIcon

  return (
    <DialogTitleWithClose onCancel={onCancel}>
      <>
        <Icon style={{width: '25px'}}></Icon>
        <span style={{paddingLeft: '8px'}}>{title}</span>
      </>
    </DialogTitleWithClose>
  )
}

export default EditDialogTitle
