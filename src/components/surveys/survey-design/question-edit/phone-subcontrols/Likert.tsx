import {styled} from '@mui/material'
import {LikertQuestion, Step} from '@typedefs/surveys'

const StyledContainer = styled('div', {label: 'StyledContainer'})(({}) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}))

const Scale = styled('div', {label: 'Scale'})<{
  width: number
}>(({theme, width}) => ({
  position: 'relative',
  height: '46px',
  textAlign: 'center',
  width: `${width}px`,
  margin: '0 auto',
}))

const Labels = styled('div', {label: 'labels'})(({theme}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: theme.spacing(5, -4, 0, -4),
  '& > *': {
    width: '80px',
  },
  '& *:first-of-type': {
    textAlign: 'left',
  },
  '& *:last-of-type': {
    textAlign: 'right',
  },
}))

const CircleContainer = styled('div', {label: 'Circle'})<{
  left: number
  cradius: number
}>(({theme, left, cradius}) => ({
  left: `${left}px`,
  textAlign: 'center',
  width: `${cradius * 2}px`,
  position: 'absolute',
  '&> div.circle': {
    width: `${cradius * 2}px`,
    height: `${cradius * 2}px`,
    borderRadius: '50%',
    backgroundColor: ' #B0B0B6',
    background: '#B0B0B6',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
}))
const Line = styled('div', {label: 'Line'})<{width?: number}>(
  ({theme, width}) => ({
    backgroundColor: ' #B0B0B6',
    height: '2px',
    top: '7px',
    width: `100%`,
    position: 'absolute',
    background: ' #D3D3DB',
    boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
  })
)

const Likert: React.FunctionComponent<{
  step: LikertQuestion
  onChange: (step: Step) => void
}> = ({step, onChange}) => {
  const circleRadius = 8
  const {minimumValue, maximumValue, minimumLabel, maximumLabel} =
    step.inputItem.formatOptions
  const range = maximumValue - minimumValue + 1
  //const width = range > 3 ? 125 : 100
  const width = 125
  return (
    <StyledContainer>
      <Scale width={width} key="scale">
        <Line />
        {[...new Array(range)].map((item, index) => (
          <CircleContainer
            key={item}
            left={(width / (range - 1)) * index - circleRadius}
            cradius={circleRadius}>
            <div className="circle" />
            {index + minimumValue}
          </CircleContainer>
        ))}
        <Labels>
          <span> {minimumLabel} </span>
          <span> {maximumLabel} </span>
        </Labels>
      </Scale>
    </StyledContainer>
  )
}

export default Likert
