import { maxBy } from 'lodash';
import { Point, Polygon } from '../model/geometry';

const e = 1e-9;

// const intersect_1 = (
//   _a: number,
//   _b: number,
//   _c: number,
//   _d: number
// ): boolean => {
//   let a = _a;
//   let b = _b;
//   let c = _c;
//   let d = _d;
//   if (a > b) {
//     [a, b] = [b, a];
//   }
//   if (c > d) {
//     [c, d] = [d, c];
//   }
//   return Math.max(a, c) <= Math.min(b, d);
// };

const det = (a: number, b: number, c: number, d: number) => a * d - b * c;

const between = (a: number, b: number, c: number) =>
  Math.min(a, b) <= c + e && c <= Math.max(a, b) + e;

const intersection = (a: Point, b: Point, c: Point, d: Point): Point | null => {
  // const a1 = a.y - b.y;
  // const b1 = b.x - a.x;
  // const c1 = -a1 * a.x - b1 * a.y;
  // const a2 = c.y - d.y;
  // const b2 = d.x - c.x;
  // const c2 = -a2 * c.x - b2 * c.y;
  // const zn = det(a1, b1, a2, b2);
  // if (!approxEquals(zn, 0)) {
  //   const x = (-det(c1, b1, c2, b2) * 1) / zn;
  //   const y = (-det(a1, c1, a2, c2) * 1) / zn;
  //   return (
  //     between(a.x, b.x, x) &&
  //     between(a.y, b.y, y) &&
  //     between(c.x, d.x, x) &&
  //     between(c.y, d.y, y)
  //   );
  // } else {
  //   return (
  //     approxEquals(det(a1, c1, a2, c2), 0) &&
  //     approxEquals(det(b1, c1, b2, c2), 0) &&
  //     intersect_1(a.x, b.x, c.x, d.x) &&
  //     intersect_1(a.y, b.y, c.y, d.y)
  //   );
  // }
  const k = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);

  const t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / k;
  const u = ((a.x - c.x) * (a.y - b.y) - (a.y - c.y) * (a.x - b.x)) / k;

  if (!(0 <= t && t <= 1 && 0 <= u && u <= 1) || k == 0) {
    console.log(false);
    return null;
  }

  return {
    x: a.x + t * (b.x - a.x),
    y: a.y + t * (b.y - a.y),
  };
};

const approxEquals = (a: number, b: number) => Math.abs(a - b) <= e;

export const sortPointsVertically = (p1: Point, p2: Point): [Point, Point] => {
  if (p1.y > p2.y || (approxEquals(p1.y, p2.y) && p1.x >= p2.x)) {
    return [p2, p1];
  } else {
    return [p1, p2];
  }
};

const pointsApproxEquals = (p1: Point, p2: Point) =>
  approxEquals(p1.x, p2.x) && approxEquals(p1.y, p2.y);

export const isPointInPolygon = (poly: Polygon, p: Point): boolean => {
  let intersections = 0;
  const points = poly.points;
  if (points.length == 0) return false;
  const farPoint = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    x: maxBy(points, (p) => p.x)!.x + 100,
    y: p.y,
  };
  for (let i = 0; i < points.length; i++) {
    const [a, b] = sortPointsVertically(
      points[i],
      points[(i + 1) % points.length]
    );
    const intersectPoint = intersection(a, b, p, farPoint);
    if (intersectPoint != null && !pointsApproxEquals(b, intersectPoint)) {
      intersections += 1;
    }
  }
  return intersections % 2 == 1;
};
