import './app.css';
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
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Paper,
    Tooltip,
    Link,
    Button
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CalculateIcon from '@mui/icons-material/Calculate';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useEffect, useMemo } from 'react';
import * as themes from './theme';
import { regex, conversions, calculatedValueToString, NumberInputs, Units } from './utils';
import UnitSelectInput from './components/UnitSelectInput';

function App() {
    // Theme
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [darkMode, setDarkMode] = useState(false);
    useEffect(() => { setDarkMode(prefersDarkMode); }, [prefersDarkMode]);

    // Input variables
    const [crea, setCrea] = useState({ umoll: '', mgdl: '' }); // Creatinine
    const [creaUnit, setCreaUnit] = useState(Units.crea.umol);
    const [urea, setUrea] = useState({ mmoll: '', mgdl: '' }); // Urea/BUN
    const [cysc, setCysc] = useState(''); // Cystatin C in mg/l
    const [height, setHeight] = useState({ cm: '', in: '' }); // height
    const [gender, setGender] = useState<number | string>(''); // gender (0 = female, 1 = male)

    const handleChange = (input: string, value: NumberInputs, unit: string) => {
        // replace commas with dots
        input = input.replace(',', '.');

        // check if input is a valid number, abort if it isn't
        if (!regex.number.test(input))
            return;

        // does original input end in '.'?
        const hasFinalDot = regex.finalDot.test(input);

        // convert to float - this should always work due to above check
        // note: empty string and "." get parsed to "NaN", this is taken care of later
        const inputValue = Number.parseFloat(input);

        switch (value) {
            case NumberInputs.Crea: {
                let umolString = '';
                let mgdlString = '';
                if (unit === Units.crea.umol) {
                    let umol = inputValue;
                    let mgdl = inputValue * conversions.crea.umolToMg;

                    umolString = calculatedValueToString(umol, true, hasFinalDot);
                    mgdlString = calculatedValueToString(mgdl, false, hasFinalDot);
                }
                if (unit === Units.crea.mgdl) {
                    let umol = inputValue * conversions.crea.mgToUmol;
                    let mgdl = inputValue;

                    umolString = calculatedValueToString(umol, false, hasFinalDot);
                    mgdlString = calculatedValueToString(mgdl, true, hasFinalDot);
                }

                setCrea({ umoll: umolString, mgdl: mgdlString });
                break;
            }
            case NumberInputs.Urea: {                
                let mmolString = '';
                let mgdlString = '';
                if (unit === Units.urea.mmol) {
                    let mmol = inputValue;
                    let mgdl = inputValue * conversions.urea.mmolToMg;

                    mmolString = calculatedValueToString(mmol, true, hasFinalDot);
                    mgdlString = calculatedValueToString(mgdl, false, hasFinalDot);
                }
                if (unit === Units.urea.mgdl) {
                    let mmol = inputValue * conversions.urea.mgToMmol;
                    let mgdl = inputValue;

                    mmolString = calculatedValueToString(mmol, false, hasFinalDot);
                    mgdlString = calculatedValueToString(mgdl, true, hasFinalDot);
                }

                setUrea({ mmoll: mmolString, mgdl: mgdlString });
                break;
            }
            case NumberInputs.CysC: {
                if (!(unit === Units.cysc.mgl))
                    return;
                const mglString = calculatedValueToString(inputValue, true, hasFinalDot);
                setCysc(mglString);
                break;
            }
            case NumberInputs.Height: {
                let cmString = '';
                let inString = '';
                if (unit === Units.height.cm) {
                    let cm = inputValue;
                    let inch = inputValue * conversions.height.cmToIn;

                    cmString = calculatedValueToString(cm, true, hasFinalDot);
                    inString = calculatedValueToString(inch, false, hasFinalDot);
                }
                if (unit === Units.height.in) {
                    let cm = inputValue * conversions.height.inToCm;
                    let inch = inputValue;
                    
                    cmString = calculatedValueToString(cm, false, hasFinalDot);
                    inString = calculatedValueToString(inch, true, hasFinalDot);
                }

                setHeight({ cm: cmString, in: inString });
                break;
            }
        }
    }

    const handleGenderChange = (input: number | string) =>
    {
        if (typeof(input) === 'string') {
            setGender(Number.parseInt(input as string));
        } else {
            setGender(input as number);
        }
    }

    const handleClearAll = () => {
        setCrea({ umoll: '', mgdl: '' });
        setUrea({ mmoll: '', mgdl: '' });
        setCysc('');
        setHeight({ cm: '', in: '' });
        setGender('');
    }

    const ckid = useMemo(() => {
        if (typeof(gender) !== 'number')
            return 0;
        const vGender = gender as number;

        const vCrea = Number.parseFloat(crea.mgdl) || 0;
        const vUrea = Number.parseFloat(urea.mgdl) || 0;
        const vCysc = Number.parseFloat(cysc) || 0;
        const vHeight = Number.parseFloat(height.cm) / 100 || 0;
        
        const result = 39.1 * Math.pow(vHeight / vCrea, 0.516) * Math.pow(1.8 / vCysc, 0.294) * Math.pow(30 / vUrea, 0.169) * Math.pow(vHeight / 1.4, 0.188) * Math.pow(1.099, vGender) || 0;
        console.log(result);
        return result.toFixed(2);//result < 75 ? result.toFixed(2) : '> 75';        
    }, [crea, urea, cysc, height, gender]);

    const bse = useMemo(() => {
        const vCrea = Number.parseFloat(crea.mgdl) || 0;
        const vHeight = Number.parseFloat(height.cm) || 0;

        const result = 0.413 * vHeight / vCrea || 0;
        return result.toFixed(2);
    }, [crea, height]);

    return (
        <ThemeProvider theme={darkMode ? themes.dark : themes.light}>
            <CssBaseline />
            <AppBar enableColorOnDark>
                <Toolbar>
                    <CalculateIcon />
                    <Typography variant="h6" component="div" sx={{ paddingLeft: '10px', flexGrow: 1 }}>
                        KidCal - Kidney Function Calculator
                    </Typography>
                    <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
                        <IconButton size="large" edge="start" color="inherit" onClick={() => setDarkMode(!darkMode)}>
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
                            <Typography variant="h5">Measured values:</Typography>
                            <UnitSelectInput
                                id="crea"
                                label="Creatinine"
                                value={crea.umoll}
                                units={Units.crea}
                                selectedUnit={creaUnit}
                                onChange={(e) => console.log((e.target as HTMLInputElement).value)}
                                onUnitChange={(e) => console.log((e.target as HTMLButtonElement).value)}
                            />
                            <Stack direction="row" spacing={2} alignItems="center">
                                <TextField
                                    id="crea_umol_l"
                                    label="Creatinine"
                                    value={crea.umoll}
                                    onChange={(e) => handleChange(e.target.value, NumberInputs.Crea, Units.umol)}
                                    InputProps={{endAdornment: <InputAdornment position="end">µmol/l</InputAdornment>}} 
                                />
                                <CompareArrowsIcon />
                                <TextField
                                    id="crea_mg_dl"
                                    label="Creatinine"
                                    value={crea.mgdl}
                                    onChange={(e) => handleChange(e.target.value, NumberInputs.Crea, Units.mgdl)}
                                    InputProps={{endAdornment: <InputAdornment position="end">mg/dl</InputAdornment>}}
                                />
                            </Stack>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <TextField
                                    id="urea_mmol_l"
                                    label="BUN"
                                    value={urea.mmoll}
                                    onChange={(e) => handleChange(e.target.value, NumberInputs.Urea, Units.mmol)}
                                    InputProps={{endAdornment: <InputAdornment position="end">mmol/l</InputAdornment>}} />
                                <CompareArrowsIcon />
                                <TextField
                                    id="urea_mg_dl"
                                    label="BUN"
                                    value={urea.mgdl}
                                    onChange={(e) => handleChange(e.target.value, NumberInputs.Urea, Units.mgdl)}
                                    InputProps={{endAdornment: <InputAdornment position="end">mg/dl</InputAdornment>}}
                                />
                            </Stack>
                            <TextField
                                id="cysc_mg_l"
                                label="Cystatin C"
                                value={cysc}
                                onChange={(e) => handleChange(e.target.value, NumberInputs.CysC, Units.mgl)}
                                InputProps={{endAdornment: <InputAdornment position="end">mg/l</InputAdornment>}}
                            />
                            <Stack direction="row" spacing={2} alignItems="center">
                                <TextField
                                    id="height_cm"
                                    label="Height"
                                    value={height.cm}
                                    onChange={(e) => handleChange(e.target.value, NumberInputs.Height, Units.cm)}
                                    InputProps={{endAdornment: <InputAdornment position="end">cm</InputAdornment>}}
                                />
                                <CompareArrowsIcon />
                                <TextField
                                    id="height_in"
                                    label="Height"
                                    value={height.in}
                                    onChange={(e) => handleChange(e.target.value, NumberInputs.Height, Units.in)}
                                    InputProps={{endAdornment: <InputAdornment position="end">in</InputAdornment>}}
                                />
                            </Stack>
                            <FormControl>
                                <InputLabel id="gender-label">Gender</InputLabel>
                                <Select
                                    id="gender"
                                    labelId="gender-label"
                                    label="Gender"
                                    value={gender}
                                    onChange={(e) => handleGenderChange(e.target.value)}
                                >
                                    <MenuItem value={0}>Female</MenuItem>
                                    <MenuItem value={1}>Male</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                variant="outlined"
                                color={darkMode ? "secondary" : "primary"}
                                startIcon={<ClearIcon />}
                                sx={{ alignSelf: 'flex-start' }}
                                onClick={handleClearAll}
                            >
                                Clear all
                            </Button>
                        </Stack>
                    </Paper>
                    <Paper elevation={2} sx={{ p: 4 }}>
                        <Stack spacing={2}>
                            <Typography variant="h5">Estimated glomerular filtration rate (eGFR):</Typography>
                            <Typography variant="body1">
                                CKiD Schwartz Equation<sup>1</sup>: <b>{ckid} ml/min/1.73 m<sup>2</sup></b>
                            </Typography>
                            <Typography variant="body1">
                                Bedside Schwartz Equation<sup>2</sup>: <b>{bse} ml/min/1.73 m<sup>2</sup></b>
                            </Typography>
                            <div />
                            <Typography variant="body2">
                                <sup>1</sup>eGFR<sub>ml/min/1.73 m<sup>2</sup></sub> = 39.1 x (height<sub>m</sub> / creatinine<sub>mg/dl</sub>)<sup>0.516</sup> x (1.8 / cystatin C<sub>mg/l</sub>)<sup>0.294</sup> x (30 / BUN<sub>mg/dl</sub>)<sup>0.169</sup> x (height<sub>m</sub> / 1.4)<sup>0.188</sup> x 1.099 [only if male]
                            </Typography>
                            <Typography variant="body2">
                                <sup>2</sup>eGFR<sub>ml/min/1.73 m<sup>2</sup></sub> = 0.413 x height<sub>cm</sub> / creatinine<sub>mg/dl</sub>
                            </Typography>
                            <div />
                            <Typography variant="h6">Sources:</Typography>
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
