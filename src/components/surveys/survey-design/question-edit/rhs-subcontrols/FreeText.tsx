import {Step} from '@typedefs/surveys'

const FreeText: React.FunctionComponent<{
  step: Step
  onChange: (step: Step) => void
}> = ({step, onChange}) => {
  return <>SFree Text rhs</>
}

export default FreeText
