import React from 'react'

import ReadOnlyWindowTemplate from './ReadOnlyWindowTemplate'

type ReadOnlyNotificationWindowProps = {
  index: number
  notificationHeader: string
  notificationMessage: string
  notificationTimeText: string
}

const ReadOnlyNotificationWindow: React.FunctionComponent<ReadOnlyNotificationWindowProps> = ({
  index,
  notificationHeader,
  notificationMessage,
  notificationTimeText,
}) => {
  return (
    <ReadOnlyWindowTemplate
      title={`${index}: ${index === 1 ? 'Initial Notification' : 'Follow-up Notification'}`}
      type="NOTIFICATION">
      <strong>Notification Message</strong> <br />
      <i>{notificationHeader}</i>
      <br />
      {notificationMessage}
      <br />
      <br />
      <strong>Notify Participant</strong>
      <br />
      {notificationTimeText}
    </ReadOnlyWindowTemplate>
  )
}

export default ReadOnlyNotificationWindow
