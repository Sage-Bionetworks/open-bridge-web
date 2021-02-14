import React from 'react'
import NextPageIcon from '../../../assets/ParticipantManagerPageSelector/next_page_icon.svg'
import PreviousPageIcon from '../../../assets/ParticipantManagerPageSelector/previous_page_icon.svg'
import BackToBeginningIcon from '../../../assets/ParticipantManagerPageSelector/back_to_beginning_icon.svg'
import ForwardToEndIcon from '../../../assets/ParticipantManagerPageSelector/forward_to_end_icon.svg'
import PageBox from './PageBox'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  image: {
    color: 'black',
    marginLeft: '4px',
    marginRight: '4px',
  },
}))

const PageSelector: React.FC<{
  onPageSelected: Function
  currentPageSelected: number
}> = props => {
  const classes = useStyles()
  const pageNumbers = []
  for (let i = 1; i < 11; i++) {
    pageNumbers.push(i)
  }
  return (
    <div className={classes.container}>
      <img src={BackToBeginningIcon} className={classes.image}></img>
      <img src={PreviousPageIcon} className={classes.image}></img>
      {pageNumbers.map((element, index) => {
        return (
          <PageBox
            key={index}
            isSelected={element == props.currentPageSelected}
            pageNumber={element}
            onPageSelected={props.onPageSelected}
          />
        )
      })}
      <img src={NextPageIcon} className={classes.image}></img>
      <img src={ForwardToEndIcon} className={classes.image}></img>
    </div>
  )
}

export default PageSelector
