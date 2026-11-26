import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/secular-one/hebrew-400.css';
import '@fontsource/secular-one/latin-400.css';
import '@fontsource/assistant/hebrew-400.css';
import '@fontsource/assistant/hebrew-600.css';
import '@fontsource/assistant/latin-400.css';
import '@fontsource/assistant/latin-600.css';
import '@fontsource/silkscreen/latin-400.css';
import '@fontsource/silkscreen/latin-700.css';
import './styles/index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
