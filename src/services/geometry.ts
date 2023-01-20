import { maxBy, random, sortBy, sumBy } from 'lodash';
import { Point, Polygon, roundPoint } from '../model/geometry';

const e = 1e-9;

const radians = (degrees: number) => (degrees * Math.PI) / 180;

export class Vector {
  constructor(readonly x: number, readonly y: number) {}

  multiply(other: Vector) {
    return this.y * other.x - this.x * other.y;
  }

  multiplyLeft(other: Vector) {
    return this.x * other.y - this.y * other.x;
  }

  multiplyToNumber(num: number): Vector {
    return new Vector(this.x * num, this.y * num);
  }

  rotate(deg: number): Vector {
    const phi = radians(deg);
    return new Vector(
      this.x * Math.cos(phi) - this.y * Math.sin(phi),
      this.x * Math.sin(phi) + this.y * Math.cos(phi)
    );
  }

  appendToPoint(point: Point): Point {
    return { x: point.x + this.x, y: point.y + this.y };
  }

  normalize(): Vector {
    const len = this.length();
    return new Vector(this.x / len, this.y / len);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
}

export const vectorFromPoints = (origin: Point, p: Point) =>
  new Vector(p.x - origin.x, p.y - origin.y);

const intersection = (a: Point, b: Point, c: Point, d: Point): Point | null => {
  const k = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);

  const t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / k;
  const u = ((a.x - c.x) * (a.y - b.y) - (a.y - c.y) * (a.x - b.x)) / k;

  if (!(0 <= t && t <= 1 && 0 <= u && u <= 1) || k == 0) {
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

interface PolarPoint {
  phi: number;
  r: number;
}

const polarToCartesian = ({ phi, r }: PolarPoint): Point => ({
  x: r * Math.cos(radians(phi)),
  y: r * Math.sin(radians(phi)),
});

interface GeneratePolygonArgs {
  radBounds: [number, number];
  gradBounds: [number, number];
  center: Point;
}

export const generatePolygon = ({
  radBounds: [r1, r2],
  gradBounds: [q1, q2],
  center,
}: GeneratePolygonArgs): Polygon => {
  const polarPoints: PolarPoint[] = [{ phi: 0, r: random(r1, r2) }];
  let lastPolar = polarPoints[0];
  while (lastPolar.phi < 360) {
    const nextPolar = {
      phi: lastPolar.phi + random(q1, q2),
      r: random(r1, r2),
    };
    polarPoints.push(nextPolar);
    lastPolar = nextPolar;
  }
  return {
    points: polarPoints
      .map(polarToCartesian)
      .map(roundPoint)
      .map(({ x, y }) => ({ x: x + center.x, y: y + center.y }))
      .slice(0, polarPoints.length - 1),
  };
};

export const isPointNotBelowLine = (
  p1: Point,
  p2: Point,
  p: Point
): boolean => {
  const v1 = vectorFromPoints(p1, p2);
  const v2 = vectorFromPoints(p1, p);
  return v1.multiply(v2) >= 0;
};

export const isPointNotAboveLine = (
  p1: Point,
  p2: Point,
  p: Point
): boolean => {
  const v1 = vectorFromPoints(p1, p2);
  const v2 = vectorFromPoints(p1, p);
  console.log(v1.multiply(v2));
  return v1.multiply(v2) <= 0;
};

const getCenter = (points: Point[]): Point => {
  const xSum = sumBy(points, (p) => p.x);
  const ySum = sumBy(points, (p) => p.y);
  const len = points.length;
  return { x: xSum / len, y: ySum / len };
};

// true polar angle from 0 to 360
export const polarAngleDeg = (v1: Vector, v2: Vector): number => {
  const dot = v1.x * v2.x + v1.y * v2.y;
  const det = v1.multiply(v2);
  const atan = Math.atan2(det, dot);
  return atan >= 0 ? atan : 2 * Math.PI + atan;
};

// pos - above, neg - below, from -pi to pi
const atan2AngleRad = (v1: Vector, v2: Vector): number => {
  const dot = v1.x * v2.x + v1.y * v2.y;
  const det = v1.multiplyLeft(v2);
  return Math.atan2(det, dot);
};

// only pos angle values from 0 to 180
const cosAngleDeg = (p1: Point, p2: Point, p3: Point): number => {
  const v1 = vectorFromPoints(p1, p2);
  const v2 = vectorFromPoints(p2, p3);
  return Math.acos((v1.x * v2.x + v1.y * v2.y) / (v1.length() * v2.length()));
};

export const generateConvexPolygon = ({
  radBounds: [r1, r2],
  gradBounds: [q1, q2],
  center,
}: GeneratePolygonArgs): Polygon => {
  // while (true) {
  const phi1 = random(q1, q2);
  const points: Point[] = [
    { x: 0, y: 0 },
    polarToCartesian({
      phi: phi1,
      r: random(r1, r2),
    }),
  ];
  const [p1, p2] = points;
  let phi = phi1;
  let prevPoint = points[0],
    lastPoint = points[1];
  while (
    phi < 360 &&
    isPointNotAboveLine(p1, p2, lastPoint) &&
    (points.length <= 3 || isPointNotBelowLine(prevPoint, p1, lastPoint))
  ) {
    const rotation = random(q1, q2);
    phi = phi + rotation;
    const rad = random(r1, r2);
    const prevVector = vectorFromPoints(prevPoint, lastPoint);
    const newVector = prevVector
      .rotate(rotation)
      .normalize()
      .multiplyToNumber(rad);
    const newPoint = newVector.appendToPoint(lastPoint);
    prevPoint = lastPoint;
    lastPoint = newPoint;
    points.push(newPoint);
  }
  points.pop();
  const polyCenter = getCenter(points);
  const out = points
    .map(({ x, y }) => ({
      x: x - polyCenter.x + center.x,
      y: y - polyCenter.y + center.y,
    }))
    .map(roundPoint);
  return {
    points: out,
  };
};

const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

export const isConvexPolygon = ({ points }: Polygon): boolean => {
  const len = points.length;
  if (len < 4) return true;
  const signs = new Set();
  for (let i = 0; i < len; i++) {
    const p1 = points[mod(i - 1, len)];
    const p2 = points[i];
    const p3 = points[mod(i + 1, len)];
    const v1 = vectorFromPoints(p1, p2);
    const v2 = vectorFromPoints(p2, p3);
    const sign = v1.multiply(v2);
    if (!approxEquals(sign, 0)) signs.add(sign > 0);
  }
  return signs.size != 2;
};

export enum ConvexAlgorithm {
  Triangle = 'triangle',
  Jarvis = 'jarvis',
  Graham = 'graham',
}

const getConvexSimple = (points: Point[]): Polygon => {
  const convexPoints = new Set<Point>(points);
  p: for (const pt of points) {
    for (const p1 of points) {
      for (const p2 of points) {
        for (const p3 of points) {
          if (
            pointsApproxEquals(pt, p1) ||
            pointsApproxEquals(pt, p2) ||
            pointsApproxEquals(pt, p3) ||
            pointsApproxEquals(p1, p2) ||
            pointsApproxEquals(p2, p3) ||
            pointsApproxEquals(p1, p3)
          )
            continue;
          if (isPointInPolygon({ points: [p1, p2, p3] }, pt)) {
            convexPoints.delete(pt);
            continue p;
          }
        }
      }
    }
  }
  const convexPointsArr = [...convexPoints];
  const center = getCenter(convexPointsArr);
  const v = new Vector(1, 0);
  const outPoints = sortBy(convexPointsArr, (p) =>
    atan2AngleRad(v, vectorFromPoints(center, p))
  );
  return { points: outPoints };
};

const getConvexJarvis = (points: Point[]): Polygon => {
  let first = points[0];
  for (const p of points) {
    if (p.y < first.y) {
      first = p;
    } else if (approxEquals(p.y, first.y) && p.x < first.x) {
      first = p;
    }
  }
  const convex: Point[] = [first];
  let cur = first;
  let prev = { x: first.x - e, y: first.y };
  do {
    let minCosAngle = 1e9;
    let maxLen = 1e9;
    let next = -1;
    for (let i = 0; i < points.length; i++) {
      const curCosAngle = cosAngleDeg(prev, cur, points[i]);
      const curLen = vectorFromPoints(cur, points[i]).length();
      if (curCosAngle <= minCosAngle) {
        next = i;
        minCosAngle = curCosAngle;
        maxLen = curLen;
      } else if (approxEquals(curCosAngle, minCosAngle) && curLen >= maxLen) {
        next = i;
        maxLen = curLen;
      }
    }
    prev = cur;
    cur = points[next];
    convex.push(cur);
    if (convex.length > 500)
      throw new Error(convex.map(({ x, y }) => `(${x};${y})`).join(','));
  } while (!pointsApproxEquals(cur, first));
  convex.pop();
  return { points: convex };
};

const getLast = <T>(a: T[], i = 1): T => a[a.length - i];

export const getConvexGraham = (points: Point[]): Polygon => {
  let p0 = points[0];
  for (const p of points) {
    if (p.y < p0.y || (approxEquals(p.y, p0.y) && p.x > p0.x)) {
      p0 = p;
    }
  }
  const fp = { x: p0.x + 1, y: p0.y };
  const pts = sortBy(points, (p) => cosAngleDeg(p0, fp, p));

  const convex: Point[] = [];
  for (const p of pts) {
    while (convex.length >= 2) {
      const pn = getLast(convex, 1);
      const pn1 = getLast(convex, 2);
      const a = atan2AngleRad(
        vectorFromPoints(pn1, pn),
        vectorFromPoints(pn, p)
      );
      if (a < 0) {
        convex.pop();
      } else {
        break;
      }
    }
    convex.push(p);
  }
  return { points: convex };
};

export const getConvex = (
  points: Point[],
  algorithm: ConvexAlgorithm = ConvexAlgorithm.Triangle
): Polygon => {
  if (points.length < 4) return { points };
  switch (algorithm) {
    case ConvexAlgorithm.Jarvis:
      return getConvexJarvis(points);
    case ConvexAlgorithm.Triangle:
      return getConvexSimple(points);
    case ConvexAlgorithm.Graham:
      return getConvexGraham(points);
  }
};
