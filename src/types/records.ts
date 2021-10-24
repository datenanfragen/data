import { AuthorityRecord } from './AuthorityRecord';
import { CompanyRecord } from './CompanyRecord';
import { Common } from '../common/ts';

type GenericRecord = Common<AuthorityRecord, CompanyRecord>;

export { AuthorityRecord, CompanyRecord, GenericRecord };
