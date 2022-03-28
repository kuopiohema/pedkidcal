import './app.css';
import { useTranslation } from 'react-i18next';
import {
    useMediaQuery,
    ThemeProvider,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Container,
    Stack,
    FormControl,
    Paper,
    Tooltip,
    Link,
    Button,
    FormLabel,
    FormControlLabel,
    Radio,
    RadioGroup
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CalculateIcon from '@mui/icons-material/Calculate';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useEffect, useMemo } from 'react';
import * as themes from './theme';
import { Fields, fieldIndices, getConvertedValue } from './fields';
import UnitSelectInput from './components/UnitSelectInput';
import { LanguageSelect } from './components/LanguageSelect';

function App() {
    // I18N
    const { t } = useTranslation();

    // Theme
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [darkMode, setDarkMode] = useState(false);
    useEffect(() => { setDarkMode(prefersDarkMode); }, [prefersDarkMode]);

    const theme = useMemo(() => darkMode ? themes.dark : themes.light, [darkMode]);

    // Number inputs
    const [values, setValues] = useState(Array(Fields.length).fill(''));
    const [unitIndices, setUnitIndices] = useState(Array(Fields.length).fill('0'));
    
    // Non-number inputs
    const [gender, setGender] = useState<string>(''); // gender (0 = female, 1 = male)

    const handleValueChange = (value: string, fieldIndex: number) => {
        // replace commas with dots
        value = value.replace(',', '.');

        // check if input is a valid number, abort if it isn't
        if (!(/^\d*\.?\d*$/.test(value)))
            return;

        const newValues = values.slice();
        newValues[fieldIndex] = value;
        setValues(newValues);
    }

    const handleUnitChange = (unitIndex: string, fieldIndex: number) => {
        const newUnitIndices = unitIndices.slice();
        newUnitIndices[fieldIndex] = unitIndex;
        setUnitIndices(newUnitIndices);
    }

    const handleGenderChange = (input: string) =>
    {
        setGender(input);
    }

    const handleClearAll = () => {
        setValues(Array(Fields.length).fill(''));
        setGender('');
        setUnitIndices(Array(Fields.length).fill('0'));
    }

    const ckid = useMemo(() => {
        const valueGender = Number.parseInt(gender);
        
        const creaIndex = fieldIndices.crea;
        const ureaIndex = fieldIndices.urea;
        const cyscIndex = fieldIndices.cysc;
        const heightIndex = fieldIndices.height;

        const crea = getConvertedValue(values[creaIndex], creaIndex, unitIndices[creaIndex]) || 0;
        const urea = getConvertedValue(values[ureaIndex], ureaIndex, unitIndices[ureaIndex]) || 0;
        const cysc = getConvertedValue(values[cyscIndex], cyscIndex, unitIndices[cyscIndex]) || 0;
        const height = getConvertedValue(values[heightIndex], heightIndex, unitIndices[heightIndex]) / 100 || 0;
        
        const result = 39.1 * Math.pow(height / crea, 0.516) * Math.pow(1.8 / cysc, 0.294) * Math.pow(30 / urea, 0.169) * Math.pow(height / 1.4, 0.188) * Math.pow(1.099, valueGender) || 0;

        return result < 75 ? result.toFixed(2) : '> 75';
    }, [values, unitIndices, gender]);

    const bse = useMemo(() => {
        const creaIndex = fieldIndices.crea;
        const heightIndex = fieldIndices.height;

        const crea = getConvertedValue(values[creaIndex], creaIndex, unitIndices[creaIndex]) || 0;
        const height = getConvertedValue(values[heightIndex], heightIndex, unitIndices[heightIndex]) || 0;

        const result = 0.413 * height / crea || 0;
        return result.toFixed(2);
    }, [values, unitIndices]);

    const numberInputs = Fields.map((field, index) => {
        return (
            <UnitSelectInput
                key={field.id}
                label={t(`fields.${field.id}`)}
                value={values[index]}
                units={field.units}
                unitIndex={unitIndices[index]}
                onChange={(e) => handleValueChange((e.target as HTMLInputElement).value, index)}
                onUnitChange={(e) => handleUnitChange((e.target as HTMLInputElement).value, index)}
            />
        )
    });

    const title = darkMode ? t('ui.lightMode') : t('ui.darkMode');

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar enableColorOnDark>
                <Toolbar>
                    <CalculateIcon />
                    <Typography variant="h6" component="div" sx={{ paddingLeft: '10px', flexGrow: 1 }}>
                        {t('title')}
                    </Typography>
                    <LanguageSelect />
                    <Tooltip title={title}>
                        <IconButton size="large" color="inherit" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Container sx={{ p: 4 }}>
                <Stack spacing={4}>
                    <Paper elevation={2} sx={{ p: 4 }}>
                        <Stack spacing={2}>
                            <FormControl>
                                <FormLabel sx={{ '&.Mui-focused': { color: `${theme.palette.text.secondary}` } }}>{t('fields.gender.label')}</FormLabel>
                                <RadioGroup
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => handleGenderChange(e.target.value)}
                                    row
                                >
                                    <FormControlLabel value="0" control={<Radio />} label={t('fields.gender.female') as string} />
                                    <FormControlLabel value="1" control={<Radio />} label={t('fields.gender.male') as string} />
                                </RadioGroup>
                            </FormControl>
                            {numberInputs}
                            <Button
                                variant="outlined"
                                color={darkMode ? "secondary" : "primary"}
                                startIcon={<ClearIcon />}
                                sx={{ alignSelf: 'flex-start' }}
                                onClick={handleClearAll}
                            >
                                {t('ui.clearAll')}
                            </Button>
                        </Stack>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 4 }}>
                        <Stack spacing={2}>
                            <Typography variant="h5">{t('results.heading')}:</Typography>
                            <Typography variant="body1">
                                {t('results.ckid')}<sup>1</sup>: <b>{ckid} ml/min/1.73 m<sup>2</sup></b>
                            </Typography>
                            <Typography variant="body1">
                                {t('results.bse')}<sup>2</sup>: <b>{bse} ml/min/1.73 m<sup>2</sup></b>
                            </Typography>
                            <div />
                            <Typography variant="body2">
                                <sup>1</sup>eGFR
                                <sub>ml/min/1.73 m<sup>2</sup></sub>
                                = 39.1 x ({t('fields.height')}<sub>m</sub>
                                / {t('fields.crea')}<sub>mg/dl</sub>)<sup>0.516</sup>
                                x (1.8 / {t('fields.cysc')}<sub>mg/l</sub>)<sup>0.294</sup>
                                x (30 / {t('fields.urea')}<sub>mg/dl</sub>)<sup>0.169</sup>
                                x ({t('fields.height')}<sub>m</sub> / 1.4)<sup>0.188</sup>
                                x 1.099 [{t('results.onlyIfMale')}]
                            </Typography>
                            <Typography variant="body2">
                                <sup>2</sup>eGFR<sub>ml/min/1.73 m<sup>2</sup></sub>
                                = 0.413 x {t('fields.height')}<sub>cm</sub>
                                / {t('fields.crea')}<sub>mg/dl</sub>
                            </Typography>
                            <div />
                            <Typography variant="h6">{t('results.sources')}</Typography>
                            <Typography variant="body2">
                                <Link href="https://pubmed.ncbi.nlm.nih.gov/19158356/" target="_blank" rel="noreferrer noopener">Schwartz et al. New equations to estimate GFR in children with CKD. J Am Soc Nephrol. 2009 Mar;20(3):629-37</Link><br />
                                <Link href="https://pubmed.ncbi.nlm.nih.gov/20652327/" target="_blank" rel="noreferrer noopener">Staples et al. Validation of the revised Schwartz estimating equation in a predominantly non-CKD population. Pediatr Nephrol. 2010 Nov;25(11):2321-6</Link>
                            </Typography>
                        </Stack>
                    </Paper>
                </Stack>
            </Container>
        </ThemeProvider>
    );
}

export default App;
