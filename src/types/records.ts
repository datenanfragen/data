import type { AuthorityRecord } from './AuthorityRecord';
import type { CompanyRecord } from './CompanyRecord';
import type { CompanyPack } from './CompanyPack';
import type { ObsoleteRecord } from './ObsoleteRecord';
import type { Common } from '../common/ts';

type GenericRecord = Common<AuthorityRecord, CompanyRecord>;

export type { AuthorityRecord, CompanyRecord, GenericRecord, CompanyPack, ObsoleteRecord };
