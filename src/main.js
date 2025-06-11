import { createRoot } from 'react-dom/client';
import vkBridge from '@vkontakte/vk-bridge';
import { AppConfig } from './AppConfig.js';

vkBridge.send('VKWebAppInit');
const express = require('express');  
const cors = require('cors');  
const app = express();  
  
// Включить CORS для всех запросов  
app.use(cors());  

createRoot(document.getElementById('root')).render(<AppConfig />);

if (import.meta.env.MODE === 'development') {
  import('./eruda.js');
}
