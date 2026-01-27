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
export interface IAppContext {
    appName: string;
    version: string;
    theme?: string;
    [key: string]: any;
}
/**
 * Application context with default values
 */
export declare const AppContext: import("./index").IContext<IAppContext>;
/**
 * Hook to access app context
 */
export declare const useAppContext: () => IAppContext;
export interface IAppContextProviderProps {
    root: IApplicationRoot;
    context: IAppContext;
    children: HTMLElement;
}
/**
 * AppContextProvider component wrapper
 * Mounts the application and provides context
 */
export declare const AppContextProvider: ({ root, context, children, }: IAppContextProviderProps) => HTMLElement;
