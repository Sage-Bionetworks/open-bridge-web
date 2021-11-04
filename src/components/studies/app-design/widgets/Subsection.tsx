import React from 'react'
import {MTBHeadingH2} from '../../../widgets/Headings'

const Subsection: React.FunctionComponent<{heading: string}> = ({
  heading,
  children,
}) => {
  return (
    <li>
      <div style={{width: '100%'}}>
        <MTBHeadingH2>{heading}</MTBHeadingH2>
        {children}
      </div>
    </li>
  )
}

export default Subsection
