import { Alert, AlertTitle, Button, Menu, MenuItem, Snackbar, Tooltip } from "@mui/material";
import { Fragment, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

interface Language {
    id: string,
    label: string,
    tooltip: string,
}

const languages: Language[] = [
    {
        id: 'en',
        label: 'EN',
        tooltip: 'English',
    },
    {
        id: 'fi',
        label: 'FI',
        tooltip: 'Suomi'
    },
]

export function LanguageSelect() {
    const { t, i18n } = useTranslation();

    const menuButton = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const handleClick = () => setOpen(!open);
    const handleClose = () => setOpen(false);

    const initialIndex = Math.max(languages.findIndex(lang => lang.id === i18n.resolvedLanguage), 0);

    const [selectedIndex, setSelectedIndex] = useState(initialIndex);
    const [errorOpen, setErrorOpen] = useState(false);
    const handleSelect = (index: number) => {
        setOpen(false);
        if (selectedIndex >= languages.length)
            return;

        i18n.changeLanguage(languages[index].id)
            .then(() => setSelectedIndex(index))
            .catch(() => setErrorOpen(true));
    }

    const menuOptions = languages.map((lang, index) => {
        return (
            <Tooltip key={lang.id} title={lang.tooltip} placement="left">
                <MenuItem onClick={() => handleSelect(index)}>{lang.label}</MenuItem>
            </Tooltip>
        );
    });

    return (
        <Fragment>
            <Tooltip title={t('ui.selectLanguage') as string}>
                <Button
                    ref={menuButton}
                    onClick={handleClick}
                    variant="text"
                    color="inherit"
                    sx={{ minWidth: '40px', width: '40px', marginLeft: '10px', marginRight: '10px' }}
                >
                    {languages[selectedIndex].label}
                </Button>
            </Tooltip>
            <Menu anchorEl={menuButton.current} open={open} onClose={handleClose}>
                {menuOptions}
            </Menu>
            <Snackbar open={errorOpen} autoHideDuration={6000} onClose={() => setErrorOpen(false)}>
                <Alert onClose={() => setErrorOpen(false)}>
                    <AlertTitle>{t('messages.error')}</AlertTitle>
                    {t('messages.translationLoadingError')}
                </Alert>
            </Snackbar>
        </Fragment>
    )
}