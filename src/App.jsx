import { useState, useEffect } from 'react'
import { useProgress, useGLTF } from '@react-three/drei'
import { CARS } from './data/cars'
import HeroSection from './components/HeroSection'
import ShowroomSection from './components/ShowroomSection'
import SpecsSection from './components/SpecsSection'
import ContactSection from './components/ContactSection'

// Preload models
CARS.forEach(car => {
  useGLTF.preload(car.glb)
})

export default function App() {
  const [activeCarIndex, setActiveCarIndex] = useState(0)
  const { progress, active } = useProgress()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setLoaded(true), 500) // Small delay to ensure smooth transition
    }
  }, [progress])

  return (
    <>
      {!loaded && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#0a0a0c',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e8521a',
          fontFamily: 'Outfit, sans-serif'
        }}>
          <div style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '36px',
            letterSpacing: '0.15em',
            marginBottom: '20px',
            color: '#f0ede8'
          }}>
            APEX <span style={{ fontSize: '16px', letterSpacing: '0.2em', color: '#e8521a' }}>MOTORS</span>
          </div>
          <div style={{
            width: '240px',
            height: '2px',
            background: 'rgba(255,255,255,0.1)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              background: '#e8521a',
              width: `${progress}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ marginTop: '16px', fontSize: '11px', color: 'rgba(240,237,232,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Initializing Showroom — {Math.round(progress)}%
          </div>
        </div>
      )}
      <main style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease', height: loaded ? 'auto' : '100vh', overflow: loaded ? 'visible' : 'hidden' }}>
        <HeroSection onCarChange={setActiveCarIndex} />
        <ShowroomSection activeCarIndex={activeCarIndex} />
        <SpecsSection activeCarIndex={activeCarIndex} />
        <ContactSection />
      </main>
    </>
  )
}
