import { registerRootComponent } from 'expo';

import App from './App';
import { registerWidget } from './src/widget/sync';

registerWidget();
registerRootComponent(App);
