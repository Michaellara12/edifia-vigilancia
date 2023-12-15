import { forwardRef, useState, useRef } from 'react';
// @mui
import { Dialog, Slide } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
// components
import { DeskTopSignatureDecor, MobileSignatureDecor } from './styles';
import { ActionButtonStack } from './styles';
import SignatureCanvas from './signature-canvas';
// styles
import { Wrapper } from './styles';
// hooks
import useResponsive from 'src/hooks/useResponsive';
// types
import { SignatureDialogProps, Point } from './types';
  
// ----------------------------------------------------------------------

// Dialog transition animation
export const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// ----------------------------------------------------------------------
  
export default function SignatureDialog({ open, handleClose, setSignature }: SignatureDialogProps) {
    const isMobile = useResponsive('down', 'sm');
    const svgRef = useRef<SVGSVGElement>(null);
    const [strokes, setStrokes] = useState<Point[][]>([]);
  
    const handleSaveAsPng = () => {
      if (svgRef.current) {
        // Convert all paths in the SVG to black
        const paths = svgRef.current.querySelectorAll('path');
        paths.forEach(path => {
          path.style.fill = 'black';
          path.style.stroke = 'black'; // If the path has a stroke, set that to black too
        });
    
        const svgXml = new XMLSerializer().serializeToString(svgRef.current);
        const container = svgRef.current.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          const svgBlob = new Blob([svgXml], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
      
          const img = new Image();
          
          img.onload = () => {
            canvas.width = container.width;
            canvas.height = container.height;
            ctx.drawImage(img, 0, 0);
      
            const dataURL = canvas.toDataURL('image/png');
            setSignature(dataURL);
            const link = document.createElement('a');
            link.href = dataURL;
          };
          img.src = url;
        }
      }
      handleClose();
    };

    const handleReset = () => {
      setStrokes([])
      setSignature(null)
    }

    return (
      <>
        <Dialog
          fullScreen
          open={open}
          onClose={handleClose}
          TransitionComponent={Transition}
        >
          <ActionButtonStack 
            handleClose={handleClose} 
            handleSave={handleSaveAsPng} 
            handleReset={handleReset}
          />
          
          {isMobile 
            ?
              <MobileSignatureDecor />
            :
              <DeskTopSignatureDecor />
          }
          
          <Wrapper>
            <SignatureCanvas 
              strokes={strokes}
              setStrokes={setStrokes}
              svgRef={svgRef}
            />
          </Wrapper>
        </Dialog>
      </>
    );
}
