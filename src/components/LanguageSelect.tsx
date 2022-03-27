import { ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface Language {
    id: string,
    short: string,
    long: string
}

export const languages: Language[] = [
    {
        id: 'en',
        short: 'en',
        long: 'English',
    },
    {
        id: 'fi',
        short: 'fi',
        long: 'Suomi',
    },
]

export function LanguageSelect() {
    const { i18n } = useTranslation();

    const [langId, setLangId] = useState<string | null>();

    //useEffect(() => { setLangId(i18n.resolvedLanguage) }, [i18n.resolvedLanguage]);
    
    const buttons = languages.map((lang) => {
        return (
            <Tooltip key={lang.id} title={lang.long}>
                <ToggleButton value={lang.id}>{lang.short}</ToggleButton>
            </Tooltip>
        );
    });

    const handleLangChange = (value: string | null) => {
        console.log(value);
        if (value /*&& i18n.languages.includes(value)*/) {
            setLangId(value);
            i18n.changeLanguage(value);
        }
    }

    return (
        <ToggleButtonGroup
            value={langId}
            exclusive
            onChange={(_, value) => handleLangChange(value)}
        >
            {buttons}
        </ToggleButtonGroup>
    )
}