import { maxBy, random } from 'lodash';
import { Point, Polygon, roundPoint } from '../model/geometry';

const e = 1e-9;

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

const radians = (degrees: number) => (degrees * Math.PI) / 180;

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
