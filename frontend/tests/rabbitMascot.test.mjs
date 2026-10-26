import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { rabbitDirection, angularDistance, RABBIT_DIRECTIONS } from '../src/features/adaptive-learning/components/rabbitDirections.ts';

test('the eight pointer vectors select eight distinct directions, including 10:30', () => {
    const vectors = { n: [0, -1], ne: [1, -1], e: [1, 0], se: [1, 1], s: [0, 1], sw: [-1, 1], w: [-1, 0], nw: [-1, -1] };
    for (const [direction, [x, y]] of Object.entries(vectors)) assert.equal(rabbitDirection(Math.atan2(y, x)), direction);
    assert.equal(new Set(Object.values(vectors).map(([x, y]) => rabbitDirection(Math.atan2(y, x)))).size, 8);
});

test('sector hysteresis rejects pointer jitter but accepts an intentional change', () => {
    assert.equal(rabbitDirection(24 * Math.PI / 180, 'e'), 'e');
    assert.equal(rabbitDirection(32 * Math.PI / 180, 'e'), 'se');
    assert.equal(rabbitDirection(-Math.PI + .01, 'w'), 'w');
    assert.ok(Math.abs(angularDistance(Math.PI - .01, -Math.PI + .01) - .02) < .001);
    assert.equal(rabbitDirection(Number.NaN, 'nw'), 'nw');
});

test('all eight PNGs are aligned RGBA assets; browser layers fit the same fixed canvas', () => {
    const master = new URL('../../assets/img/rabbit-mascot/frames/', import.meta.url);
    const publicFolder = new URL('../public/mascots/rabbit/v1/', import.meta.url);
    assert.equal(readdirSync(master).filter(name => name.endsWith('.png')).length, 8);
    const hashes = [];
    const check = (url, width, height) => {
        const data = readFileSync(url);
        assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
        assert.equal(data.readUInt32BE(16), width); assert.equal(data.readUInt32BE(20), height);
        assert.equal(data[25], 6, 'RGBA PNG, not a checkerboard RGB image');
        return data;
    };
    for (const direction of RABBIT_DIRECTIONS) {
        hashes.push(createHash('sha256').update(check(new URL(direction + '.png', master), 576, 768)).digest('hex'));
        check(new URL('head-' + direction + '.png', publicFolder), 192, 256);
    }
    assert.equal(new Set(hashes).size, 8, 'Eight real distinct frames, not copies');
    check(new URL('body.png', publicFolder), 192, 256);
});

test('the guide uses rabbit; transitions never rotate, translate or scale its body', () => {
    const folder = new URL('../src/features/adaptive-learning/components/', import.meta.url);
    const component = readFileSync(new URL('RabbitMascot.tsx', folder), 'utf8');
    const css = readFileSync(new URL('PracticeGuidanceCard.css', folder), 'utf8');
    assert.ok(readFileSync(new URL('PracticeGuidanceCard.tsx', folder), 'utf8').includes('<RabbitMascot mood={mood} />'));
    assert.ok(component.includes('Promise.all(preload)'));
    assert.equal((component.match(/className="practice-rabbit__body"/g) || []).length, 1);
    assert.ok(component.includes('RABBIT_DIRECTIONS.map'));
    assert.ok(component.includes('removeEventListener'));
    assert.ok(!/(?:^|[;{]\s*)transform\s*:|@keyframes practice-(?:fox|rabbit)/m.test(css));
    assert.match(css, /prefers-reduced-motion/);
    assert.match(css, /transition: opacity/);
});
