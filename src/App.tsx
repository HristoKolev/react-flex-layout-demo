import { memo, useEffect, useRef } from 'react';
import { IJsonModel, Layout, Model, TabNode } from 'flexlayout-react';

import 'flexlayout-react/style/dark.css';

const RenderCounter = ({ name }: { name: string }): JSX.Element => {
  const countRef = useRef(0);
  countRef.current += 1;
  return (
    <span>
      {name} Render Count - {countRef.current}
    </span>
  );
};

const useLogMounting = (name: string) => {
  useEffect(() => {
    console.log('mount ' + name);
    return () => {
      console.log('unmount ' + name);
    };
  }, [name]);
};

const App1 = memo((): JSX.Element => {
  useLogMounting('App1');
  return <RenderCounter name="App 1" />;
});

const App2 = memo((): JSX.Element => {
  useLogMounting('App2');
  return <RenderCounter name="App 2" />;
});

const App3 = memo((): JSX.Element => {
  useLogMounting('App3');
  return <RenderCounter name="App 3" />;
});

const App4 = memo((): JSX.Element => {
  useLogMounting('App4');
  return <RenderCounter name="App 4" />;
});

const App5 = memo((): JSX.Element => {
  useLogMounting('App5');
  return <RenderCounter name="App 5" />;
});

const modelJson: IJsonModel = {
  global: {
    tabEnableFloat: false,
    tabEnableClose: false,
    tabEnableRename: false,
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
  <Layout
    model={model}
    factory={createComponent}
    onRenderTabSet={(tabSetNode, renderValues) => {
      console.log(
        'onRenderTabSet',
        'tabSetNode',
        tabSetNode,
        'renderValues',
        renderValues
      );
      renderValues.buttons.push(<div key="laina">123</div>);
    }}
    onRenderTab={(node, renderValues) => {
      console.log('onRenderTab', 'node', node, 'renderValues', renderValues);
      renderValues.content = <div>{node.getName()} - 123</div>;
    }}
  />
);
