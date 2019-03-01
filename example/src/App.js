import React, { Component } from 'react'

import MainCarousel from 'react-maisonette-slider'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.carousel = React.createRef();
  }

  componentDidMount() {
    console.log(this.carousel)
  }

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
        <MainCarousel ref={(node) => { this.carousel = node }} options={options}>
          <div><img src='https://pawelgrzybek.com/siema/assets/siema--pink.svg' alt='Picsum' /></div>
          <div><img src='https://pawelgrzybek.com/siema/assets/siema--yellow.svg' alt='Picsum' /></div>
          <div><img src='https://pawelgrzybek.com/siema/assets/siema--pink.svg' alt='Picsum' /></div>
          <div><img src='https://pawelgrzybek.com/siema/assets/siema--yellow.svg' alt='Picsum' /></div>
        </MainCarousel>

        <button type="button" onClick={() => { this.carousel.prev() }}>Prev</button>
        <button type="button" onClick={() => { this.carousel.next() }}>Next</button>
      </div>
    )
  }
}
