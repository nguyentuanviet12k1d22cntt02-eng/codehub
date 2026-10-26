export const RABBIT_DIRECTIONS = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne'] as const;
export type RabbitDirection = typeof RABBIT_DIRECTIONS[number];
export type MascotMood = 'idle' | 'thinking' | 'success';

const SECTOR = Math.PI / 4;
const HYSTERESIS = Math.PI / 30;

export function angularDistance(from: number, to: number) {
    return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

export function rabbitDirection(angle: number, previous?: RabbitDirection): RabbitDirection {
    if (!Number.isFinite(angle)) return previous || 'n';
    const sector = Math.round(angle / SECTOR);
    const next = RABBIT_DIRECTIONS[((sector % 8) + 8) % 8];
    if (previous && previous !== next) {
        const center = RABBIT_DIRECTIONS.indexOf(previous) * SECTOR;
        if (Math.abs(angularDistance(center, angle)) < SECTOR / 2 + HYSTERESIS) return previous;
    }
    return next;
}

export const RABBIT_ASSET_ROOT = `${import.meta.env?.BASE_URL || '/'}mascots/rabbit/v1/`;
