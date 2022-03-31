import { Dispatch, ReactElement, SetStateAction, useEffect, useRef, useState } from 'react';
import {
    Alert,
    AlertTitle,
    AppBar,
    IconButton,
    Menu,
    MenuItem,
    Snackbar,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import HelpIcon from '@mui/icons-material/Help';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';

interface AppHeaderProps {
    appIcon: ReactElement;
    darkMode: boolean;
    setDarkMode: Dispatch<SetStateAction<boolean>>;
    helpDialog?: ReactElement;
}

interface Language {
    id: string;
    name: string;
}

const languages: Language[] = [
    {
        id: 'en',
        name: 'English'
    },
    {
        id: 'fi',
        name: 'Suomi'
    }
];

function AppHeader(props: AppHeaderProps) {
    const { t, i18n } = useTranslation();
    const { setDarkMode } = props;

    // Theme Toggle
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    useEffect(() => {
        setDarkMode(prefersDarkMode);
    }, [setDarkMode, prefersDarkMode]);

    // Language Select
    const languageButton = useRef<HTMLButtonElement>(null);
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
    const [languageErrorOpen, setLanguageErrorOpen] = useState(false);
    const handleLanguageSelect = (index: number) => {
        setLanguageMenuOpen(false);
        if (index >= languages.length)
            return;

        i18n.changeLanguage(languages[index].id)
            .catch(() => setLanguageErrorOpen(true));
    };

    const languageOptions = languages.map((lang, index) => {
        return (
            <MenuItem
                key={lang.id}
                onClick={() => handleLanguageSelect(index)}
            >
                {lang.name}
            </MenuItem>
        );
    });

    return (
        <AppBar enableColorOnDark>
            <Toolbar>
                {props.appIcon}
                <Typography variant="h6" component="div" sx={{ paddingLeft: '10px', flexGrow: 1 }}>
                    {t('title')}
                </Typography>
                <Tooltip title={t('ui.buttons.selectLanguage') as string}>
                    <IconButton
                        ref={languageButton}
                        onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                        size="large"
                        color="inherit"
                    >
                        <LanguageIcon/>
                    </IconButton>
                </Tooltip>
                <Menu
                    open={languageMenuOpen}
                    onClose={() => setLanguageMenuOpen(false)}
                    anchorEl={languageButton.current}
                >
                    {languageOptions}
                </Menu>
                <Snackbar
                    open={languageErrorOpen}
                    autoHideDuration={6000}
                    onClose={() => setLanguageErrorOpen(false)}
                >
                    <Alert onClose={() => setLanguageMenuOpen(false)}>
                        <AlertTitle>{t('ui.messages.error')}</AlertTitle>
                        {t('ui.messages.translationError')}
                    </Alert>
                </Snackbar>
                <Tooltip title={(props.darkMode ? t('ui.buttons.lightMode') : t('ui.buttons.darkMode')) as string}>
                    <IconButton size="large" color="inherit" onClick={() => props.setDarkMode(!props.darkMode)}>
                        {props.darkMode ? <Brightness7Icon/> : <Brightness4Icon/>}
                    </IconButton>
                </Tooltip>
                {
                    props.helpDialog !== undefined &&
                    <Tooltip title={t('ui.buttons.help') as string}>
                        <IconButton size="large" color="inherit">
                            <HelpIcon/>
                        </IconButton>
                    </Tooltip>
                }
            </Toolbar>
        </AppBar>
    );
}

export default AppHeader;