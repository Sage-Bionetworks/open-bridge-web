import {MTBHeadingH2} from '@components/widgets/Headings'
import React from 'react'

const Subsection: React.FunctionComponent<{heading: string}> = ({heading, children}) => {
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
