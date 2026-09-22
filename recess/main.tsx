import { createRoot } from 'react-dom/client';
import '@fontsource-variable/dm-sans';
import '@fontsource/space-mono/latin-400.css';
import '@fontsource/space-mono/latin-700.css';
import '@fontsource/archivo-black/latin-400.css';
import './.generated.css';
import './zine.css';
import './hosting.css';
import BrainBreak from './page';

createRoot(document.getElementById('root')!).render(<BrainBreak />);
