// import { LegacyRef, MutableRefObject, RefObject, useLayoutEffect, useRef, useState } from 'react';
// import { Layer, Stage } from 'react-konva';

// export const Canvas = () => {
//   const ref = useRef<HTMLDivElement>(null);

//   const [width, setWidth] = useState(0);
//   const [height, setHeight] = useState(0);

//   useLayoutEffect(() => {
//     setWidth(ref.current?.offsetWidth ?? 0);
//     setHeight(ref.current?.offsetHeight ?? 0);
//   }, []);

//   return <div ref={ref}>
//     <Stage>
//       <Layer>

//       </Layer>
//     </Stage>
//   </div>
// }
