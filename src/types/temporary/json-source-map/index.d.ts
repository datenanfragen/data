// TODO: Submit this to DefinitelyTyped and replace with that once merged.
declare module 'json-source-map' {
    type JsonSourceMapLoc = { line: number; column: number; pos: number };
    type JsonSouceMapKeylessPointer = { value: JsonSourceMapLoc; valueEnd: JsonSourceMapLoc };
    type JsonSouceMapKeyedPointer = JsonSouceMapKeylessPointer & {
        key: JsonSourceMapLoc;
        keyEnd: JsonSourceMapLoc;
    };
    export type JsonSourceMap = JsonSouceMapKeylessPointer | JsonSouceMapKeyedPointer;
    type JsonPointerRecord = Record<string, JsonSourceMap>;

    export function parse(
        source: string,
        _?: unknown,
        options?: { bigint: boolean }
    ): { data: any; pointers: JsonPointerRecord };
    export function stringify(
        data: any,
        _?: unknown,
        options?: number | string | { space: string | number; es6: boolean }
    ): { json: string; pointers: JsonPointerRecord };
}
