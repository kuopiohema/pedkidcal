const conversions = {
    crea: {
        mgToUmol: 88.4,
        umolToMg: 1/88.4
    },
    urea: {
        mgToMmol: 0.3571,
        mmolToMg: 1/0.3571
    },
    height: {
        cmToIn: 1/2.54,
        inToCm: 2.54
    }
};

const regex = {
    number: /^\d*\.?\d*$/,
    finalDot: /\.$/,
}

const calculatedValueToString = (value: number, isInput: boolean, hasFinalDot?: boolean): string => {
    let result: string;
    if (Number.isNaN(value)) {
        result = ''; // NaN --> empty string
    } else {
        result = value.toString(); // value currently being edited --> keep as is
    }
    
    // if input ends in '.' --> add to output value (final dot gets removed by parsing to float)
    if (isInput && hasFinalDot) {
        result += '.';
    }

    return result;
}

export type UnitList = { readonly [key: string]: string }

const Units = {
    crea: {
        umol: 'µmol/l',
        mgdl: 'mg/dl'
    },
    urea: {
        mmol: 'mmol/l',
        mgdl: 'mg/dl'
    },
    cysc: {
        mgl: 'mg/l'
    },
    height: {
        cm: 'cm',
        in: 'in'
    }
}

enum NumberInputs {
    Crea,
    Urea,
    CysC,
    Height
}

export { conversions, regex, calculatedValueToString, Units, NumberInputs };