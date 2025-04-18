import EmblaCarousel from './js/EmblaCarousel'
import Header from './js/Header'
import Footer from './js/Footer'
import './css/base.css'
import './css/sandbox.css'
import './css/embla.css'

const OPTIONS = { dragFree: true, direction: 'rtl', loop: true }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const CustomEmblaCarousel = (props) => (
  <>
    <Header />
    <EmblaCarousel slides={SLIDES} options={OPTIONS} />
    <Footer />
  </>
)

export default CustomEmblaCarousel;