/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0.
 */
import ReactDOM from 'react-dom/client';
import Mqtt311 from './PubSub';
import Mqtt5 from './PubSub5';

const root = ReactDOM.createRoot(
  document.getElementById('react_app') as HTMLElement
);
root.render(
  <Mqtt5 />
  // Comment the Mqtt5 and uncomment Mqtt311 to enable the Mqtt311 component
  // <Mqtt311 />
);
