import { useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'motion/react'
import { CARS } from '../data/cars'
import styles from './SpecsSection.module.css'

function StatTile({ label, value, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.4 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={styles.statTile}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </motion.div>
  )
}

export default function SpecsSection({ activeCarIndex }) {
  const car = CARS[activeCarIndex]
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()

  const allSpecs = [
    { label: 'Engine', value: car.specs.engine },
    { label: 'Horsepower', value: car.specs.horsepower },
    { label: 'Torque', value: car.specs.torque },
    { label: 'Top Speed', value: car.specs.topSpeed },
    { label: '0–60 mph', value: car.specs.acceleration },
    { label: 'Transmission', value: car.specs.transmission },
    { label: 'Drivetrain', value: car.specs.drivetrain },
    { label: 'Curb Weight', value: car.specs.weight },
  ]

  return (
    <section className={styles.section} id="specs" ref={sectionRef} aria-label="Car Specifications">
      {/* Section divider */}
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerLabel}>Specifications</span>
        <span className={styles.dividerLine} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={car.id}
          className={styles.content}
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className={styles.header}>
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className={styles.headerLeft}
            >
              <p className={styles.brand}>{car.name}</p>
              <h2 className={styles.modelName}>{car.model}</h2>
            </motion.div>

            <motion.p
              className={styles.description}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {car.description}
            </motion.p>
          </div>

          {/* Stats grid — 4 cols */}
          <div className={styles.statsGrid}>
            {allSpecs.map((spec, i) => (
              <StatTile key={spec.label} label={spec.label} value={spec.value} index={i} />
            ))}
          </div>

          {/* Car selector tabs */}
          <div className={styles.carTabs}>
            {CARS.map((c, i) => (
              <div
                key={c.id}
                className={`${styles.carTab} ${i === activeCarIndex ? styles.carTabActive : ''}`}
              >
                <span className={styles.carTabBrand}>{c.name}</span>
                <span className={styles.carTabModel}>{c.model}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
