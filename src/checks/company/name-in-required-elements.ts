import { CompanyCheck } from '../../types/checks';

const check: CompanyCheck = {
    id: 'name-in-required-elements',
    desc: 'If `required-elements` are specified, one has to be of type `name` (#388).',
    url: 'https://github.com/datenanfragen/data#required-elements',
    severity: 'ERROR',
    run: (json) => {
        if (json['required-elements']) {
            const has_name_field = json['required-elements'].some((el) => el.type === 'name');
            if (!has_name_field)
                return {
                    message: 'Record has required elements but no `name` element.',
                    json_pointer: '/required-elements',
                };
        }
    },
};
export default check;
