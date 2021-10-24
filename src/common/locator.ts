import { JsonSourceMap } from 'json-source-map';

// Returns a function that allows you to determine the position of a JSON pointer, based on the result by the
// `json-source-map` module, which is passed to the factory.
const locatorFactory =
    (pointers: Record<string, JsonSourceMap>) =>
    (
        json_pointer: string,
        type: 'key' | 'value' | 'property' = 'property',
        // The `precision` parameter is only included to remind us that we could also have column-level precision
        // should we ever need that in the future.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        precision: 'line' = 'line'
    ) => {
        const loc = pointers[json_pointer];
        if (!loc) return;
        switch (type) {
            case 'property':
                return 'key' in loc
                    ? { start: { line: loc.key.line + 1 }, end: { line: loc.valueEnd.line + 1 } }
                    : { start: { line: loc.value.line + 1 }, end: { line: loc.valueEnd.line + 1 } };
            case 'key':
                return (
                    ('key' in loc && { start: { line: loc.key.line + 1 }, end: { line: loc.keyEnd.line + 1 } }) ||
                    undefined
                );
            case 'value':
                return { start: { line: loc.value.line + 1 }, end: { line: loc.valueEnd.line + 1 } };
        }
    };

export { locatorFactory };
