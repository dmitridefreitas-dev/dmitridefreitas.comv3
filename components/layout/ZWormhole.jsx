'use client';
import { createContext, useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import dynamic from 'next/dynamic';

export const ActiveSceneContext = createContext(false);
export const NavigateContext    = createContext(() => {});

/* ── lazy-load all real section content ─────────────────────────────────── */
const HeroToggler       = dynamic(() => import('@/components/hero/HeroToggler'),             { ssr: false });
const InfoBanner        = dynamic(() => import('@/components/sections/InfoBanner'),           { ssr: false });
const AcademicTicker    = dynamic(() => import('@/components/sections/FinanceTicker'),        { ssr: false });
const SkillsNetwork     = dynamic(() => import('@/components/sections/SkillsNetwork'),        { ssr: false });
const TimelineScroll    = dynamic(() => import('@/components/sections/TimelineScroll'),      { ssr: false });
const AboutContent      = dynamic(() => import('@/components/sections/AboutContent'),         { ssr: false });
const ProjectsContent   = dynamic(() => import('@/components/sections/ProjectsContent'),      { ssr: false });
const ContactPage       = dynamic(() => import('@/components/sections/ContactContent'),       { ssr: false });

/* ── wormhole constants ──────────────────────────────────────────────────── */
const SCENE_DEPTH      = 2500;
const SCENE_LABELS     = ['HOME', 'NETWORK', 'CAREER', 'ABOUT', 'PROJECTS', 'CONTACT'];
const SCENE_COUNT      = SCENE_LABELS.length;
const MAX_Z            = SCENE_DEPTH * (SCENE_COUNT - 1);
const FRICTION         = 0.87;
const SNAP_THRESHOLD   = 0.3;
const SNAP_LERP        = 0.07;
const SCROLL_MUL       = 2.0;

/* ── scene content ───────────────────────────────────────────────────────── */
function HomeScene() {
  return (
    <>
      <HeroToggler />
      <InfoBanner />
      <AcademicTicker />
    </>
  );
}
function NetworkScene()  { return <SkillsNetwork />; }
function CareerScene()   { return <TimelineScroll />; }
function AboutScene()    { return <AboutContent />; }
function ProjectsScene() { return <ProjectsContent />; }
function ContactScene()  { return <ContactPage />; }

const SCENES = [HomeScene, NetworkScene, CareerScene, AboutScene, ProjectsScene, ContactScene];

/* ── main component ──────────────────────────────────────────────────────── */
export default function ZWormhole() {
  const worldRef      = useRef(null);
  const shellRefs     = useRef([]);
  const scrollRefs    = useRef([]);
  const vignetteRef   = useRef(null);
  const stateRef      = useRef({ cameraZ: 0, velocity: 0 });
  const tweenRef      = useRef(null);
  const activeSc      = useRef(0);
  const [activeScene, setActiveScene] = useState(0);
  const [showHint,    setShowHint]    = useState(true);
  const [hoveredDot,  setHoveredDot]  = useState(-1);

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  function applyCamera(z) {
    if (worldRef.current) {
      worldRef.current.style.transform = `translateZ(${z}px)`;
    }
    const speed = Math.abs(stateRef.current.velocity);
    const activeIdx = z / SCENE_DEPTH;
    for (let i = 0; i < SCENE_COUNT; i++) {
      const el = shellRefs.current[i];
      if (!el) continue;
      const dist = Math.abs(activeIdx - i);
      if (dist > 1.5) {
        // Far away — just hide, skip opacity calc
        if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden';
        continue;
      }
      const opacity = Math.max(0, 1 - (dist / 1) * 0.95);
      el.style.opacity    = String(opacity);
      el.style.visibility = dist > 0.6 ? 'hidden' : 'visible';
    }
    if (vignetteRef.current) {
      vignetteRef.current.style.opacity = speed > 4 ? '1' : '0';
    }
  }

  // Set a scene's inner scroll position on arrival.
  // forward = arrived by scrolling down (land at top); backward = arrived by scrolling up (land at bottom).
  function setArrivalScroll(idx, forward) {
    const inner = scrollRefs.current[idx];
    if (!inner) return;
    inner.scrollTop = forward ? 0 : inner.scrollHeight;
  }

  const navigateTo = useCallback((idx) => {
    const forward = idx >= activeSc.current;
    if (tweenRef.current) tweenRef.current.kill();
    stateRef.current.velocity = 0;
    tweenRef.current = gsap.to(stateRef.current, {
      cameraZ: idx * SCENE_DEPTH,
      duration: 1.8,
      ease: 'power3.inOut',
      onUpdate: () => applyCamera(stateRef.current.cameraZ),
      onComplete: () => {
        tweenRef.current = null;
        setArrivalScroll(idx, forward);
      },
    });
    activeSc.current = idx;
    setActiveScene(idx);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(Observer);

    const obs = Observer.create({
      type: 'wheel,touch',
      preventDefault: true,
      onChangeY(self) {
        // Cancel any dot-nav tween
        if (tweenRef.current) {
          tweenRef.current.kill();
          tweenRef.current = null;
        }

        // Touch swipe direction is opposite to wheel delta — negate for touch
        const isTouch = self.event && self.event.type && self.event.type.startsWith('touch');
        const dy = isTouch ? -self.deltaY : self.deltaY;

        const inner = scrollRefs.current[activeSc.current];
        const atTop = !inner || inner.scrollTop <= 0;
        const atBot = !inner || inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 4;

        // Scroll within scene content when there's room
        if (dy > 0 && !atBot) { inner.scrollTop += dy; return; }
        if (dy < 0 && !atTop) { inner.scrollTop += dy; return; }

        // At the boundary — Z-travel
        stateRef.current.velocity += dy * SCROLL_MUL;
      },
    });

    const tick = () => {
      const s = stateRef.current;
      if (tweenRef.current) return;

      s.velocity *= FRICTION;

      if (Math.abs(s.velocity) < SNAP_THRESHOLD) {
        const nearest = Math.round(s.cameraZ / SCENE_DEPTH);
        const snapZ   = Math.max(0, Math.min(MAX_Z, nearest * SCENE_DEPTH));
        s.cameraZ    += (snapZ - s.cameraZ) * SNAP_LERP;
        s.velocity    = 0;
        const newScene = Math.round(snapZ / SCENE_DEPTH);
        if (newScene !== activeSc.current) {
          const forward = newScene > activeSc.current;
          activeSc.current = newScene;
          setActiveScene(newScene);
          setArrivalScroll(newScene, forward);
        }
      } else {
        s.cameraZ += s.velocity;
        s.cameraZ  = Math.max(0, Math.min(MAX_Z, s.cameraZ));
        if ((s.cameraZ <= 0 && s.velocity < 0) || (s.cameraZ >= MAX_Z && s.velocity > 0)) {
          s.velocity = 0;
        }
        const newScene = Math.round(s.cameraZ / SCENE_DEPTH);
        if (newScene !== activeSc.current) {
          activeSc.current = newScene;
          setActiveScene(newScene);
        }
      }

      applyCamera(s.cameraZ);
    };

    gsap.ticker.add(tick);
    gsap.ticker.fps(60);

    return () => {
      obs.kill();
      gsap.ticker.remove(tick);
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, overflow: 'hidden',
      background: '#02030A',
      perspective: '1200px', perspectiveOrigin: '50% 50%',
      zIndex: 10,
    }}>
      {/* 3D world — NavigateContext lets any scene call navigateTo */}
      <NavigateContext.Provider value={navigateTo}>
        <div ref={worldRef} style={{
          position: 'absolute', inset: 0,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          transform: 'translateZ(0px)',
        }}>
          {SCENES.map((SceneComp, i) => (
            <div
              key={i}
              ref={(el) => { shellRefs.current[i] = el; }}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100vw', height: '100vh',
                transform: `translateZ(${-i * SCENE_DEPTH}px)`,
                backfaceVisibility: 'hidden',
                willChange: 'opacity',
                opacity: i === 0 ? 1 : 0,
                visibility: i === 0 ? 'visible' : 'hidden',
              }}
            >
              {/* inner scroll container */}
              <div
                ref={(el) => { scrollRefs.current[i] = el; }}
                style={{
                  width: '100%', height: '100%',
                  overflowY: 'auto', overflowX: 'hidden',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  transform: 'translateZ(0)',
                }}
              >
                <ActiveSceneContext.Provider value={activeScene === i}>
                  <SceneComp />
                </ActiveSceneContext.Provider>
              </div>
            </div>
          ))}
        </div>
      </NavigateContext.Provider>

      {/* Speed vignette — driven by ref, not React state */}
      <div ref={vignetteRef} style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
        opacity: 0,
        transition: 'opacity 0.25s ease',
      }} />

      {/* ── HUD ── */}

      {/* Logo */}
      <div
        onClick={() => navigateTo(0)}
        style={{
          position: 'fixed', top: 32, left: 40, zIndex: 200,
          fontFamily: 'var(--font-space-grotesk)', fontSize: 15,
          fontWeight: 700, color: '#F9FAFB', letterSpacing: '-0.01em',
          textShadow: '0 0 20px rgba(0,212,255,0.25)',
          cursor: 'pointer', userSelect: 'none',
        }}
      >
        D. De Freitas
      </div>

      {/* Side dots */}
      <div style={{
        position: 'fixed', right: 32, top: '50%', transform: 'translateY(-50%)',
        zIndex: 200, display: 'flex', flexDirection: 'column',
        alignItems: 'flex-end', gap: 18,
      }}>
        {SCENE_LABELS.map((label, i) => {
          const active  = activeScene === i;
          const hovered = hoveredDot === i;
          return (
            <div
              key={label}
              onClick={() => navigateTo(i)}
              onMouseEnter={() => setHoveredDot(i)}
              onMouseLeave={() => setHoveredDot(-1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-jetbrains)', fontSize: 9,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: active ? '#00D4FF' : 'rgba(249,250,251,0.45)',
                opacity: hovered ? 1 : 0,
                transform: `translateX(${hovered ? 0 : 8}px)`,
                transition: 'opacity 0.18s, transform 0.18s',
                whiteSpace: 'nowrap', pointerEvents: 'none',
              }}>
                {label}
              </span>
              <div style={{
                width:  active ? 10 : hovered ? 8 : 6,
                height: active ? 10 : hovered ? 8 : 6,
                borderRadius: '50%', flexShrink: 0,
                background: active ? '#00D4FF' : hovered ? 'rgba(0,212,255,0.55)' : 'rgba(255,255,255,0.22)',
                boxShadow: active ? '0 0 10px rgba(0,212,255,0.7)' : 'none',
                transition: 'all 0.18s ease',
              }} />
            </div>
          );
        })}

        {/* counter */}
        <span style={{
          fontFamily: 'var(--font-jetbrains)', fontSize: 8,
          letterSpacing: '0.25em', color: 'rgba(0,212,255,0.4)',
          textTransform: 'uppercase', marginTop: 6, textAlign: 'right',
        }}>
          {String(activeScene + 1).padStart(2, '0')} / {String(SCENE_COUNT).padStart(2, '0')}
        </span>
      </div>

      {/* Scroll hint */}
      {activeScene === 0 && showHint && (
        <div style={{
          position: 'fixed', bottom: 48, left: '50%',
          transform: 'translateX(-50%)', zIndex: 200,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          animation: 'zhintfade 4s ease forwards',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains)', fontSize: 9,
            letterSpacing: '0.38em', textTransform: 'uppercase',
            color: 'rgba(0,212,255,0.5)',
          }}>Scroll to explore</span>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none"
            stroke="rgba(0,212,255,0.4)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: 'zbounce 1.6s ease infinite' }}>
            <line x1="7" y1="1" x2="7" y2="14" />
            <path d="M2 10l5 6 5-6" />
          </svg>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes zbounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
        @keyframes zhintfade{ 0%{opacity:1} 75%{opacity:1} 100%{opacity:0} }
        div[style*="overflowY: auto"]::-webkit-scrollbar { display: none; }
      ` }} />
    </div>
  );
}
