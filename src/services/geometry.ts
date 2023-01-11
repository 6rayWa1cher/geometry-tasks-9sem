import { isEqual, maxBy, random, sumBy } from 'lodash';
import { Point, Polygon, roundPoint } from '../model/geometry';

const e = 1e-9;

const radians = (degrees: number) => (degrees * Math.PI) / 180;

export class Vector {
  constructor(readonly x: number, readonly y: number) {}

  multiply(other: Vector) {
    return this.y * other.x - this.x * other.y;
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

type PolarPoint = { phi: number; r: number };

const polarToCartesian = ({ phi, r }: PolarPoint): Point => ({
  x: r * Math.cos(radians(phi)),
  y: r * Math.sin(radians(phi)),
});

type GeneratePolygonArgs = {
  radBounds: [number, number];
  gradBounds: [number, number];
  center: Point;
};

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
  // if (p1.x > p2.x) {
  //   [p1, p2] = [p2, p1];
  // }
  const v1 = vectorFromPoints(p1, p2);
  const v2 = vectorFromPoints(p1, p);
  return v1.multiply(v2) >= 0;
};

export const isPointNotAboveLine = (
  p1: Point,
  p2: Point,
  p: Point
): boolean => {
  // if (p1.x > p2.x) {
  //   [p1, p2] = [p2, p1];
  // }
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

export const degBetweenVectors = (v1: Vector, v2: Vector): number => {
  const dot = v1.x * v2.x + v1.y * v2.y;
  const det = v1.multiply(v2);
  const atan = Math.atan2(det, dot);
  return atan >= 0 ? atan : 2 * Math.PI + atan;
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
