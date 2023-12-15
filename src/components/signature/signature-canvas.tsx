import { PointerEvent } from 'react';
import { Box } from '@mui/material';
import { useSettingsContext } from '../settings';
import { getStroke } from 'perfect-freehand';
// types
import { getSvgPathFromStroke } from './utils/get-svg-from-stroke';
import { SignatureCanvasProps } from './types';

// ----------------------------------------------------------------------

// Signature line options
const options = {
  size: 6,
  thinning: 0.5,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (t: number) => t,
  end: {
    taper: 10,
    easing: (t: number) => t,
    cap: true,
  },
};

// ----------------------------------------------------------------------

const SignatureCanvas = ({ svgRef, strokes, setStrokes }: SignatureCanvasProps) => {
  // Get theme mode to choose stroke color
  const { themeMode } = useSettingsContext();
  const isLightMode = themeMode === 'light';

  const handlePointerDown = (e: PointerEvent) => {
    const newStroke = [{ x: e.clientX, y: e.clientY, pressure: e.pressure }];
    setStrokes(prevStrokes => [...prevStrokes, newStroke]);
  };

  const handlePointerMove = (e: PointerEvent<SVGElement>) => {
    if (e.buttons !== 1 || strokes.length === 0) return;

    const updatedStrokes = [...strokes];
    const lastStroke = updatedStrokes[updatedStrokes.length - 1];
    lastStroke.push({ x: e.clientX, y: e.clientY, pressure: e.pressure });
    setStrokes(updatedStrokes);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        style={{ touchAction: 'none', width: '100%', height: '100%' }}
      >
        {strokes.map((stroke, index) => (
          <path
            key={index}
            d={getSvgPathFromStroke(getStroke(stroke, options))}
            fill={isLightMode ? 'black' : 'white'}
          />
        ))}
      </svg>
    </Box>
  );
};

export default SignatureCanvas;
