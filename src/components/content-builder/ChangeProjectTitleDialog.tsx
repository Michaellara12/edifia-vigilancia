import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { RefObject } from "react";

type ChangeProjectTitleDialogType = {
    open: boolean;
    handleClose: VoidFunction;
    title: string;
    valueRef: RefObject<HTMLInputElement>
    updateProjectTitle: (e: React.MouseEvent<HTMLElement>) => Promise<void>
}

export default function ChangeProjectTitleDialog({open, handleClose, title, valueRef, updateProjectTitle}:ChangeProjectTitleDialogType) {
  
    return (
      <div>
       
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edita el nombre del proyecto</DialogTitle>
          <DialogContent>
           
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Nombre del proyecto"
              fullWidth
              variant="standard"
              defaultValue={title}
              inputRef={valueRef}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={updateProjectTitle} variant='contained'>Guardar</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }