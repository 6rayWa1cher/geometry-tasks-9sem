import {
  ConvexAlgorithm,
  polarAngleDeg,
  getConvex,
  isConvexPolygon,
  isPointNotAboveLine,
  isPointNotBelowLine,
  sortPointsVertically,
  Vector,
  vectorFromPoints,
} from '../src/services/geometry';

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

test('isPointNotBelowLine: positive, same direction', () => {
  const p1 = { x: 10, y: 10 };
  const p2 = { x: 20, y: 10 };
  const p = { x: 15, y: 5 };
  expect(isPointNotBelowLine(p1, p2, p)).toBe(true);
});

test('isPointNotBelowLine: positive, opposite direction', () => {
  const p1 = { x: 10, y: 10 };
  const p2 = { x: 20, y: 10 };
  const p = { x: 5, y: 5 };
  expect(isPointNotBelowLine(p1, p2, p)).toBe(true);
});

test('isPointNotBelowLine: negative, same direction', () => {
  const p1 = { x: 10, y: 10 };
  const p2 = { x: 20, y: 10 };
  const p = { x: 15, y: 15 };
  expect(isPointNotBelowLine(p1, p2, p)).toBe(false);
});

test('isPointNotBelowLine: negative, opposite direction', () => {
  const p1 = { x: 10, y: 10 };
  const p2 = { x: 20, y: 10 };
  const p = { x: 5, y: 15 };
  expect(isPointNotBelowLine(p1, p2, p)).toBe(false);
});

test('isPointNotAboveLine: negative, same direction', () => {
  const p1 = { x: 10, y: 10 };
  const p2 = { x: 20, y: 10 };
  const p = { x: 15, y: 5 };
  expect(isPointNotAboveLine(p1, p2, p)).toBe(false);
});

test('isPointNotAboveLine: negative, opposite direction', () => {
  const p1 = { x: 10, y: 10 };
  const p2 = { x: 20, y: 10 };
  const p = { x: 5, y: 5 };
  expect(isPointNotAboveLine(p1, p2, p)).toBe(false);
});

test('isPointNotAboveLine: positive, same direction', () => {
  const p1 = { x: 10, y: 10 };
  const p2 = { x: 20, y: 10 };
  const p = { x: 15, y: 15 };
  expect(isPointNotAboveLine(p1, p2, p)).toBe(true);
});

test('isPointNotAboveLine: positive, opposite direction', () => {
  const p1 = { x: 10, y: 10 };
  const p2 = { x: 20, y: 10 };
  const p = { x: 5, y: 15 };
  expect(isPointNotAboveLine(p1, p2, p)).toBe(true);
});

test('degBetweenVectors: case when counterclockwise', () => {
  const p1 = { x: 0, y: 0 };
  const p2 = { x: 1, y: 0 };
  const p3 = { x: 1, y: -1 };
  const v1 = vectorFromPoints(p1, p2);
  const v2 = vectorFromPoints(p1, p3);
  expect(polarAngleDeg(v1, v2)).toBeCloseTo(Math.PI / 4);
});

test('degBetweenVectors: case when clockwise', () => {
  const p1 = { x: 0, y: 0 };
  const p2 = { x: 1, y: 0 };
  const p3 = { x: 1, y: 1 };
  const v1 = vectorFromPoints(p1, p2);
  const v2 = vectorFromPoints(p1, p3);
  expect(polarAngleDeg(v1, v2)).toBeCloseTo((7 * Math.PI) / 4);
});

test('isConvexPolygon: positive', () => {
  const p1 = { x: 0, y: 0 };
  const p2 = { x: 10, y: 0 };
  const p3 = { x: 10, y: 10 };
  const p4 = { x: 0, y: 10 };
  expect(isConvexPolygon({ points: [p1, p2, p3, p4] })).toBe(true);
  expect(isConvexPolygon({ points: [p4, p3, p2, p1] })).toBe(true);
});

test('isConvexPolygon: negative', () => {
  const p1 = { x: 0, y: 0 };
  const p2 = { x: 10, y: 0 };
  const p3 = { x: 10, y: 10 };
  const p4 = { x: 5, y: 5 };
  const p5 = { x: 0, y: 10 };
  expect(isConvexPolygon({ points: [p1, p2, p3, p4, p5] })).toBe(false);
  expect(isConvexPolygon({ points: [p5, p4, p3, p2, p1] })).toBe(false);
});

describe('getConvex', () => {
  describe('square with dot', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 10, y: 1 };
    const p3 = { x: 11, y: 9 };
    const p4 = { x: 5, y: 5 };
    const p5 = { x: 1, y: 10 };
    const input = [p1, p2, p3, p4, p5];

    test('Triangle', () => {
      const expected = [p1, p2, p3, p5];
      expect(getConvex(input, ConvexAlgorithm.Triangle).points).toMatchObject(
        expected
      );
    });

    test('Jarvis', () => {
      const expected = [p1, p2, p3, p5];
      expect(getConvex(input, ConvexAlgorithm.Jarvis).points).toMatchObject(
        expected
      );
    });

    test('Graham', () => {
      const expected = [p2, p3, p5, p1];
      expect(getConvex(input, ConvexAlgorithm.Graham).points).toMatchObject(
        expected
      );
    });
  });
});
