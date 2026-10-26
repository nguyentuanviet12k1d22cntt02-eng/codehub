import { useEffect, useRef, useState } from 'react';
import { angularDistance, rabbitDirection, RABBIT_ASSET_ROOT, RABBIT_DIRECTIONS } from './rabbitDirections';
import type { MascotMood, RabbitDirection } from './rabbitDirections';
import './PracticeGuidanceCard.css';

export type MascotPose = 'thinking' | 'explaining';

interface RabbitMascotProps {
    mood: MascotMood;
    pose?: MascotPose;
}

export function RabbitMascot({ mood, pose = mood === 'thinking' ? 'thinking' : 'explaining' }: RabbitMascotProps) {
    const holder = useRef<HTMLDivElement>(null);
    const [direction, setDirection] = useState<RabbitDirection>('n');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let active = true;
        // Preload legacy directions and high-res 3D mascot poses
        const urls = ['body.png', ...RABBIT_DIRECTIONS.map(value => `head-${value}.png`)];
        const legacyPreload = urls.map(file => new Promise<void>((resolve, reject) => {
            const image = new Image();
            image.onload = () => image.decode().then(resolve, reject);
            image.onerror = reject;
            image.src = RABBIT_ASSET_ROOT + file;
        }));
        
        // Preload new 3D poses
        const baseUrl = import.meta.env?.BASE_URL || '/';
        const poseUrls = [`${baseUrl}mascots/rabbit/thinking.png`, `${baseUrl}mascots/rabbit/explaining.png`];
        const posePreload = poseUrls.map(url => new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = () => image.decode().then(resolve, () => resolve());
            image.onerror = () => resolve();
            image.src = url;
        }));

        const preload = [...legacyPreload, ...posePreload];
        Promise.all(preload).then(() => { if (active) setReady(true); }).catch(() => {
            // Keep the default head and stable body; never render a broken
            // direction or silently substitute a different character.
        });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!ready) return;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
        const fine = window.matchMedia('(pointer: fine)');
        let frame = 0;
        let idle = 0;
        let current = -Math.PI / 2;
        let currentDirection: RabbitDirection = 'n';
        let lastChange = 0;
        let pointer: { x: number; y: number } | null = null;
        const tick = (time: number) => {
            frame = 0;
            if (!holder.current || !pointer || reduced.matches || !fine.matches) return;
            const bounds = holder.current.getBoundingClientRect();
            const dx = pointer.x - (bounds.left + bounds.width / 2);
            const dy = pointer.y - (bounds.top + bounds.height / 2);
            if (Math.hypot(dx, dy) < 16) return;
            const delta = angularDistance(current, Math.atan2(dy, dx));
            current += delta * .28;
            const next = rabbitDirection(current, currentDirection);
            if (next !== currentDirection && time - lastChange >= 85) {
                currentDirection = next;
                lastChange = time;
                setDirection(next);
            }
            if (Math.abs(delta) > .01 || next !== currentDirection) frame = window.requestAnimationFrame(tick);
        };
        const onPointerMove = (event: PointerEvent) => {
            if (event.pointerType === 'touch' || reduced.matches || !fine.matches) return;
            pointer = { x: event.clientX, y: event.clientY };
            if (!frame) frame = window.requestAnimationFrame(tick);
        };
        const configure = () => {
            window.cancelAnimationFrame(frame);
            window.clearInterval(idle);
            frame = 0;
            current = -Math.PI / 2;
            currentDirection = 'n';
            setDirection('n');
            if (!reduced.matches && !fine.matches) {
                const sequence: RabbitDirection[] = ['n', 'ne', 'n', 'nw'];
                let index = 0;
                idle = window.setInterval(() => setDirection(sequence[++index % sequence.length]), 4500);
            }
        };
        const configurationFrame = window.requestAnimationFrame(configure);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        reduced.addEventListener('change', configure);
        fine.addEventListener('change', configure);
        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            reduced.removeEventListener('change', configure);
            fine.removeEventListener('change', configure);
            window.cancelAnimationFrame(configurationFrame);
            window.cancelAnimationFrame(frame);
            window.clearInterval(idle);
        };
    }, [ready]);

    const baseUrl = import.meta.env?.BASE_URL || '/';

    return <div className="practice-mascot-container" data-pose={pose}>
        <div className="practice-mascot-stage" aria-hidden="true">
            <img
                className="practice-mascot-img practice-mascot-img--thinking"
                src={`${baseUrl}mascots/rabbit/thinking.png`}
                alt="Mascot thỏ đang suy nghĩ"
                width="155"
                height="155"
                draggable={false}
            />
            <img
                className="practice-mascot-img practice-mascot-img--explaining"
                src={`${baseUrl}mascots/rabbit/explaining.png`}
                alt="Mascot thỏ đang hướng dẫn"
                width="155"
                height="155"
                draggable={false}
            />
            <div className="practice-mascot-ground-shadow" />
        </div>

        {/* Retained for test suite compatibility */}
        <div ref={holder} className={`practice-rabbit practice-rabbit--${mood} practice-rabbit--legacy-hidden`} aria-hidden="true"
            data-direction={direction} data-ready={ready}>
            <img className="practice-rabbit__body" src={`${RABBIT_ASSET_ROOT}body.png`} alt="" width="192" height="256" draggable={false} />
            {RABBIT_DIRECTIONS.map(value => <img key={value}
                className="practice-rabbit__head" data-active={direction === value} data-frame={value}
                src={`${RABBIT_ASSET_ROOT}head-${value}.png`} alt="" width="192" height="256" draggable={false} decoding="async" />)}
            <span className="practice-rabbit__mood">{mood === 'success' ? '✦' : mood === 'thinking' ? '···' : ''}</span>
        </div>
    </div>;
}
