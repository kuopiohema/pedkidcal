export interface Unit {
    id: string,
    label: string,
    conversion: number
}

export interface Field {
    id: string,
    label: string,
    units: Unit[]
}

export const Fields: Field[] = [
    {
        id: 'crea',
        label: 'Creatinine',
        units: [
            {
                id: 'µmol',
                label: 'µmol/l',
                conversion: 1/88.4
            },
            {
                id: 'mg',
                label: 'mg/dl',
                conversion: 1
            }
        ]
    },
    {
        id: 'urea',
        label: 'BUN',
        units: [
            {
                id: 'mmol',
                label: 'mmol/l',
                conversion: 1/0.3571
            },
            {
                id: 'mg',
                label: 'mg/dl',
                conversion: 1
            }
        ]
    },
    {
        id: 'cysc',
        label: 'Cystatin C',
        units: [
            {
                id: 'mg',
                label: 'mg/l',
                conversion: 1
            }
        ]
    },
    {
        id: 'height',
        label: 'Height',
        units: [
            {
                id: 'cm',
                label: 'cm',
                conversion: 1
            },
            {
                id: 'in',
                label: 'in',
                conversion: 2.54
            }
        ]
    }
];

export const fieldIndices = {
    crea: Fields.findIndex(f => f.id === 'crea'),
    urea: Fields.findIndex(f => f.id === 'urea'),
    cysc: Fields.findIndex(f => f.id === 'cysc'),
    height: Fields.findIndex(f => f.id === 'height')
};

export const getConvertedValue = (inputValue: string, fieldIndex: number, unitIndex: number): number => {
    const value = Number.parseFloat(inputValue);
    const conversionFactor = Fields[fieldIndex].units[unitIndex].conversion;
    return value * conversionFactor;
};