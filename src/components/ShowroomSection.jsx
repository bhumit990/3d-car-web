import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { CARS } from '../data/cars'
import styles from './ShowroomSection.module.css'

const HIGHLIGHTS = [
  {
    label: 'Pure Power',
    body: 'Three cars. Three philosophies. One undeniable truth — raw, unfiltered performance.',
  },
  {
    label: 'Precision Craft',
    body: 'Every component chosen for performance. Every line drawn for purpose.',
  },
  {
    label: 'Living Legend',
    body: 'Icons that defined an era. Machines still relevant decades after they rolled off the line.',
  },
]

export default function ShowroomSection({ activeCarIndex }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()
  const car = CARS[activeCarIndex]

  return (
    <section className={styles.section} id="showroom" ref={ref} aria-label="Showroom overview">
      {/* Large display text */}
      <div className={styles.displayRow}>
        <motion.span
          className={styles.displayText}
          initial={shouldReduceMotion ? false : { opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          PERFORMANCE
        </motion.span>
        <motion.span
          className={styles.displayTextOutline}
          initial={shouldReduceMotion ? false : { opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          DEFINED
        </motion.span>
      </div>

      {/* Three highlight columns */}
      <div className={styles.highlightGrid}>
        {HIGHLIGHTS.map((h, i) => (
          <motion.div
            key={h.label}
            className={styles.highlight}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.highlightNumber}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.highlightLabel}>{h.label}</span>
            <p className={styles.highlightBody}>{h.body}</p>
          </motion.div>
        ))}
      </div>

      {/* Current car pull-quote */}
      <motion.blockquote
        key={car.id}
        className={styles.pullQuote}
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className={styles.pullQuoteText}>"{car.tagline}"</p>
        <cite className={styles.pullQuoteCite}>{car.name} {car.model}</cite>
      </motion.blockquote>
    </section>
  )
}
