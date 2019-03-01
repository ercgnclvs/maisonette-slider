import React, { Component } from 'react'

import ExampleComponent from 'react-maisonette-slider'

export default class App extends Component {
  render () {
    const options = {
      perPage: {
        768: 2,
        1024: 3
      },
      multipleDrag: true,
      loop: true
    }

    return (
      <div>
        <ExampleComponent options={options}>
          <div><img src='https://pawelgrzybek.com/siema/assets/siema--pink.svg' alt='Siema' /></div>
          <div><img src='https://pawelgrzybek.com/siema/assets/siema--yellow.svg' alt='Siema' /></div>
          <div><img src='https://pawelgrzybek.com/siema/assets/siema--pink.svg' alt='Siema' /></div>
          <div><img src='https://pawelgrzybek.com/siema/assets/siema--yellow.svg' alt='Siema' /></div>
        </ExampleComponent>
      </div>
    )
  }
}
