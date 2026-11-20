import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ id = 'theme-toggle' }) {
  const { isDark, toggleTheme } = useTheme();
  const Icon = isDark ? Sun : Moon;

  return (
    <button type="button" id={id} className="icon-button" onClick={toggleTheme}
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'} title="Ganti tema">
      <Icon size={19} aria-hidden="true" />
    </button>
  );
}
