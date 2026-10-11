import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

export interface CrowdCanvasProps {
  src?: string;
  rows?: number;
  cols?: number;
  onContactReached?: () => void;
  isTransitioning?: boolean;
}

interface Peep {
  image: HTMLImageElement;
  rect: number[];
  width: number;
  height: number;
  drawArgs: (HTMLImageElement | number)[];
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
  isFocal?: boolean;
  alpha?: number;
  setRect: (rect: number[]) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
}

export function CrowdCanvas({
  src = '/crowd-sprites.png',
  rows = 15,
  cols = 7,
  onContactReached,
  isTransitioning = false,
}: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasContacted, setHasContacted] = useState(false);
  const [contactPoint, setContactPoint] = useState<{ x: number; y: number } | null>(null);
  const focalPeepRef = useRef<Peep | null>(null);

  const handleContact = useCallback(() => {
    if (hasContacted) return;
    setHasContacted(true);
    if (onContactReached) {
      onContactReached();
    }
  }, [hasContacted, onContactReached]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = { src, rows, cols };

    // UTILS from original reference
    const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 80 - 240 * gsap.parseEase('power2.in')(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return { startX, startY, endX };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.6, 1.4));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: 'none',
        },
        0
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0
      );

      return tl;
    };

    const walks = [normalWalk];

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        alpha: 1,
        setRect: (newRect: number[]) => {
          peep.rect = newRect;
          peep.width = newRect[2];
          peep.height = newRect[3];
          peep.drawArgs = [peep.image, ...newRect, 0, 0, peep.width, peep.height];
        },
        render: (renderCtx: CanvasRenderingContext2D) => {
          renderCtx.save();
          renderCtx.translate(peep.x, peep.y);
          renderCtx.scale(peep.scaleX, 1);
          if (peep.alpha !== undefined && peep.alpha < 1) {
            renderCtx.globalAlpha = peep.alpha;
          }
          renderCtx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height
          );
          renderCtx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement('img');
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows: r, cols: c } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = r * c;
      const rectWidth = width / r;
      const rectHeight = height / c;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % r) * rectWidth,
              ((i / r) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          })
        );
      }
    };

    const addPeepToCrowd = () => {
      if (availablePeeps.length === 0) return null;
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback('onComplete', () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        const added = addPeepToCrowd();
        if (added?.walk) {
          added.walk.progress(Math.random());
        }
      }
    };

    // Focal discovery sequence (Scene 2)
    const setupFocalCharacter = () => {
      if (allPeeps.length === 0) return;

      // Select an expressive character from the pool
      const focalIndex = 14; // A recognizable character with forward poise
      const focal = allPeeps[focalIndex] || allPeeps[0];
      focalPeepRef.current = focal;
      focal.isFocal = true;

      // Position target at center top of crowd (where the HireMate emblem sits)
      const targetX = stage.width * 0.5 - focal.width * 0.45;
      const targetY = stage.height * 0.42;

      // Start focal character from left-center foreground
      const startX = stage.width * 0.15;
      const startY = stage.height - focal.height + 30;

      focal.x = startX;
      focal.y = startY;
      focal.anchorY = startY + 100; // Keep in front of crowd
      focal.scaleX = 1;

      // Ensure focal is in crowd array for rendering
      if (!crowd.includes(focal)) {
        crowd.push(focal);
      }
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      // Build dedicated GSAP cinematic approach sequence
      const focalTl = gsap.timeline({ delay: 1.2 });

      // Step 1: Walk toward center while moving slightly upward toward the beacon
      focalTl.to(focal, {
        x: targetX,
        y: targetY,
        duration: 3.2,
        ease: 'power1.out',
        onUpdate: () => {
          // Bobbing motion as they walk
          focal.y += Math.sin(focal.x * 0.05) * 1.5;
        },
      });

      // Step 2: The intentional touch moment
      focalTl.to(focal, {
        x: targetX + 10,
        y: targetY - 12,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          setContactPoint({
            x: targetX + focal.width * 0.8,
            y: targetY + focal.height * 0.25,
          });
          handleContact();
        },
      });

      // Step 3: Settle at the logo
      focalTl.to(focal, {
        y: targetY,
        duration: 0.4,
        ease: 'power1.inOut',
      });
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);

      // Render all walking crowd characters
      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio;
      canvas.height = stage.height * devicePixelRatio;

      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
      setupFocalCharacter();
    };

    const init = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.src = config.src;

    // Fallback if image fails to load
    img.onerror = () => {
      console.warn('Failed to load local sprite sheet, attempting CDN fallback...');
      img.src = 'https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png';
    };

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols, handleContact]);

  // Handle transition out when contacted
  useEffect(() => {
    if (isTransitioning) {
      // Crowd recedes gracefully
    }
  }, [isTransitioning]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* Background radial gradient to give depth to the hand-drawn crowd */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/90 to-charcoal-950/60 pointer-events-none z-10" />

      {/* Canvas rendering the layered black-and-white crowd */}
      <canvas
        ref={canvasRef}
        className={`absolute bottom-0 h-full w-full transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-30' : 'opacity-100'
        }`}
      />

      {/* Contact visual reaction: restrained cyan/teal pulse & expanding ring */}
      {contactPoint && hasContacted && (
        <div
          className="absolute z-30 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${contactPoint.x}px`, top: `${contactPoint.y}px` }}
        >
          {/* Central contact flash */}
          <div className="w-4 h-4 rounded-full bg-hm-accent animate-ping opacity-75" />
          {/* Expanding glowing ring */}
          <div className="absolute -inset-8 rounded-full border border-hm-accent/60 animate-ping opacity-60" />
          <div className="absolute -inset-16 rounded-full border border-hm-accent/30 animate-pulse opacity-40" />
        </div>
      )}
    </div>
  );
}

export default CrowdCanvas;
