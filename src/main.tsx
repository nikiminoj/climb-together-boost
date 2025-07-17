import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from '../src/app/store'

createRoot(document.getElementById("root")!).render(<App />);
createRoot(document.getElementById("root")!).render(<Provider store={store}><App /></Provider>);
