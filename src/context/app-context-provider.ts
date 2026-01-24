/**
 * AppContextProvider component
 * Framework-level component for bootstrapping Pulsar applications with context
 *
 * @example
 * ```tsx
 * const appRoot = bootstrapApp()
 *   .root('#app')
 *   .onMount((element) => console.log('Mounted'))
 *   .build()
 *
 * const app = (
 *   <AppContextProvider
 *     root={appRoot}
 *     context={{ appName: 'My App', version: '1.0.0' }}
 *   >
 *     <Router>...</Router>
 *   </AppContextProvider>
 * )
 *
 * document.getElementById('app')?.appendChild(app)
 * ```
 */

import { IApplicationRoot } from '../bootstrap';
import { createContext, useContext } from './index';

export interface IAppContext {
  appName: string;
  version: string;
  theme?: string;
  [key: string]: any;
}

/**
 * Application context with default values
 */
export const AppContext = createContext({
  appName: 'Pulsar App',
  version: '1.0.0',
  theme: 'light',
} as IAppContext);

/**
 * Hook to access app context
 */
export const useAppContext = (): IAppContext => {
  const context = useContext(AppContext);
  return context as IAppContext;
};

export interface IAppContextProviderProps {
  root: IApplicationRoot;
  context: IAppContext;
  children: HTMLElement;
}

/**
 * AppContextProvider component wrapper
 * Mounts the application and provides context
 */
export const AppContextProvider = ({
  root,
  context,
  children,
}: IAppContextProviderProps): HTMLElement => {
  const container = document.createElement('div');
  container.className = 'app-context-provider';
  container.setAttribute('data-framework', 'pulsar');

  // Mount children to root on next tick
  Promise.resolve().then(() => {
    const wrapped = AppContext.Provider({ value: context, children });
    root.mount(wrapped);
  });

  return container;
};
