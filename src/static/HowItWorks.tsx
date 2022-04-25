import {ReactComponent as Step1} from '@assets/static/home_step1.svg'
import {ReactComponent as Step2} from '@assets/static/home_step2.svg'
import {ReactComponent as Step3} from '@assets/static/home_step3.svg'
import {ReactComponent as Step4} from '@assets/static/home_step4.svg'
import {ReactComponent as MoreArrow} from '@assets/static/more_arrow.svg'
import {Grid, Typography} from '@mui/material'
import {styled} from '@mui/material/styles'
import staticPagesTheme from '@style/staticPagesTheme'
import {latoFont} from '@style/theme'
import * as React from 'react'
import {FunctionComponent} from 'react'
import {Link} from 'react-router-dom'

const Item = styled('div')<{test?: number}>(({theme, test}) => ({
  //backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  //...theme.typography.body1,
  /*  ...theme.typography.body2,*/
  padding: theme.spacing(1),
  border: '1px solid black',
  textAlign: 'left',
  color: theme.palette.text.primary,
  background: test,
  borderRadius: 0,
}))

const info = [
  {
    title: 'How it works',
    intro:
      'A Study Designer selects the assessments and designs the schedule for a study.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis bibendum senectus amet diam dui felis est dolor tincidunt. Blandit penatibus odio viverra est nisl ut velit feugiat donec. Pulvinar nullam amet suspendisse faucibus auctor ac tellus. Sed cras dictum at volutpat. Scelerisque sem pharetra ac turpis ipsum condimentum a mattis amet.',
    link: 'www.google.com',
    image: <Step1 />,
  },
  {
    title: 'How it works',
    intro:
      ' A Study Coordinator recruits participants to the study and auto-distributes the study to the App Store',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis bibendum senectus amet diam dui felis est dolor tincidunt. Blandit penatibus odio viverra est nisl ut velit feugiat donec. Pulvinar nullam amet suspendisse faucibus auctor ac tellus. Sed cras dictum at volutpat. Scelerisque sem pharetra ac turpis ipsum condimentum a mattis amet.',
    link: 'www.google.com',
    image: <Step2 />,
  },
  {
    title: 'How it works',
    intro:
      'Study participants download the App and perform remote cognitive assessments using their own smartphone.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis bibendum senectus amet diam dui felis est dolor tincidunt. Blandit penatibus odio viverra est nisl ut velit feugiat donec. Pulvinar nullam amet suspendisse faucibus auctor ac tellus. Sed cras dictum at volutpat. Scelerisque sem pharetra ac turpis ipsum condimentum a mattis amet.',
    link: 'www.google.com',
    image: <Step3 />,
  },
  {
    title: 'How it works',
    intro: 'Data is uploaded to the Sage platform and made ready for analysis.',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis bibendum senectus amet diam dui felis est dolor tincidunt. Blandit penatibus odio viverra est nisl ut velit feugiat donec. Pulvinar nullam amet suspendisse faucibus auctor ac tellus. Sed cras dictum at volutpat. Scelerisque sem pharetra ac turpis ipsum condimentum a mattis amet.',
    link: 'www.google.com',
    image: <Step4 />,
  },
]

const HowItWorks: FunctionComponent = () => {
  return (
    <Grid
      container
      rowSpacing={{xs: 2, md: 59}}
      justifyContent="space-between"
      alignItems="center">
      {info.map((item, index) => (
        <>
          <Grid item xs={12} md={3}>
            <Item>
              <Typography variant="h2" mb={12}>
                {item.title}
              </Typography>
              <Typography variant="h1" sx={{color: '#37E7E7'}}>
                0{index + 1}
              </Typography>
              <Typography
                component="p"
                sx={{
                  py: 7,
                  fontSize: '24px',
                  lineJeight: '29px',
                  opacity: 0.6,
                }}>
                {item.intro}
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontFamily: latoFont,
                  fontStyle: 'normal',
                  fontWeight: '300',
                  fontSize: '14px',
                  lineHeight: '17px',
                  marginBottom: staticPagesTheme.spacing(4),
                }}>
                {item.body}
              </Typography>
              <Link
                to={item.link}
                style={{
                  color: '#37E7E7',
                  fontSize: '14px',
                  textDecoration: 'none',

                  display: 'flex',
                  lineHeight: '14px',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                Learn More&nbsp;&nbsp;
                <MoreArrow />
              </Link>
            </Item>
          </Grid>
          <Grid item xs={12} md={7}>
            <Item sx={{textAlign: {xs: 'center', md: 'right'}}}>
              {item.image}
            </Item>
          </Grid>
        </>
      ))}
    </Grid>
  )
}
export default HowItWorks
