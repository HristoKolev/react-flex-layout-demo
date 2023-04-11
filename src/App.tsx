import { memo, useRef } from 'react';
import { IJsonModel, Layout, Model, TabNode } from 'flexlayout-react';

import 'flexlayout-react/style/dark.css';

const RenderCounter = (): JSX.Element => {
  const countRef = useRef(0);
  countRef.current += 1;
  return <span>Render Count - {countRef.current}</span>;
};

const App1 = memo(
  (): JSX.Element => (
    <div>
      App 1 | <RenderCounter />
    </div>
  )
);

const App2 = memo(
  (): JSX.Element => (
    <div>
      App 2 | <RenderCounter />
    </div>
  )
);

const App3 = memo(
  (): JSX.Element => (
    <div>
      App 3 | <RenderCounter />
    </div>
  )
);

const App4 = memo(
  (): JSX.Element => (
    <div>
      {' '}
      App 4 | <RenderCounter />{' '}
    </div>
  )
);

const App5 = memo(
  (): JSX.Element => (
    <div>
      App 5 | <RenderCounter />
    </div>
  )
);

const modelJson: IJsonModel = {
  global: {
    tabEnableFloat: false,
    tabEnableClose: false,
  },
  borders: [],
  layout: {
    type: 'row',
    weight: 100, // ???
    children: [
      {
        type: 'tabset',
        weight: 50, // ???
        children: [
          {
            type: 'tab',
            name: 'App 1',
            component: 'app-1',
          },
          {
            type: 'tab',
            name: 'App 2',
            component: 'app-2',
          },
          {
            type: 'tab',
            name: 'App 3',
            component: 'app-3',
          },
          {
            type: 'tab',
            name: 'App 4',
            component: 'app-4',
          },
          {
            type: 'tab',
            name: 'App 5',
            component: 'app-5',
          },
        ],
      },
    ],
  },
};

const model = Model.fromJson(modelJson);

const createComponent = (node: TabNode) => {
  switch (node.getComponent()) {
    case 'app-1': {
      return <App1 />;
    }
    case 'app-2': {
      return <App2 />;
    }
    case 'app-3': {
      return <App3 />;
    }
    case 'app-4': {
      return <App4 />;
    }
    case 'app-5': {
      return <App5 />;
    }
  }
};

export const App = (): JSX.Element => (
  <Layout model={model} factory={createComponent} />
);
