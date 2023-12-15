import { SelectChangeEvent } from "@mui/material";

export type FormSelectorNumberType = {
    val: number;
    handleSelectFormChange: (event: SelectChangeEvent<number>) => void;
}

export type FormSelectorStringType = {
    val: string | undefined;
    handleSelectFormChange: (event: SelectChangeEvent<string>) => void;
}