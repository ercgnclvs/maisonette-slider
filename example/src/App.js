import React, { Component } from 'react'

import MainCarousel from 'react-maisonette-slider'
import NavigationCarousel from 'react-maisonette-slider'

export default class App extends Component {
  constructor(props) {
    super(props);

    this.mainCarousel = React.createRef();
    this.navigationCarousel = React.createRef();
  }

  componentDidMount() {
    // set inital 'is-active' slides
    const mainOffsetSlide = this.mainCarousel.currentSlide + this.mainCarousel.perPage - 1
    this.navigationCarousel.innerElements.forEach(slide => {
      slide.classList.remove('is-active');
      const index = this.navigationCarousel.innerElements.indexOf(slide);
      if (index <= mainOffsetSlide && index >= this.mainCarousel.currentSlide) {
        slide.classList.add('is-active');
      }
    });
  }

  render () {
    const mainCarouselOptions = {
      perPage: {
        768: 3,
        1024: 4
      },
      multipleDrag: false,
      onChange: () => {
        const mainOffsetSlide = this.mainCarousel.currentSlide + this.mainCarousel.perPage - 1
        const navigationOffsetSlide = this.navigationCarousel.currentSlide + this.navigationCarousel.perPage - 1
        if (mainOffsetSlide > navigationOffsetSlide) {
          const slide = this.mainCarousel.currentSlide + this.mainCarousel.perPage - this.navigationCarousel.perPage;
          this.navigationCarousel.goTo(slide)
        }

        if (this.mainCarousel.currentSlide < this.navigationCarousel.currentSlide) {
          this.navigationCarousel.goTo(this.mainCarousel.currentSlide)
        }

        // set 'is-active' class on navigation carousel
        this.navigationCarousel.innerElements.forEach(slide => {
          slide.classList.remove('is-active');
          const index = this.navigationCarousel.innerElements.indexOf(slide);
          if (index <= mainOffsetSlide && index >= this.mainCarousel.currentSlide) {
            slide.classList.add('is-active');
          }
        });
      }
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
          <div className='slide'><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=0" alt="0" /></div>
          <div className='slide'><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=1" alt="1" /></div>
          <div className='slide'><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=2" alt="2" /></div>
          <div className='slide'><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=3" alt="3" /></div>
          <div className='slide'><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=4" alt="4" /></div>
          <div className='slide'><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=5" alt="5" /></div>
          <div className='slide'><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=6" alt="6" /></div>
          <div className='slide'><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=7" alt="7" /></div>
          <div className='slide'><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=8" alt="8" /></div>
          <div className='slide'><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=9" alt="9" /></div>
        </NavigationCarousel>
      </div>
    )
  }
}
