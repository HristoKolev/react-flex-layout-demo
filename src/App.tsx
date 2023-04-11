import { Layout, Model, TabNode, IJsonModel } from 'flexlayout-react';

import 'flexlayout-react/style/light.css';

const json: IJsonModel = {
  global: {
    tabEnableFloat: false,
  },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 50,
        children: [
          {
            type: 'tab',
            name: 'One',
            component: 'button',
          },
        ],
      },
      {
        type: 'tabset',
        weight: 50,
        children: [
          {
            type: 'tab',
            name: 'Two',
            component: 'button',
          },
        ],
      },
    ],
  },
};

const model = Model.fromJson(json);

export const App = (): JSX.Element => {
  const factory = (node: TabNode) => {
    console.log('factory called');

    const component = node.getComponent();

    if (component === 'button') {
      return <button>{node.getName()}</button>;
    }
  };

  return <Layout model={model} factory={factory} />;
};
