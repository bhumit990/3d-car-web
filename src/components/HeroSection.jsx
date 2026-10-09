import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'
import CarViewer from './CarViewer'
import { CARS } from '../data/cars'
import styles from './HeroSection.module.css'

const TRANSITION_DURATION = 240 // ms

export default function HeroSection({ onCarChange }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = next, -1 = prev
  const shouldReduceMotion = useReducedMotion()
  const transitionTimer = useRef(null)

  const activeCar = CARS[activeIndex]

  const changeCar = useCallback((newIndex, dir) => {
    if (isTransitioning) return
    setDirection(dir)
    setIsTransitioning(true)

    transitionTimer.current = setTimeout(() => {
      setActiveIndex(newIndex)
      onCarChange?.(newIndex)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, TRANSITION_DURATION / 2)
  }, [isTransitioning, onCarChange])

  const handlePrev = () => {
    const newIdx = (activeIndex - 1 + CARS.length) % CARS.length
    changeCar(newIdx, -1)
  }

  const handleNext = () => {
    const newIdx = (activeIndex + 1) % CARS.length
    changeCar(newIdx, 1)
  }

  useEffect(() => {
    return () => clearTimeout(transitionTimer.current)
  }, [])

  const textVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir * 30,
      y: shouldReduceMotion ? 0 : 4,
    }),
    center: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.04,
      },
    },
    exit: (dir) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir * -20,
      transition: { duration: 0.18, ease: [0.7, 0, 0.84, 0] },
    }),
  }

  const specVariants = {
    enter: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    center: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] },
    }),
    exit: { opacity: 0, transition: { duration: 0.2 } },
  }

  const topSpecs = [
    { label: 'Engine', value: activeCar.specs.engine },
    { label: 'Power', value: activeCar.specs.horsepower },
    { label: '0–60 mph', value: activeCar.specs.acceleration },
    { label: 'Top Speed', value: activeCar.specs.topSpeed },
  ]

  return (
    <section className={styles.hero} id="hero" aria-label="Car Showroom Hero">
      {/* Background grid lines */}
      <div className={styles.gridLines} aria-hidden="true" />

      {/* Floor reflection line */}
      <div className={styles.floorLine} aria-hidden="true" />

      {/* ---- NAV ---- */}
      <nav className={styles.nav} aria-label="Site navigation">
        <div className={styles.navBrand}>
          <span className={styles.navLogo}>APEX</span>
          <span className={styles.navSub}>Motors</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#showroom" className={styles.navLink}>Showroom</a>
          <a href="#specs" className={styles.navLink}>Specifications</a>
          <a href="#contact" className={styles.navLink}>Contact</a>
        </div>
        <a href="#contact" className={styles.navCta}>Book a Drive</a>
      </nav>

      {/* ---- MAIN HERO CONTENT ---- */}
      <div className={styles.heroContent}>
        {/* Left panel — car identity */}
        <div className={styles.leftPanel}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeCar.id}
              className={styles.carIdentity}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={direction}
            >
              <p className={styles.carBrand}>{activeCar.name}</p>
              <h1 className={styles.carName}>{activeCar.model}</h1>
              <p className={styles.carTagline}>{activeCar.tagline}</p>
            </motion.div>
          </AnimatePresence>

          {/* Specs strip */}
          <AnimatePresence mode="wait">
            <div key={activeCar.id + '-specs'} className={styles.specsStrip}>
              {topSpecs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  className={styles.specItem}
                  custom={i}
                  variants={specVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <span className={styles.specValue}>{spec.value}</span>
                  <span className={styles.specLabel}>{spec.label}</span>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {/* CTA & ARROWS */}
          <div className={styles.ctaRow}>
            <a href="#specs" className={styles.ctaPrimary}>View Specs</a>
            
            <div className={styles.arrowNav}>
              <button
                className={styles.arrowBtn}
                onClick={handlePrev}
                disabled={isTransitioning}
                aria-label="Previous car"
              >
                <CaretLeft size={22} weight="thin" />
              </button>
              <button
                className={styles.arrowBtn}
                onClick={handleNext}
                disabled={isTransitioning}
                aria-label="Next car"
              >
                <CaretRight size={22} weight="thin" />
              </button>
            </div>
          </div>
        </div>

        {/* Center — 3D canvas */}
        <div className={styles.canvasContainer}>
          {/* Mobile flanking arrows on left and right of the car */}
          <button
            className={`${styles.flankingArrow} ${styles.flankingArrowPrev}`}
            onClick={handlePrev}
            disabled={isTransitioning}
            aria-label="Previous car"
          >
            <CaretLeft size={22} weight="bold" />
          </button>

          <CarViewer car={activeCar} isTransitioning={isTransitioning} />

          <button
            className={`${styles.flankingArrow} ${styles.flankingArrowNext}`}
            onClick={handleNext}
            disabled={isTransitioning}
            aria-label="Next car"
          >
            <CaretRight size={22} weight="bold" />
          </button>

          {/* Drag hint */}
          <p className={styles.dragHint} aria-hidden="true">
            <span className={styles.dragIcon}>↔</span> Drag to rotate
          </p>
        </div>

        {/* Right panel — car counter */}
        <div className={styles.rightPanel}>
          <div className={styles.carCounter}>
            {CARS.map((car, i) => (
              <button
                key={car.id}
                className={`${styles.counterDot} ${i === activeIndex ? styles.counterDotActive : ''}`}
                onClick={() => changeCar(i, i > activeIndex ? 1 : -1)}
                aria-label={`Select ${car.model}`}
                disabled={isTransitioning}
              />
            ))}
          </div>
          <div className={styles.indexDisplay}>
            <span className={styles.indexCurrent}>{String(activeIndex + 1).padStart(2, '0')}</span>
            <span className={styles.indexSep} />
            <span className={styles.indexTotal}>{String(CARS.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* ---- SCROLL INDICATOR ---- */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <motion.div
          className={styles.scrollDot}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </section>
  )
}
