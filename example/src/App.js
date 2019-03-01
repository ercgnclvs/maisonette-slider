import React, { Component } from 'react'

import MainCarousel from 'react-maisonette-slider'
import NavigationCarousel from 'react-maisonette-slider'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.mainCarousel = React.createRef();
    this.navigationCarousel = React.createRef();
  }

  render () {
    const mainCarouselOptions = {
      perPage: {
        768: 2,
        1024: 3
      },
      multipleDrag: false
    }

    const navigationCarouselOptions = {
      perPage: {
        768: 6,
        1024: 8
      },
      multipleDrag: true,
      onClick: (slide) => {
        this.mainCarousel.goTo(slide)
      }
    }

    return (
      <div>
        <MainCarousel ref={(node) => { this.mainCarousel = node }} options={mainCarouselOptions}>
          <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=0" alt="0" /></div>
          <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=1" alt="1" /></div>
          <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=2" alt="2" /></div>
          <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=3" alt="3" /></div>
          <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=4" alt="4" /></div>
          <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=5" alt="5" /></div>
          <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=6" alt="6" /></div>
          <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=7" alt="7" /></div>
          <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=8" alt="8" /></div>
          <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=9" alt="9" /></div>
        </MainCarousel>

        <button type="button" onClick={() => { this.mainCarousel.prev() }}>Prev</button>
        <button type="button" onClick={() => { this.mainCarousel.next() }}>Next</button>

        <NavigationCarousel ref={(node) => { this.navigationCarousel = node }} options={navigationCarouselOptions}>
          <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=0" alt="0" /></div>
          <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=1" alt="1" /></div>
          <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=2" alt="2" /></div>
          <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=3" alt="3" /></div>
          <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=4" alt="4" /></div>
          <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=5" alt="5" /></div>
          <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=6" alt="6" /></div>
          <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=7" alt="7" /></div>
          <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=8" alt="8" /></div>
          <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=9" alt="9" /></div>
        </NavigationCarousel>
      </div>
    )
  }
}
