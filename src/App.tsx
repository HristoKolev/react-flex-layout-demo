import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Action,
  Actions,
  BorderNode,
  IJsonModel,
  IJsonRowNode,
  IJsonTabNode,
  IJsonTabSetNode,
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

const savedLayoutKey = 'flexlayout-model';

const app4Config: IJsonTabNode = {
  type: 'tab',
  name: 'App 4',
  component: 'app-4',
};

export const App = (): JSX.Element => {
  const [showApp4, setShowApp4] = useState<boolean>(false);

  const defaultJsonModel = useMemo<IJsonModel>(
    () => ({
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
              ...(showApp4 ? [app4Config] : []),
              {
                type: 'tab',
                name: 'App 5',
                component: 'app-5',
              },
            ],
          },
        ],
      },
    }),
    [showApp4]
  );

  const jsonModel = useMemo(() => {
    const savedJsonModelJson = localStorage.getItem(savedLayoutKey);

    if (!savedJsonModelJson) {
      return defaultJsonModel;
    }

    const savedJsonModel = JSON.parse(savedJsonModelJson) as IJsonModel;

    const addApp4 = (root: IJsonRowNode) => {
      const tabNodes: IJsonTabNode[] = [];
      let firstTabset: IJsonTabSetNode | undefined;

      const walk = (
        nodeJson: IJsonRowNode | IJsonTabSetNode | IJsonTabNode
      ) => {
        if (nodeJson.type === 'tab') {
          tabNodes.push(nodeJson);
          return;
        }

        if (nodeJson.type === 'tabset' && !firstTabset) {
          firstTabset = nodeJson as IJsonTabSetNode;
        }

        if (nodeJson.type === 'row' || nodeJson.type === 'tabset') {
          const rowOrTabsetNodeJson = nodeJson as
            | IJsonRowNode
            | IJsonTabSetNode;
          for (const childNode of rowOrTabsetNodeJson.children) {
            walk(childNode);
          }
        }
      };

      walk(root);

      if (
        !tabNodes.find((x) => x.component === app4Config.component) &&
        firstTabset
      ) {
        firstTabset.children.push(app4Config);
      }
    };

    const removeApp4 = (root: IJsonRowNode) => {
      const walk = (
        nodeJson: IJsonRowNode | IJsonTabSetNode | IJsonTabNode
      ) => {
        if (nodeJson.type === 'tab') {
          return;
        }

        if (nodeJson.type === 'row') {
          const rowNodeJson = nodeJson as IJsonRowNode;

          for (const child of rowNodeJson.children) {
            walk(child);
          }
        }

        if (nodeJson.type === 'tabset') {
          const tabsetNodeJson = nodeJson as IJsonTabSetNode;
          const newTabs = tabsetNodeJson.children.filter(
            (x) => x.component !== app4Config.component
          );

          if (newTabs.length !== tabsetNodeJson.children.length) {
            tabsetNodeJson.children = newTabs;
            tabsetNodeJson.selected = 0;
          }
        }
      };

      walk(root);
    };

    if (showApp4) {
      addApp4(savedJsonModel.layout);
    } else {
      removeApp4(savedJsonModel.layout);
    }

    return savedJsonModel;
  }, [defaultJsonModel, showApp4]);

  const model = useMemo(() => Model.fromJson(jsonModel), [jsonModel]);

  Reflect.set(window, 'model', model);

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
    (node: TabSetNode | BorderNode, renderValues: ITabSetRenderValues) => {
      if (node.getType() === 'tabset') {
        const tabSetNode = node as TabSetNode;

        if (tabSetNode.isActive()) {
          renderValues.buttons.push(<div key="laina">123</div>);
        }
      }
    },
    []
  );

  const handleOnRenderTab = useCallback(
    (node: TabNode, renderValues: ITabRenderValues) => {
      renderValues.content = (
        <div>
          {node.isVisible() ? 'Visible ' : ''}
          {node.getComponent()} - 123
        </div>
      );
    },
    []
  );

  const visibleTabsRef = useRef<string[]>([]);

  const handleOnModelChange = useCallback((model: Model, action: Action) => {
    setTimeout(() => {
      if (action.type !== Actions.SET_ACTIVE_TABSET) {
        localStorage.setItem(savedLayoutKey, JSON.stringify(model.toJson()));
      }

      const newVisibleTabs: string[] = [];
      model.visitNodes((node) => {
        if (node.getType() === 'tab') {
          const tabNode = node as TabNode;
          if (tabNode.isVisible()) {
            newVisibleTabs.push(tabNode.getComponent() as string);
          }
        }
      });

      const oldVisibleTabs = [...visibleTabsRef.current];

      if (newVisibleTabs.length !== oldVisibleTabs.length) {
        visibleTabsRef.current = newVisibleTabs;
        // Update context
        console.log('Update context ', newVisibleTabs);
        return;
      }

      newVisibleTabs.sort((a, b) => a.localeCompare(b));
      oldVisibleTabs.sort((a, b) => a.localeCompare(b));

      for (let i = 0; i < newVisibleTabs.length; i++) {
        if (newVisibleTabs[i] !== oldVisibleTabs[i]) {
          visibleTabsRef.current = newVisibleTabs;
          // Update context
          console.log('Update context ', newVisibleTabs);
          return;
        }
      }
    }, 0);
  }, []);

  const handleOnToggleShow4 = useCallback(() => {
    setShowApp4((x) => !x);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div>
        <button onClick={handleOnToggleShow4}>Toggle show 4</button>
      </div>
      <div style={{ position: 'relative', flex: ' 1 auto' }}>
        <Layout
          model={model}
          factory={createComponent}
          onRenderTabSet={handleOnRenderTabSet}
          onRenderTab={handleOnRenderTab}
          onModelChange={handleOnModelChange}
        />
      </div>
    </div>
  );
};
