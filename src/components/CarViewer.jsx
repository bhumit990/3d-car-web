import { useRef, useEffect, useState, useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/* ---- Single car model ---- */
function CarModel({ glbPath, scale = 1.0 }) {
  const { scene } = useGLTF(glbPath)

  // Compute normalization and center once per loaded model
  const bounds = useMemo(() => {
    if (!scene) return null

    // Traverse and configure materials once
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material]
          mats.forEach((mat) => {
            if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
              mat.envMapIntensity = 1.4
            }
          })
        }
      }
    })

    // 1. Reset scene base in case it was mutated
    scene.position.set(0, 0, 0)
    scene.scale.setScalar(1)
    scene.updateMatrixWorld(true)

    // 2. Compute bounding box on unscaled scene
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)

    // 3. Normalization scale (increased 30% from 2.8 to 3.64)
    const maxDim = Math.max(size.x, size.y, size.z)
    const desiredSize = 3.64
    const normScale = (desiredSize / maxDim) * scale

    return {
      scale: normScale,
      position: [-center.x * normScale, -center.y * normScale, -center.z * normScale],
    }
  }, [scene, scale])

  if (!bounds) return null

  return (
    <group scale={bounds.scale} position={bounds.position}>
      <primitive object={scene} />
    </group>
  )
}

/* ---- Loading placeholder ---- */
function CarLoader() {
  return (
    <Html center>
      <div style={{
        color: 'rgba(240,237,232,0.5)',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '13px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid rgba(232,82,26,0.3)',
          borderTopColor: '#e8521a',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        Loading model
      </div>
    </Html>
  )
}

/* ---- Scene lighting rig ---- */
function LightingRig() {
  return (
    <>
      {/* Ambient base */}
      <ambientLight intensity={0.25} color="#1a1820" />

      {/* Key light — optimized shadow map size (1024 instead of 2048) */}
      <directionalLight
        position={[-4, 5, 3]}
        intensity={1.8}
        color="#f0e8d8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={14}
        shadow-bias={-0.0005}
      />

      {/* Rim light */}
      <directionalLight
        position={[5, 2, -5]}
        intensity={0.9}
        color="#3060c8"
      />

      {/* Floor bounce */}
      <directionalLight
        position={[0, -3, 0]}
        intensity={0.3}
        color="#e8521a"
      />

      {/* Accent spot */}
      <pointLight
        position={[2, 1, 4]}
        intensity={0.6}
        color="#f07040"
        distance={10}
      />
    </>
  )
}

/* ---- Main exported component ---- */
export default function CarViewer({ car, isTransitioning }) {
  const [error, setError] = useState(false)
  const containerRef = useRef(null)
  const controlsRef = useRef(null)
  const [isInView, setIsInView] = useState(true)

  // Pause rendering when scrolled away from Hero to save 100% GPU
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.05 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // Smoothly reset orbit controls angle when car changes
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [car.id])

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(240,237,232,0.4)',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
      }}>
        Model unavailable
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        opacity: isTransitioning ? 0 : 1,
        transition: 'opacity 200ms cubic-bezier(0.16,1,0.3,1)',
        pointerEvents: isTransitioning ? 'none' : 'auto',
      }}
    >
      <Canvas
        frameloop={isInView ? 'always' : 'never'}
        dpr={[1, 1.5]}
        shadows
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ position: [0, 0.8, 5], fov: 40, near: 0.1, far: 100 }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#0a0a0c'), 0)
        }}
        style={{ background: 'transparent' }}
        onError={() => setError(true)}
      >
        <LightingRig />

        {/* HDR environment for reflections */}
        <Environment preset="warehouse" />

        {/* Optimized ground shadow */}
        <ContactShadows
          position={[0, -1.45, 0]}
          opacity={0.55}
          scale={13}
          blur={2.2}
          far={3.8}
          resolution={512}
          color="#000000"
        />

        <Suspense fallback={<CarLoader />}>
          <CarModel key={car.id} glbPath={car.glb} scale={car.scale} />
        </Suspense>

        {/* Orbit controls — horizontal only, smooth damping */}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={false}
          enableDamping={true}
          dampingFactor={0.06}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.2}
          rotateSpeed={0.55}
          target={[0, 0, 0]}
          makeDefault
        />
      </Canvas>
    </div>
  )
}
