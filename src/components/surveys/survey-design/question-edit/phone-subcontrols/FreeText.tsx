import {Step} from '@typedefs/surveys'

const FreeText: React.FunctionComponent<{
  step: Step
  onChange: (step: Step) => void
}> = ({step, onChange}) => {
  return <>Select stuff</>
}

export default FreeText
