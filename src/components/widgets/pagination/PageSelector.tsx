import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone'
import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone'

import {Box, Button, buttonClasses, styled} from '@mui/material'
import React from 'react'
import PageBox from './PageBox'

const StyledDots = styled(Box, {label: 'StyledDots'})(({theme}) => ({
  fontWeight: 700,
  fontSize: '18px',

  marginRight: '5px',
  color: '#D0D4D9',
}))

const NavButton = styled(Button, {label: 'NavButton'})(({theme}) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '7px 10px',
  width: '42px',
  height: '36px',
  background: '#FFFFFF',
  border: '1px solid #DFE2E6',
  borderRadius: '3px',
  color: '#515359',
  [`${buttonClasses.disabled}`]: {
    color: '#DFE2E6',
  },
  '&:first-of-type': {
    marginRight: theme.spacing(3),
  },
  '&:last-of-type': {
    marginLeft: '10px',
  },
}))

export type PageSelectorValues = 'FF' | 'F' | 'B' | 'BB'

type PageSelectorProps = {
  onPageSelected: Function
  currentPageSelected: number
  numberOfPages: number
  handlePageNavigationArrowPressed: Function
}

const PageSelector: React.FunctionComponent<PageSelectorProps> = ({
  onPageSelected,
  currentPageSelected,
  numberOfPages,
  handlePageNavigationArrowPressed,
}) => {
  const [pages, setPages] = React.useState<Array<number | string>>([])

  React.useEffect(() => {
    const shouldShowPage = (index: number) => {
      const lastIndexToShowGroup = numberOfPages - 5
      // always show first and last
      if (index === 0 || index === numberOfPages - 1) {
        return true
      }
      //always show current page

      if (index === currentPageSelected) {
        return true
      }
      //if current page < 4 -- show first 4
      if (currentPageSelected < 3 && index < 4) {
        console.log('i', index)
        return true
      }

      //if current page is in the last 4
      if (currentPageSelected > lastIndexToShowGroup + 1 && index > lastIndexToShowGroup) {
        console.log('i', index)
        return true
      }

      if (index === currentPageSelected - 1) {
        return true
      }
      if (index === currentPageSelected + 1) {
        return true
      }
      return false
    }

    const pagesTemp: Array<string | number> = []
    for (let i = 0; i < numberOfPages; i++) {
      if (shouldShowPage(i)) {
        pagesTemp.push(i)
      } else {
        if (pagesTemp[pagesTemp.length - 1] !== '...') {
          pagesTemp.push('...')
        }
      }
    }
    setPages(pagesTemp)
  }, [currentPageSelected, numberOfPages])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
      <NavButton
        onClick={() => handlePageNavigationArrowPressed('B')}
        disabled={currentPageSelected === 0}
        id="back-one-page-button">
        <ChevronLeftTwoToneIcon />
      </NavButton>
      {pages.map((element, index) =>
        isNaN(parseInt(element.toString())) ? (
          <StyledDots>...</StyledDots>
        ) : (
          <PageBox
            key={`page-box-${index}`}
            isSelected={element === currentPageSelected}
            pageNumber={parseInt(element.toString()) + 1}
            onPageSelected={onPageSelected}
            index={index}
          />
        )
      )}
      <NavButton
        onClick={() => handlePageNavigationArrowPressed('F')}
        disabled={currentPageSelected + 1 === numberOfPages}
        id="forward-one-page-button">
        <ChevronRightTwoToneIcon />
      </NavButton>
    </Box>
  )
}

export default PageSelector
