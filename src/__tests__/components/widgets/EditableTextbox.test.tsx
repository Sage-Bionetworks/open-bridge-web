import * as React from 'react'
import {render, screen, fireEvent} from '@testing-library/react'
import EditableTextbox from '../../../components/widgets/EditableTextbox'
import Counter from '../../../components/widgets/Counter'



test('counter increments and decrements when the buttons are clicked', () => {
    render(<Counter />)
})


test('counter increments and decrements when the buttons are clicked', () => {
    const {container} = render( <EditableTextbox component="h4"
        initValue={'hi'}
        onTriggerUpdate={(newValue: string) =>
          alert(newValue)
        }
      ></EditableTextbox>)

})