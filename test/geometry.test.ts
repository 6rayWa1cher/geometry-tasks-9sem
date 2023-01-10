import { sortPointsVertically } from '../src/services/geometry';

test('sortPointsVertically: some points', () => {
  const p1 = { x: 10, y: 10 };
  const p2 = { x: 20, y: 20 };
  expect(sortPointsVertically(p1, p2)).toStrictEqual([p1, p2]);
  expect(sortPointsVertically(p2, p1)).toStrictEqual([p1, p2]);
});

test('sortPointsVertically: aligned vertically points', () => {
  const p1 = { x: 10, y: 10 };
  const p2 = { x: 20, y: 10 };
  expect(sortPointsVertically(p1, p2)).toStrictEqual([p1, p2]);
  expect(sortPointsVertically(p2, p1)).toStrictEqual([p1, p2]);
});

test('sortPointsVertically: aligned horizontally points', () => {
  const p1 = { x: 10, y: 10 };
  const p2 = { x: 10, y: 20 };
  expect(sortPointsVertically(p1, p2)).toStrictEqual([p1, p2]);
  expect(sortPointsVertically(p2, p1)).toStrictEqual([p1, p2]);
});
