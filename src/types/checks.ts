import { MergeExclusive } from 'type-fest';
import { AuthorityRecord, CompanyRecord, GenericRecord, CompanyPack } from '../types/records';

export type Position = { line?: number; column?: number };
type LocationRange = { start: Position; end?: Position };
// If `json_pointer` is set, the `suggestions` will replace the value pointed at by the pointer. If `location` is set,
// they will instead replace the entire `LocationRange` given.
export type CheckInstance = {
    message: string;
} & MergeExclusive<
    { location?: LocationRange; suggestions?: string[] | false },
    { json_pointer: string; suggestions?: unknown[] | false }
>;
export type CheckFunction<T> = (
    json: T,
    ctx: {
        file_path: string;
        file_content: string;
        existingCompanySlugs: string[];
        existingTemplatesPerLanguage: Record<string, string[]>;
    }
) => CheckInstance | (CheckInstance | undefined)[] | void;
export type Check<T = Partial<GenericRecord>> = {
    id: string; // Dash-cased.
    desc: string;
    url: string;
    severity: 'ERROR';
    run: CheckFunction<T>;
};
export type CompanyCheck = Check<Partial<CompanyRecord>>;
export type AuthorityCheck = Check<Partial<AuthorityRecord>>;
export type CompanyPackCheck = Check<Partial<CompanyPack>[]>;

// See: https://github.com/reviewdog/reviewdog/blob/master/proto/rdf/reviewdog.proto
export type RdjsonLine = {
    message: string;
    location: { path: string; range?: LocationRange };
    severity?: 'UNKNOWN_SEVERITY' | 'ERROR' | 'WARNING' | 'INFO';
    source?: { name: string; url?: string };
    code?: { value: string; url?: string };
    suggestions?: { range: LocationRange; text: string }[];
    original_output?: string;
};
