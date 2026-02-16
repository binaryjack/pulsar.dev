/**
 * Core Pulsar Type Definitions
 *
 * These types provide a standardized way to declare component props
 * with clear semantic meaning for reactive and non-reactive values.
 *
 * @see https://github.com/solidjs/solid - Inspired by SolidJS patterns
 */

import type { IEffect } from '../reactivity/effect/effect.types';
import type { IMemo } from '../reactivity/memo/memo.types';
import type { ISignal, ISignalOptions } from '../reactivity/signal/signal.types';

declare global {
  namespace Pulsar {
    /**
     * Accessor - Reactive getter function
     *
     * An Accessor is a function that returns the current value of a reactive state.
     * Calling it subscribes to changes in reactive contexts.
     *
     * @template T - The type of value being accessed
     *
     * @example
     * ```tsx
     * interface Props {
     *   count: Pulsar.Accessor<number>  // Must be called: count()
     * }
     *
     * const Component = ({ count }: Props) => {
     *   return <div>Count: {count()}</div>  // ✓ Correct
     * };
     * ```
     */
    export type Accessor<T> = () => T;

    /**
     * Setter - State updater function
     *
     * A Setter is a function that updates reactive state.
     * Can accept either a new value or a function that receives the previous value.
     *
     * @template T - The type of value being set
     *
     * @example
     * ```tsx
     * interface Props {
     *   setCount: Pulsar.Setter<number>
     * }
     *
     * const Component = ({ setCount }: Props) => {
     *   return (
     *     <button onClick={() => setCount(c => c + 1)}>
     *       Increment
     *     </button>
     *   );
     * };
     * ```
     */
    export type Setter<T> = (value: T | ((prev: T) => T)) => void;

    /**
     * Signal - Reactive state tuple [getter, setter]
     *
     * A Signal is the tuple returned by createSignal(), combining
     * both the Accessor and Setter for a reactive value.
     *
     * @template T - The type of the signal's value
     *
     * @example
     * ```tsx
     * const [count, setCount] = createSignal(0);
     * // count: Accessor<number>
     * // setCount: Setter<number>
     * // [count, setCount]: Signal<number>
     * ```
     */
    export type Signal<T> = [Accessor<T>, Setter<T>];

    /**
     * Component - Basic component function
     *
     * @template P - Props type
     *
     * @example
     * ```tsx
     * interface ButtonProps {
     *   label: string
     *   onClick: () => void
     * }
     *
     * const Button: Pulsar.Component<ButtonProps> = ({ label, onClick }) => {
     *   return <button onClick={onClick}>{label}</button>;
     * };
     * ```
     */
    export type Component<P = {}> = (props: P) => JSX.Element;

    /**
     * ParentComponent - Component that accepts children
     *
     * @template P - Props type (children will be added automatically)
     *
     * @example
     * ```tsx
     * interface CardProps {
     *   title: string
     * }
     *
     * const Card: Pulsar.ParentComponent<CardProps> = ({ title, children }) => {
     *   return (
     *     <div>
     *       <h3>{title}</h3>
     *       {children()}
     *     </div>
     *   );
     * };
     * ```
     */
    export type ParentComponent<P = {}> = Component<P & { children: Accessor<JSX.Element> }>;

    /**
     * PropsWithChildren - Helper to add children prop to interface
     *
     * @template P - Base props type
     *
     * @example
     * ```tsx
     * interface CardProps {
     *   title: string
     * }
     *
     * type CardPropsWithChildren = Pulsar.PropsWithChildren<CardProps>;
     * // Equivalent to: CardProps & { children: Accessor<JSX.Element> }
     * ```
     */
    export type PropsWithChildren<P = {}> = P & { children: Accessor<JSX.Element> };

    /**
     * PropsWithOptionalChildren - Helper to add optional children prop
     *
     * @template P - Base props type
     *
     * @example
     * ```tsx
     * interface ModalProps {
     *   title: string
     *   onClose: () => void
     * }
     *
     * type ModalPropsWithChildren = Pulsar.PropsWithOptionalChildren<ModalProps>;
     * // children becomes optional: { children?: Accessor<JSX.Element> }
     * ```
     */
    export type PropsWithOptionalChildren<P = {}> = P & { children?: Accessor<JSX.Element> };

    /**
     * Re-export internal signal types for advanced use cases
     */
    export type { ISignal, ISignalOptions };
    export type { IMemo };
    export type { IEffect };
  }
}

/**
 * Top-level exports for convenience
 * These can be imported directly without the Pulsar namespace
 *
 * @example
 * ```tsx
 * import type { Accessor, Setter } from '@pulsar-framework/pulsar.dev';
 *
 * interface Props {
 *   count: Accessor<number>
 *   setCount: Setter<number>
 * }
 * ```
 */
export type Accessor<T> = Pulsar.Accessor<T>;
export type Setter<T> = Pulsar.Setter<T>;
export type Signal<T> = Pulsar.Signal<T>;
export type Component<P = {}> = Pulsar.Component<P>;
export type ParentComponent<P = {}> = Pulsar.ParentComponent<P>;
export type PropsWithChildren<P = {}> = Pulsar.PropsWithChildren<P>;
export type PropsWithOptionalChildren<P = {}> = Pulsar.PropsWithOptionalChildren<P>;
