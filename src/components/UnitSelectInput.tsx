import { Stack, TextField, InputAdornment, ToggleButtonGroup, ToggleButtonGroupProps, TextFieldProps, ToggleButton } from "@mui/material";
import React from "react";
import { UnitList } from '../utils';

interface UnitSelection {
    units: UnitList;
    selectedIndex: number;
    onUnitChange: (e: React.MouseEvent) => void;
}

type UnitSelectInputProps = UnitSelection & ToggleButtonGroupProps & TextFieldProps;

function UnitSelectInput(props: UnitSelectInputProps) {
    const buttons = Object.entries(props.units).map((unit, index) =>
        <ToggleButton value={index}>{unit}</ToggleButton>
    );

    return (
        <Stack direction="row" spacing={2}>
            <TextField
                InputProps={{endAdornment: <InputAdornment position="end">{props.units[props.selectedIndex]}</InputAdornment>}}
                {...props}
            />
            <ToggleButtonGroup value={props.selectedIndex} onChange={props.onUnitChange} exclusive>
                {buttons}
            </ToggleButtonGroup>
        </Stack>
    );
}

export default UnitSelectInput;