import {ReactComponent as MTB_Logo} from '@assets/static/mtb_logo_static_blue.svg'
import {ReactComponent as Northwestern_Logo} from '@assets/static/northwestern_logo.svg'
import {ReactComponent as PenState_Logo} from '@assets/static/pen_state_logo.svg'
import {ReactComponent as SageBio_Logo} from '@assets/static/sage_bio_logo.svg'
import {Box} from '@mui/material'

const Footer: React.FunctionComponent = () => {
  return (
    <Box
      p={6}
      display="flex"
      bgcolor={'#fff'}
      justifyContent="space-between"
      alignItems="center">
      <MTB_Logo title="MTB" />
      <Box
        display="flex"
        sx={{
          alignItems: 'center',
          '& >svg': {
            marginLeft: '60px',
          },
        }}>
        <Northwestern_Logo title="Northwestern University" />
        <SageBio_Logo title="Sage Bionetworks" />
        <PenState_Logo title="PennState" />
      </Box>
    </Box>
  )
}

export default Footer
