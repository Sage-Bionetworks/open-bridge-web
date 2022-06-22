import {Step} from '@typedefs/surveys'

const Select: React.FunctionComponent<{
  step: Step
  isMulti?: boolean
  onChange: (step: Step) => void
}> = ({step, onChange}) => {
  return <>Select stuff</>
}

export default Select
