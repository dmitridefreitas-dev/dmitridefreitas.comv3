'use client'
import { ReactLenis } from '@studio-freight/react-lenis'

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={{ 
      lerp: 0.06, 
      duration: 1.5, 
      smoothTouch: true, 
      orientation: 'vertical', 
      gestureOrientation: 'vertical', 
      wheelMultiplier: 1.2, 
      touchMultiplier: 1.5, 
      infinite: false 
    }}>
      {children}
    </ReactLenis>
  )
}
