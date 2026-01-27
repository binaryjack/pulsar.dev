/**
 * useFormular Hook
 *
 * Signal-based form management for Pulsar + formular.dev
 * Provides reactive form state with automatic validation and submission handling
 */
import type { IFormularHook, IFormularOptions } from './formular.types';
/**
 * useFormular - Main hook for form management
 *
 * @param options - Form configuration
 * @returns Form hook with reactive fields and methods
 *
 * @example
 * const form = useFormular({
 *   initialValues: { name: '', email: '' },
 *   validators: { email: 'required|email' },
 *   onSubmit: async (values) => {
 *     await api.post('/users', values)
 *   }
 * })
 *
 * return (
 *   <form onSubmit={form.handleSubmit}>
 *     <input
 *       value={form.fields.name.value()}
 *       onInput={(e) => form.fields.name.setValue(e.target.value)}
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * )
 */
export declare function useFormular<T extends Record<string, any>>(options: IFormularOptions<T>): IFormularHook<T>;
