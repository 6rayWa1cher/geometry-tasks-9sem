/* export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export abstract class GeometryObject {
  abstract getPoints(): Point[];
}

export class Polygon extends GeometryObject {
  points: Point[];

  constructor(points: Point[]) {
    super();
    this.points = points;
  }

  getPoints(): Point[] {
    return this.points;
  }
} */

export interface Point {
  x: number;
  y: number;
}

export interface Polygon {
  points: Point[];
}

export type GeometryObject = Point | Polygon;

const isPoint = (o: GeometryObject): o is Point => 'x' in o && 'y' in o;

export const getPoints = (obj: GeometryObject): Point[] => {
  if (isPoint(obj)) return [obj];
  return obj.points;
};

export const setPoint = <T extends GeometryObject>(
  i: number,
  obj: T,
  newData: Point
): GeometryObject => {
  if (isPoint(obj)) {
    return newData;
  }
  const points = obj.points;
  const newPoints = [...points.slice(0, i), newData, ...points.slice(i + 1)];
  return { points: newPoints };
};

export const roundPoint = ({ x, y }: Point): Point => ({
  x: Math.round(x),
  y: Math.round(y),
});
