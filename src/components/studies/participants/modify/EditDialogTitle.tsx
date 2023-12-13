import DialogTitleWithClose from '@components/widgets/DialogTitleWithClose'
import {FunctionComponent} from 'react'

type EditDialogTitleProps = {
  onCancel: Function
  shouldWithdraw?: boolean
  batchEdit?: boolean
}
const EditDialogTitle: FunctionComponent<EditDialogTitleProps> = ({onCancel, shouldWithdraw, batchEdit}) => {
  const title = shouldWithdraw
    ? 'Withdraw'
    : !batchEdit
    ? 'Edit Participant Detail'
    : 'Batch Edit Multiple Participant Details '

  return <DialogTitleWithClose onCancel={() => onCancel()} title={title} />
}

export default EditDialogTitle
