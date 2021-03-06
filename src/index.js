import React, { Component, createRef } from 'react'
import PropTypes from 'prop-types'

/**
 * Overrides default settings with custom ones.
 * @param {Object} options - Optional settings object.
 * @returns {Object} - Custom settings.
 */
const mergeSettings = (options) => {
  const settings = {
    dots: false,
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
    onChange: () => {},
    onClick: () => {}
  }

  const userSttings = options
  for (const attrname in userSttings) {
    settings[attrname] = userSttings[attrname]
  }

  return settings
}

/**
 * Determine if browser supports unprefixed transform property.
 * Google Chrome since version 26 supports prefix-less transform
 * @returns {string} - Transform property supported by client.
 */
const webkitOrNot = () => {
  const style = document.documentElement.style
  if (typeof style.transform === 'string') {
    return 'transform'
  }
  return 'WebkitTransform'
}

class Carousel extends Component {
  constructor (props) {
    super(props)

    this.carousel = createRef()

    // Merge defaults with user's settings
    const { options } = this.props
    this.state = {
      config: mergeSettings(options, this.carousel.current)
    }
  }

  componentDidMount () {
    // Resolve selector
    this.carousel = this.carousel.current

    // update perPage number dependable of user value
    this.resolveSlidesNumber()

    // Create global references
    this.carouselWidth = this.carousel.offsetWidth
    this.innerElements = [].slice.call(this.carousel.children)
    this.currentSlide = this.state.config.loop
      ? this.state.config.startIndex % this.innerElements.length
      : Math.max(
        0,
        Math.min(this.state.config.startIndex, this.innerElements.length - this.perPage)
      )
    this.transformProperty = webkitOrNot()
    this.allowItemClick = true

    // Bind all event handlers for referencability
    const handlers = [
      'resizeHandler',
      'touchstartHandler',
      'touchendHandler',
      'touchmoveHandler',
      'mousedownHandler',
      'mouseupHandler',
      'mouseleaveHandler',
      'mousemoveHandler',
      'clickHandler',
      'itemClickHandler'
    ]
    handlers.forEach(method => {
      this[method] = this[method].bind(this)
    })

    // Build markup and apply required styling to elements
    this.init()
  }

  /**
   * Attaches listeners to required events.
   */
  attachEvents () {
    // Resize element on window resize
    window.addEventListener('resize', this.resizeHandler)

    // If element is draggable / swipable, add event handlers
    if (this.state.config.draggable) {
      // Keep track pointer hold and dragging distance
      this.pointerDown = false
      this.drag = {
        startX: 0,
        endX: 0,
        startY: 0,
        letItGo: null,
        preventClick: false
      }

      // Touch events
      this.carousel.addEventListener('touchstart', this.touchstartHandler)
      this.carousel.addEventListener('touchend', this.touchendHandler)
      this.carousel.addEventListener('touchmove', this.touchmoveHandler)

      // Mouse events
      this.carousel.addEventListener('mousedown', this.mousedownHandler)
      this.carousel.addEventListener('mouseup', this.mouseupHandler)
      this.carousel.addEventListener('mouseleave', this.mouseleaveHandler)
      this.carousel.addEventListener('mousemove', this.mousemoveHandler)

      // Click
      this.carousel.addEventListener('click', this.clickHandler)
    }
  }

  /**
   * Detaches listeners from required events.
   */
  detachEvents () {
    window.removeEventListener('resize', this.resizeHandler)
    this.carousel.removeEventListener('touchstart', this.touchstartHandler)
    this.carousel.removeEventListener('touchend', this.touchendHandler)
    this.carousel.removeEventListener('touchmove', this.touchmoveHandler)
    this.carousel.removeEventListener('mousedown', this.mousedownHandler)
    this.carousel.removeEventListener('mouseup', this.mouseupHandler)
    this.carousel.removeEventListener('mouseleave', this.mouseleaveHandler)
    this.carousel.removeEventListener('mousemove', this.mousemoveHandler)
    this.carousel.removeEventListener('click', this.clickHandler)
  }

  /**
   * Builds the markup and attaches listeners to required events.
   */
  init () {
    this.attachEvents()

    // hide everything out of selector's boundaries
    this.carousel.style.overflow = 'hidden'

    // rtl or ltr
    this.carousel.style.direction = this.state.config.rtl ? 'rtl' : 'ltr'

    // build a frame and slide to a currentSlide
    this.buildSliderFrame()

    // add pagination dots if dots: true
    if (this.state.config.dots) {
      this.addPagination()
    }

    this.state.config.onInit.call(this)
  }

  /**
   * Build a sliderFrame and slide to a current item.
   */
  buildSliderFrame () {
    const widthItem = this.carouselWidth / this.perPage
    const itemsToBuild = this.state.config.loop ? this.innerElements.length + (2 * this.perPage) : this.innerElements.length

    // Create frame and apply styling
    this.sliderFrame = document.createElement('div')
    this.sliderFrame.style.width = `${widthItem * itemsToBuild}px`
    this.enableTransition()

    if (this.state.config.draggable) {
      this.carousel.style.cursor = '-webkit-grab'
    }

    // Create a document fragment to put slides into it
    const docFragment = document.createDocumentFragment()

    // Loop through the slides, add styling and add them to document fragment
    if (this.state.config.loop) {
      for (let i = this.innerElements.length - this.perPage; i < this.innerElements.length; i++) {
        const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true))
        docFragment.appendChild(element)
      }
    }
    for (let i = 0; i < this.innerElements.length; i++) {
      const element = this.buildSliderFrameItem(this.innerElements[i])
      docFragment.appendChild(element)
    }
    if (this.state.config.loop) {
      for (let i = 0; i < this.perPage; i++) {
        const element = this.buildSliderFrameItem(this.innerElements[i].cloneNode(true))
        docFragment.appendChild(element)
      }
    }

    // Add fragment to the frame
    this.sliderFrame.appendChild(docFragment)

    // Clear selector (just in case something is there) and insert a frame
    this.carousel.innerHTML = ''
    this.carousel.appendChild(this.sliderFrame)

    // Go to currently active slide after initial build
    this.slideToCurrent()
  }

  buildSliderFrameItem (elm) {
    const elementContainer = document.createElement('div')
    elementContainer.style.cssFloat = this.state.config.rtl ? 'right' : 'left'
    elementContainer.style.float = this.state.config.rtl ? 'right' : 'left'
    elementContainer.style.width = `${this.state.config.loop ? 100 / (this.innerElements.length + (this.perPage * 2)) : 100 / (this.innerElements.length)}%`
    elementContainer.appendChild(elm)
    elementContainer.addEventListener('click', this.itemClickHandler)
    return elementContainer
  }

  /**
   * Determinates slides number accordingly to clients viewport.
   */
  resolveSlidesNumber () {
    if (typeof this.state.config.perPage === 'number') {
      this.perPage = this.state.config.perPage
    } else if (typeof this.state.config.perPage === 'object') {
      this.perPage = 1
      for (const viewport in this.state.config.perPage) {
        if (window.innerWidth >= viewport) {
          this.perPage = this.state.config.perPage[viewport]
        }
      }
    }
  }

  /**
   * Go to previous slide.
   * @param {number} [howManySlides=1] - How many items to slide backward.
   * @param {function} callback - Optional callback function.
   */
  prev (howManySlides = 1, callback) {
    // early return when there is nothing to slide
    if (this.innerElements.length <= this.perPage) {
      return
    }

    const beforeChange = this.currentSlide

    if (this.state.config.loop) {
      const isNewIndexClone = this.currentSlide - howManySlides < 0
      if (isNewIndexClone) {
        this.disableTransition()

        const mirrorSlideIndex = this.currentSlide + this.innerElements.length
        const mirrorSlideIndexOffset = this.perPage
        const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset
        const offset = (this.state.config.rtl ? 1 : -1) * moveTo * (this.carouselWidth / this.perPage)
        const dragDistance = this.state.config.draggable ? this.drag.endX - this.drag.startX : 0

        this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`
        this.currentSlide = mirrorSlideIndex - howManySlides
      } else {
        this.currentSlide = this.currentSlide - howManySlides
      }
    } else {
      this.currentSlide = Math.max(this.currentSlide - howManySlides, 0)
    }

    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent(this.state.config.loop)
      this.state.config.onChange.call(this)
      if (callback) {
        callback.call(this)
      }
    }
  }

  /**
   * Go to next slide.
   * @param {number} [howManySlides=1] - How many items to slide forward.
   * @param {function} callback - Optional callback function.
   */
  next (howManySlides = 1, callback) {
    // early return when there is nothing to slide
    if (this.innerElements.length <= this.perPage) {
      return
    }

    const beforeChange = this.currentSlide

    if (this.state.config.loop) {
      const isNewIndexClone = this.currentSlide + howManySlides > this.innerElements.length - this.perPage
      if (isNewIndexClone) {
        this.disableTransition()

        const mirrorSlideIndex = this.currentSlide - this.innerElements.length
        const mirrorSlideIndexOffset = this.perPage
        const moveTo = mirrorSlideIndex + mirrorSlideIndexOffset
        const offset = (this.state.config.rtl ? 1 : -1) * moveTo * (this.carouselWidth / this.perPage)
        const dragDistance = this.state.config.draggable ? this.drag.endX - this.drag.startX : 0

        this.sliderFrame.style[this.transformProperty] = `translate3d(${offset + dragDistance}px, 0, 0)`
        this.currentSlide = mirrorSlideIndex + howManySlides
      } else {
        this.currentSlide = this.currentSlide + howManySlides
      }
    } else {
      this.currentSlide = Math.min(this.currentSlide + howManySlides, this.innerElements.length - this.perPage)
    }
    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent(this.state.config.loop)
      this.state.config.onChange.call(this)
      if (callback) {
        callback.call(this)
      }
    }
  }

  /**
   * Disable transition on sliderFrame.
   */
  disableTransition () {
    this.sliderFrame.style.webkitTransition = `all 0ms ${this.state.config.easing}`
    this.sliderFrame.style.transition = `all 0ms ${this.state.config.easing}`
  }

  /**
   * Enable transition on sliderFrame.
   */
  enableTransition () {
    this.sliderFrame.style.webkitTransition = `all ${this.state.config.duration}ms ${this.state.config.easing}`
    this.sliderFrame.style.transition = `all ${this.state.config.duration}ms ${this.state.config.easing}`
  }

  /**
   * Go to slide with particular index
   * @param {number} index - Item index to slide to.
   * @param {function} callback - Optional callback function.
   */
  goTo (index, callback) {
    if (this.innerElements.length <= this.perPage) {
      return
    }
    const beforeChange = this.currentSlide
    this.currentSlide = this.state.config.loop
      ? index % this.innerElements.length
      : Math.min(Math.max(index, 0), this.innerElements.length - this.perPage)
    if (beforeChange !== this.currentSlide) {
      this.slideToCurrent()
      this.state.config.onChange.call(this)
      if (callback) {
        callback.call(this)
      }
    }
  }

  /**
   * Moves sliders frame to position of currently active slide
   */
  slideToCurrent (enableTransition) {
    const currentSlide = this.state.config.loop ? this.currentSlide + this.perPage : this.currentSlide
    const offset = (this.state.config.rtl ? 1 : -1) * currentSlide * (this.carouselWidth / this.perPage)

    if (enableTransition) {
      // This one is tricky, I know but this is a perfect explanation:
      // https://youtu.be/cCOL7MC4Pl0
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          this.enableTransition()
          this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`
        })
      })
    } else {
      this.sliderFrame.style[this.transformProperty] = `translate3d(${offset}px, 0, 0)`
    }
  }

  /**
   * Recalculate drag /swipe event and reposition the frame of a slider
   */
  updateAfterDrag () {
    const movement = (this.state.config.rtl ? -1 : 1) * (this.drag.endX - this.drag.startX)
    const movementDistance = Math.abs(movement)
    const howManySliderToSlide = this.state.config.multipleDrag ? Math.ceil(movementDistance / (this.carouselWidth / this.perPage)) : 1

    const slideToNegativeClone = movement > 0 && this.currentSlide - howManySliderToSlide < 0
    const slideToPositiveClone = movement < 0 && this.currentSlide + howManySliderToSlide > this.innerElements.length - this.perPage

    if (movement > 0 && movementDistance > this.state.config.threshold && this.innerElements.length > this.perPage) {
      this.prev(howManySliderToSlide)
    } else if (movement < 0 && movementDistance > this.state.config.threshold && this.innerElements.length > this.perPage) {
      this.next(howManySliderToSlide)
    }
    this.slideToCurrent(slideToNegativeClone || slideToPositiveClone)
  }

  /**
   * When window resizes, resize slider components as well
   */
  resizeHandler () {
    // update perPage number dependable of user value
    this.resolveSlidesNumber()

    // relcalculate currentSlide
    // prevent hiding items when browser width increases
    if (this.currentSlide + this.perPage > this.innerElements.length) {
      this.currentSlide = this.innerElements.length <= this.perPage ? 0 : this.innerElements.length - this.perPage
    }

    this.carouselWidth = this.carousel.offsetWidth

    this.buildSliderFrame()
  }

  /**
   * Clear drag after touchend and mouseup event
   */
  clearDrag () {
    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      letItGo: null,
      preventClick: this.drag.preventClick
    }
  }

  /**
   * touchstart event handler
   */
  touchstartHandler (e) {
    // Prevent dragging / swiping on inputs, selects and textareas
    const ignore = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(e.target.nodeName) !== -1
    if (ignore) {
      return
    }

    e.stopPropagation()
    this.pointerDown = true
    this.drag.startX = e.touches[0].pageX
    this.drag.startY = e.touches[0].pageY
  }

  /**
   * touchend event handler
   */
  touchendHandler (e) {
    e.stopPropagation()
    this.pointerDown = false
    this.enableTransition()
    if (this.drag.endX) {
      this.updateAfterDrag()
    }
    this.clearDrag()
  }

  /**
   * touchmove event handler
   */
  touchmoveHandler (e) {
    e.stopPropagation()

    if (this.drag.letItGo === null) {
      this.drag.letItGo = Math.abs(this.drag.startY - e.touches[0].pageY) < Math.abs(this.drag.startX - e.touches[0].pageX)
    }

    if (this.pointerDown && this.drag.letItGo) {
      e.preventDefault()
      this.drag.endX = e.touches[0].pageX
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.state.config.easing}`
      this.sliderFrame.style.transition = `all 0ms ${this.state.config.easing}`

      const currentSlide = this.state.config.loop ? this.currentSlide + this.perPage : this.currentSlide
      const currentOffset = currentSlide * (this.carouselWidth / this.perPage)
      const dragOffset = (this.drag.endX - this.drag.startX)
      const offset = this.state.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.state.config.rtl ? 1 : -1) * offset}px, 0, 0)`
    }
  }

  /**
   * mousedown event handler
   */
  mousedownHandler (e) {
    // Prevent dragging / swiping on inputs, selects and textareas
    const ignore = ['TEXTAREA', 'OPTION', 'INPUT', 'SELECT'].indexOf(e.target.nodeName) !== -1
    if (ignore) {
      return
    }

    e.preventDefault()
    e.stopPropagation()
    this.pointerDown = true
    this.drag.startX = e.pageX
  }

  /**
   * mouseup event handler
   */
  mouseupHandler (e) {
    e.stopPropagation()
    this.pointerDown = false
    this.carousel.style.cursor = '-webkit-grab'
    this.enableTransition()
    if (this.drag.endX) {
      this.updateAfterDrag()
    }
    this.clearDrag()
  }

  /**
   * mousemove event handler
   */
  mousemoveHandler (e) {
    e.preventDefault()
    if (this.pointerDown) {
      // if dragged element is a link
      // mark preventClick prop as a true
      // to detemine about browser redirection later on
      if (e.target.nodeName === 'A') {
        this.drag.preventClick = true
      }

      this.allowItemClick = false

      this.drag.endX = e.pageX
      this.carousel.style.cursor = '-webkit-grabbing'
      this.sliderFrame.style.webkitTransition = `all 0ms ${this.state.config.easing}`
      this.sliderFrame.style.transition = `all 0ms ${this.state.config.easing}`

      const currentSlide = this.state.config.loop ? this.currentSlide + this.perPage : this.currentSlide
      const currentOffset = currentSlide * (this.carouselWidth / this.perPage)
      const dragOffset = (this.drag.endX - this.drag.startX)
      const offset = this.state.config.rtl ? currentOffset + dragOffset : currentOffset - dragOffset
      this.sliderFrame.style[this.transformProperty] = `translate3d(${(this.state.config.rtl ? 1 : -1) * offset}px, 0, 0)`
    }
  }

  /**
   * mouseleave event handler
   */
  mouseleaveHandler (e) {
    if (this.pointerDown) {
      this.pointerDown = false
      this.carousel.style.cursor = '-webkit-grab'
      this.drag.endX = e.pageX
      this.drag.preventClick = false
      this.enableTransition()
      this.updateAfterDrag()
      this.clearDrag()
    }
  }

  /**
   * click event handler
   */
  clickHandler (e) {
    // if the dragged element is a link
    // prevent browsers from folowing the link
    if (this.drag.preventClick) {
      e.preventDefault()
    }
    this.drag.preventClick = false
  }

  /**
   * click event handler
   */
  addPagination () {
    // create a div to encapsulate all buttons
    // and give it a class nav
    const navDiv = document.createElement('nav')

    // check how many items we have inside a carousel
    // and create that many buttons and apend them to nav div
    // add a listened event to each of them to navigate to prticular slide
    for (let i = 0; i < this.innerElements.length; i++) {
      const btn = document.createElement('button')
      btn.textContent = i
      btn.addEventListener('click', () => this.goTo(i))
      navDiv.appendChild(btn)
    }

    // place the nav div after siema markup
    this.carousel.parentNode.insertBefore(navDiv, this.carousel.nextSibling)
  }

  /**
   * carousel item click event handler
   */
  itemClickHandler (e) {
    if (this.allowItemClick) {
      const clickedSlide = [...this.sliderFrame.children].indexOf(e.currentTarget)
      this.state.config.onClick.call(this, clickedSlide)
    }

    this.allowItemClick = true
  }

  /**
   * Remove item from carousel.
   * @param {number} index - Item index to remove.
   * @param {function} callback - Optional callback to call after remove.
   */
  remove (index, callback) {
    if (index < 0 || index >= this.innerElements.length) {
      throw new Error('Item to remove doesn\'t exist 😭')
    }

    // Shift sliderFrame back by one item when:
    // 1. Item with lower index than currenSlide is removed.
    // 2. Last item is removed.
    const lowerIndex = index < this.currentSlide
    const lastItem = this.currentSlide + this.perPage - 1 === index

    if (lowerIndex || lastItem) {
      this.currentSlide--
    }

    this.innerElements.splice(index, 1)

    // build a frame and slide to a currentSlide
    this.buildSliderFrame()

    if (callback) {
      callback.call(this)
    }
  }

  /**
   * Insert item to carousel at particular index.
   * @param {HTMLElement} item - Item to insert.
   * @param {number} index - Index of new new item insertion.
   * @param {function} callback - Optional callback to call after insert.
   */
  insert (item, index, callback) {
    if (index < 0 || index > this.innerElements.length + 1) {
      throw new Error('Unable to inset it at this index 😭')
    }
    if (this.innerElements.indexOf(item) !== -1) {
      throw new Error('The same item in a carousel? Really? Nope 😭')
    }

    // Avoid shifting content
    const shouldItShift = index <= this.currentSlide > 0 && this.innerElements.length
    this.currentSlide = shouldItShift ? this.currentSlide + 1 : this.currentSlide

    this.innerElements.splice(index, 0, item)

    // build a frame and slide to a currentSlide
    this.buildSliderFrame()

    if (callback) {
      callback.call(this)
    }
  }

  /**
   * Prepernd item to carousel.
   * @param {HTMLElement} item - Item to prepend.
   * @param {function} callback - Optional callback to call after prepend.
   */
  prepend (item, callback) {
    this.insert(item, 0)
    if (callback) {
      callback.call(this)
    }
  }

  /**
   * Append item to carousel.
   * @param {HTMLElement} item - Item to append.
   * @param {function} callback - Optional callback to call after append.
   */
  append (item, callback) {
    this.insert(item, this.innerElements.length + 1)
    if (callback) {
      callback.call(this)
    }
  }

  /**
   * Removes listeners and optionally restores to initial markup
   * @param {boolean} restoreMarkup - Determinants about restoring an initial markup.
   * @param {function} callback - Optional callback function.
   */
  destroy (restoreMarkup = false, callback) {
    this.detachEvents()

    this.carousel.style.cursor = 'auto'

    if (restoreMarkup) {
      const slides = document.createDocumentFragment()
      for (let i = 0; i < this.innerElements.length; i++) {
        slides.appendChild(this.innerElements[i])
      }
      this.carousel.innerHTML = ''
      this.carousel.appendChild(slides)
      this.carousel.removeAttribute('style')
    }

    if (callback) {
      callback.call(this)
    }
  }

  render () {
    return (
      <div ref={this.carousel}>
        {this.props.children}
      </div>
    )
  }
}

Carousel.propTypes = {
  children: PropTypes.any,
  options: PropTypes.object
}

export default Carousel
