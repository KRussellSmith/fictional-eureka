import './css/style.css'
import App from './app.tsx';
import Model from './data.tsx';
import { Controller } from './app';
import { Event } from './event';

const app = App();
document.querySelector<HTMLDivElement>('#app')?.replaceWith(app);
app?.replaceWith(App());
Model.injectView();
Controller.observable.notify(Event.INIT);