import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Action,
  Actions,
  BorderNode,
  IJsonModel,
  ITabRenderValues,
  ITabSetRenderValues,
  Layout,
  Model,
  TabNode,
  TabSetNode,
} from 'flexlayout-react';

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

export const App = (): JSX.Element => {
  const model = useMemo(() => {
    const modelJson: IJsonModel = {
      global: {
        tabEnableFloat: false,
        tabEnableClose: false,
        tabEnableRename: false,
        tabSetEnableMaximize: false,
      },
      borders: [],
      layout: {
        type: 'row',
        children: [
          {
            type: 'tabset',
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
                name: 'App 5',
                component: 'app-5',
              },
            ],
          },
        ],
      },
    };

    return Model.fromJson(modelJson);
  }, []);

  useEffect(() => {
    const handle = setInterval(() => {
      model.visitNodes((node) => {
        if (node.getType() === 'tab') {
          const tabNode = node as TabNode;
          if (tabNode.getComponent() === 'app-3') {
            if (!tabNode.isVisible()) {
              model.doAction(Actions.selectTab(tabNode.getId()));
            }
          }
        }
      });
    }, 1000);

    return () => clearInterval(handle);
  }, [model]);

  const createComponent = useCallback((node: TabNode) => {
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
  }, []);

  const handleOnRenderTabSet = useCallback(
    (
      tabSetNode: TabSetNode | BorderNode,
      renderValues: ITabSetRenderValues
    ) => {
      console.log(
        'onRenderTabSet',
        'tabSetNode',
        tabSetNode,
        'renderValues',
        renderValues
      );
      renderValues.buttons.push(<div key="laina">123</div>);
    },
    []
  );

  const handleOnRenderTab = useCallback(
    (node: TabNode, renderValues: ITabRenderValues) => {
      console.log('onRenderTab', 'node', node, 'renderValues', renderValues);

      renderValues.content = (
        <div>
          {node.isVisible() ? 'Visible' : ''}
          {node.getComponent()} - 123
        </div>
      );
    },
    []
  );

  const handleOnModelChange = useCallback((model: Model, action: Action) => {
    if (action.type === Actions.SELECT_TAB) {
      const nodeId = action.data.tabNode as string;
      const selectedNode = model.getNodeById(nodeId) as TabNode;

      console.log('Selection changed ', selectedNode.getComponent());
    }
  }, []);

  return (
    <Layout
      model={model}
      factory={createComponent}
      onRenderTabSet={handleOnRenderTabSet}
      onRenderTab={handleOnRenderTab}
      onModelChange={handleOnModelChange}
    />
  );
};
