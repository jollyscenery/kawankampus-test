import { Children, isValidElement, useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export type AutoScrollStripProps = {
  items: readonly ReactNode[];
  speed?: number;
  holdSeconds?: number;
  direction?: 'left' | 'right' | 'up' | 'down';
  pauseOnHover?: boolean;
  playWithReducedMotion?: boolean;
  className?: string;
  id?: string;
  label: string;
};

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const SCROLL_IDLE_MS = 200;
const SLIDE_SECONDS = .5;
const EASE_POINTS = [0, .043, .156, .316, .5, .684, .844, .957, 1];

function getSlideTiming(count: number, hold: number) {
  const slideParts = EASE_POINTS.length - 1;
  const cycle = count * (hold + SLIDE_SECONDS);
  const stops = Array.from({ length: count }, (_, index) => {
    const start = index * (hold + SLIDE_SECONDS);
    const release = start + hold;
    return [
      `${index / count} ${start / cycle * 100}% ${release / cycle * 100}%`,
      ...EASE_POINTS.slice(1, -1).map((progress, step) =>
        `${(index + progress) / count} ${(release + (step + 1) / slideParts * SLIDE_SECONDS) / cycle * 100}%`),
    ];
  }).flat();
  return `linear(${stops.join(', ')}, 1 100%)`;
}

function getSlidePhase(position: number, count: number, hold: number, duration: number) {
  const progress = position * count;
  const closestSlide = Math.round(progress);
  if (Math.abs(progress - closestSlide) < .002) return (closestSlide % count) / count;

  // Convert a manual position back to its point along the same eased slide.
  const index = Math.floor(progress);
  const fraction = progress - index;
  const upper = EASE_POINTS.findIndex((point) => point >= fraction);
  const lower = upper - 1;
  const mix = (fraction - EASE_POINTS[lower]) / (EASE_POINTS[upper] - EASE_POINTS[lower]);
  const transition = (lower + mix) / (EASE_POINTS.length - 1);
  return (index * (hold + SLIDE_SECONDS) + hold + transition * SLIDE_SECONDS) / duration;
}

export default function AutoScrollStrip({
  items,
  speed = 36,
  holdSeconds = 0,
  direction = 'left',
  pauseOnHover = true,
  playWithReducedMotion = false,
  className,
  id,
  label,
}: AutoScrollStripProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const original = useRef<HTMLUListElement>(null);
  const resumeTimer = useRef<number | undefined>(undefined);
  const pointer = useRef<number | null>(null);
  const slides = Children.toArray(items);
  const vertical = direction === 'up' || direction === 'down';
  const reverse = direction === 'right' || direction === 'down';
  const scrollOffset = vertical ? 'scrollTop' : 'scrollLeft';
  const timed = Number.isFinite(holdSeconds) && holdSeconds > 0;
  const duration = timed ? slides.length * (holdSeconds + SLIDE_SECONDS)
    : Number.isFinite(speed) && speed > 0 ? speed : 36;

  useEffect(() => () => window.clearTimeout(resumeTimer.current), []);

  function motionDisabled() {
    return !playWithReducedMotion && window.matchMedia(REDUCED_MOTION).matches;
  }

  function beginManualScroll() {
    const lane = viewport.current;
    const strip = track.current;
    if (!lane || !strip || motionDisabled()) return false;
    if (strip.hasAttribute('data-manual')) return true;

    // Transfer the rendered position to the browser's scrollport before disabling the animation.
    const edge = vertical ? 'top' : 'left';
    const offset = lane.getBoundingClientRect()[edge] - strip.getBoundingClientRect()[edge];
    strip.setAttribute('data-manual', '');
    lane[scrollOffset] = offset;
    return true;
  }

  function synchronizeAnimation() {
    const lane = viewport.current;
    const strip = track.current;
    const group = original.current;
    if (!lane || !strip || !group) return;

    const size = group.getBoundingClientRect()[vertical ? 'height' : 'width'];
    const position = size ? ((lane[scrollOffset] % size + size) % size) / size : 0;
    const forwardPhase = timed ? getSlidePhase(position, slides.length, holdSeconds, duration) : position;
    const phase = reverse ? (1 - forwardPhase) % 1 : forwardPhase;
    strip.style.setProperty('--strip-delay', `${-phase * duration}s`);
    lane[scrollOffset] = 0;
  }

  function resumeFromCurrentPosition() {
    if (!track.current?.hasAttribute('data-manual')) return;
    if (!motionDisabled()) synchronizeAnimation();
    track.current.removeAttribute('data-manual');
  }

  function resumeAfterScroll() {
    window.clearTimeout(resumeTimer.current);
    if (pointer.current === null && track.current?.hasAttribute('data-manual')) {
      resumeTimer.current = window.setTimeout(resumeFromCurrentPosition, SCROLL_IDLE_MS);
    }
  }

  function endTouch(pointerId: number) {
    if (pointer.current !== pointerId) return;
    pointer.current = null;
    resumeAfterScroll();
  }

  if (!slides.length) return null;

  const content = slides.map((slide, index) => (
    <li key={isValidElement(slide) ? slide.key ?? index : index}>{slide}</li>
  ));
  const style = {
    '--strip-duration': `${duration}s`,
    '--strip-timing': timed ? getSlideTiming(slides.length, holdSeconds) : undefined,
  } as CSSProperties;
  return (
    <div className={`auto-scroll-strip${className ? ` ${className}` : ''}`}
      data-axis={vertical ? 'vertical' : 'horizontal'} data-reverse={reverse || undefined}
      data-pause-hover={pauseOnHover || undefined}
      data-motion-autoplay={playWithReducedMotion || undefined} style={style}>
      <div className="auto-scroll-viewport" id={id} role="region" aria-label={label} tabIndex={0}
        ref={viewport}
        onScroll={(event) => {
          if (!track.current?.hasAttribute('data-manual') && event.currentTarget[scrollOffset] === 0) return;
          if (beginManualScroll()) resumeAfterScroll();
        }}
        onWheel={(event) => {
          if (vertical ? event.deltaY !== 0 : event.deltaX !== 0 || event.shiftKey) {
            beginManualScroll();
            resumeAfterScroll();
          }
        }}
        onPointerDown={(event) => {
          if (event.pointerType === 'mouse' || !event.isPrimary) return;
          pointer.current = event.pointerId;
          window.clearTimeout(resumeTimer.current);
          beginManualScroll();
        }}
        onPointerUp={(event) => endTouch(event.pointerId)}
        onPointerCancel={(event) => endTouch(event.pointerId)}>
        <div className="auto-scroll-track" ref={track}>
          <ul className="auto-scroll-group" role="list" ref={original}>
            {content}
          </ul>
          <ul className="auto-scroll-group auto-scroll-clone" aria-hidden="true" tabIndex={-1} inert>
            {content}
          </ul>
        </div>
      </div>
    </div>
  );
}
