# react-maisonette-slider

> 

[![NPM](https://img.shields.io/npm/v/react-maisonette-slider.svg)](https://www.npmjs.com/package/maisonette-slider) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save maisonette-slider
```

## Usage

```jsx
import Carousel from 'maisonette-slider'

<Carousel>
  <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=0" alt="0" /></div>
  <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=1" alt="1" /></div>
  <div><img src="https://fakeimg.pl/350x200/ffaeb0/ffffff?text=2" alt="2" /></div>
  <div><img src="https://fakeimg.pl/350x200/fdffa8/201f15?text=3" alt="3" /></div>
</Carousel>
```

## Options

Siema comes with a few (optional) settings that you can change by passing an object as an argument. Default values are presented below.

```js
const options = {
  draggable: true,
  duration: 200,
  easing: 'ease-out',
  loop: false,
  multipleDrag: true,
  perPage: 1,
  rtl: false,
  startIndex: 0,
  threshold: 20,
  onInit: () => {},
  onClick: () => {},
  onChange: () => {}
};
```

**`duration`** (number)  
Slide transition duration in milliseconds.

**`easing`** (string)  
It is like a CSS `transition-timing-function` — describes acceleration curve.

**`perPage`** (number or object)  
The number of slides to be shown. It accepts a number or an object for complex responsive layouts.

**`startIndex`** (number)  
Index (zero-based) of the starting slide.

**`draggable`** (boolean)  
Use dragging and touch swiping.

**`multipleDrag`** (boolean)  
Allow dragging to move multiple slides.

**`threshold`** (number)  
Touch and mouse dragging threshold (in px).

**`loop`** (boolean)  
Loop the slides around.

**`rtl`** (boolean)  
Enables layout for languages written from right to left (like Hebrew or Arabic).

**`onInit`** (function)  
Runs immediately after initialization.

**`onChange`** (function)  
Runs after slide change.

**`onClick`** (function)  
Runs on slide click.

## API

As mentioned above, Siema doesn't come with many options - just a few useful methods. Combine it with some very basic JavaScript and voila!

**`prev(howManySlides = 1, callback)`**  
Go to previous item. Optionally slide few items backward by passing `howManySlides` (number) argument. Optional `callback` (function) available as a third argument .

**`next(howManySlides = 1, callback)`**  
Go to next item. Optionally slide few items forward by passing `howManySlides` (number) argument. Optional `callback` (function) available as a third argument.

**`goTo(index, callback)`**  
Go to item at particular `index` (number). Optional `callback` (function) available as a second argument.

**`remove(index, callback)`**  
Remove item at particular `index` (number). Optional `callback` (function) available as a second argument.

**`insert(item, index, callback)`**  
Insert new `item` (DOM element) at specific `index` (number) . Optional `callback` (function) available as a third argument.

**`prepend(item, callback)`**  
Prepend new `item` (DOM element). Optional `callback` (function) available as a second argument.

**`append(item, callback)`**  
Append new `item` (DOM element). Optional `callback` (function) available as a second argument.

**`destroy(restoreMarkup = false, callback)`**  
Remove all event listeners on instance. Use `restoreMarkup` to restore the initial markup inside selector. Optional `callback` (function) available as a third argument.

**`currentSlide`**  
Prints current slide index.

## License

MIT © [ercgnclvs](https://github.com/ercgnclvs)
