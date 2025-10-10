// utils/check-strings.ts
import { CheckInstance } from '../types/checks';

/**
 * Check `predicate` on all strings of the object, recursively walking into arrays and nested objects, and produce
 * errors using `createError` for each one that returns `true`.
 */
export const checkAllStringsRecursive = (
    obj: unknown,
    predicate: (value: string, path: string) => boolean,
    createError: (value: string, path: string) => CheckInstance
): CheckInstance[] => {
    const results: CheckInstance[] = [];

    const checkValue = (value: unknown, path: string) => {
        if (typeof value === 'string' && predicate(value, path)) results.push(createError(value, path));
        else if (Array.isArray(value)) value.forEach((item, index) => checkValue(item, `${path}/${index}`));
        else if (typeof value === 'object' && value !== null)
            Object.keys(value).forEach((key) =>
                checkValue((value as { [key: string]: unknown })[key], `${path}/${key}`)
            );
    };

    checkValue(obj, '');
    return results;
};
