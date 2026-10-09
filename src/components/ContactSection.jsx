import { useState, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import {
  MapPin, Phone, Envelope, Clock, ArrowRight,
  InstagramLogo, TwitterLogo, YoutubeLogo, FacebookLogo
} from '@phosphor-icons/react'
import styles from './ContactSection.module.css'

const HOURS = [
  { day: 'Monday – Friday', time: '9:00 AM – 7:00 PM' },
  { day: 'Saturday', time: '9:00 AM – 5:00 PM' },
  { day: 'Sunday', time: '11:00 AM – 4:00 PM' },
]

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', model: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errors, setErrors] = useState({})
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })
  const shouldReduceMotion = useReducedMotion()

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setStatus('sending')
    // Simulate async submit — replace with real endpoint
    setTimeout(() => setStatus('success'), 1400)
  }

  return (
    <section className={styles.section} id="contact" ref={sectionRef} aria-label="Contact and Dealership">

      {/* Top divider */}
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerLabel}>Dealership</span>
        <span className={styles.dividerLine} />
      </div>

      <div className={styles.grid}>
        {/* ---- Dealership info ---- */}
        <motion.div
          className={styles.infoCol}
          initial={shouldReduceMotion ? false : { opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.dealerName}>
            <p className={styles.dealerSub}>Authorised Dealer</p>
            <h2 className={styles.dealerTitle}>APEX Motors</h2>
            <p className={styles.dealerTagline}>Where performance meets precision.</p>
          </div>

          <dl className={styles.contactList}>
            <div className={styles.contactItem}>
              <dt><MapPin size={16} weight="regular" className={styles.icon} /><span className="sr-only">Address</span></dt>
              <dd>
                <span>1250 Motorsport Drive</span>
                <span>Los Angeles, CA 90001</span>
              </dd>
            </div>
            <div className={styles.contactItem}>
              <dt><Phone size={16} weight="regular" className={styles.icon} /><span className="sr-only">Phone</span></dt>
              <dd><a href="tel:+13105550190" className={styles.contactLink}>+1 (310) 555-0190</a></dd>
            </div>
            <div className={styles.contactItem}>
              <dt><Envelope size={16} weight="regular" className={styles.icon} /><span className="sr-only">Email</span></dt>
              <dd><a href="mailto:sales@apexmotors.com" className={styles.contactLink}>sales@apexmotors.com</a></dd>
            </div>
            <div className={styles.contactItem}>
              <dt><Clock size={16} weight="regular" className={styles.icon} /><span className="sr-only">Hours</span></dt>
              <dd className={styles.hours}>
                {HOURS.map((h) => (
                  <span key={h.day} className={styles.hourRow}>
                    <span className={styles.hourDay}>{h.day}</span>
                    <span className={styles.hourTime}>{h.time}</span>
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <div className={styles.ctaButtons}>
            <a href="tel:+13105550190" className={styles.btnOutline}>
              Call Dealer
              <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>

        {/* ---- Inquiry form ---- */}
        <motion.div
          className={styles.formCol}
          initial={shouldReduceMotion ? false : { opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h3 className={styles.formTitle}>Book a Test Drive</h3>
          <p className={styles.formSub}>Fill in your details and we will arrange a private viewing.</p>

          {status === 'success' ? (
            <div className={styles.successState} role="alert">
              <span className={styles.successMark}>✓</span>
              <p className={styles.successMsg}>Request received. We will contact you within 24 hours.</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-name" className={styles.label}>Full name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="James Holden"
                    autoComplete="name"
                  />
                  {errors.name && <span className={styles.errorText} role="alert">{errors.name}</span>}
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-email" className={styles.label}>Email address</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="james@example.com"
                    autoComplete="email"
                  />
                  {errors.email && <span className={styles.errorText} role="alert">{errors.email}</span>}
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-phone" className={styles.label}>Phone <span className={styles.optionalTag}>(optional)</span></label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    className={styles.input}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    autoComplete="tel"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-model" className={styles.label}>Vehicle of interest</label>
                  <select
                    id="contact-model"
                    name="model"
                    className={styles.input}
                    value={form.model}
                    onChange={handleChange}
                  >
                    <option value="">Select a model</option>
                    <option value="challenger">Dodge Challenger SRT Hellcat</option>
                    <option value="porsche">Porsche 911 GT3</option>
                    <option value="supra">Toyota Supra MK4</option>
                  </select>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="contact-message" className={styles.label}>Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what you're looking for and your preferred test drive date."
                />
                {errors.message && <span className={styles.errorText} role="alert">{errors.message}</span>}
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending...' : 'Submit Inquiry'}
                {status !== 'sending' && <ArrowRight size={16} />}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      {/* ---- Footer ---- */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>APEX</span>
            <span className={styles.footerLogoSub}>Motors</span>
          </div>

          <nav className={styles.footerNav} aria-label="Footer navigation">
            <a href="#hero" className={styles.footerLink}>Showroom</a>
            <a href="#specs" className={styles.footerLink}>Specifications</a>
            <a href="#contact" className={styles.footerLink}>Contact</a>
            <a href="#contact" className={styles.footerLink}>Privacy Policy</a>
          </nav>

          <div className={styles.socialLinks} aria-label="Social media">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <InstagramLogo size={18} weight="regular" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
              <TwitterLogo size={18} weight="regular" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
              <YoutubeLogo size={18} weight="regular" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
              <FacebookLogo size={18} weight="regular" />
            </a>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>© 2025 APEX Motors. All rights reserved.</p>
          <p className={styles.disclaimer}>Specifications subject to change without notice. Contact dealer for current availability.</p>
        </div>
      </footer>
    </section>
  )
}
