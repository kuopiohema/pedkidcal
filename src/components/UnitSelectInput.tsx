import { Stack, TextField, InputAdornment, FormControlLabel, Radio, RadioGroup, StandardTextFieldProps } from "@mui/material";
import React from "react";
import { Unit } from '../fields';

interface UnitSelectInputProps extends StandardTextFieldProps {
    units: Unit[];
    unitIndex: number;
    onUnitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UnitSelectInput(props: UnitSelectInputProps) {
    const options = props.units.map((unit, index) =>
        <FormControlLabel key={unit.id} value={index} control={<Radio />} label={unit.label} />
    );
    const { units, unitIndex, onUnitChange, ...textFieldProps } = props;

    return (
        <Stack direction="row" spacing={2}>
            <TextField
                InputProps={{endAdornment: <InputAdornment position="end">{props.units[props.unitIndex].label}</InputAdornment>}}
                {...textFieldProps}
            />
            <RadioGroup value={props.unitIndex} onChange={props.onUnitChange} row>
                {options}
            </RadioGroup>
        </Stack>
    );
}

export default UnitSelectInput;