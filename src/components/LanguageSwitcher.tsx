import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import i18next from 'i18next'

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language || 'en';

  const languages = [
    { code: 'en', name: i18next.t('english', 'English') },
    { code: 'fr', name: i18next.t('french', 'Français') },
  ];

  const currentLangName = languages.find(lang => lang.code === currentLanguage)?.name || 'Language';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-[80px] justify-start">
          {currentLangName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => { i18next.changeLanguage(lang.code); changeLanguage(lang.code); }}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
