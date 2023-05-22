import ReactDOM from 'react-dom/client';
import Mqtt311 from './PubSub';
import Mqtt5 from './PubSub5';

const root = ReactDOM.createRoot(
  document.getElementById('react_app') as HTMLElement
);
root.render(
    <Mqtt5 />
  // Comment the Mqtt5 and uncomment Mqtt311 to checkout the Mqtt311 sample
  // <Mqtt311 />
);
