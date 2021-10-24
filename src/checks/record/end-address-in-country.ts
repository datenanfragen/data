import { countries } from 'countries-list';
import cities from 'all-the-cities';
import { Check } from '../../types/checks';

const country_name_variations = ['United States of America', 'The Netherlands', 'Republic of Singapore'];
const variation_country_codes = ['US', 'NL', 'SG'];

const check: Check = {
    id: 'end-address-in-country',
    desc: 'The last line of the address has to be a country.',
    url: 'https://github.com/datenanfragen/data#addresses',
    severity: 'ERROR',
    run: (json) => {
        const address_lines = json['address'].split('\n');

        const isCountry = (str: string) =>
            Object.entries(countries).some(
                ([country_code, c]) =>
                    (!variation_country_codes.includes(country_code) && str == c.name) || str === c.native
            ) || country_name_variations.includes(str);

        const last_line = address_lines[address_lines.length - 1].trim();
        const last_line_is_country = isCountry(last_line);
        if (!last_line_is_country) {
            // TODO: Guess in case of incorrect variations of `variation_country_codes`.
            const country_guesses = (() => {
                // Try to guess the country from the city.
                // TODO: Currently only works if the last line has the following format: `<ZIP> <city>`. Make this work
                // with more formats.
                const city_match = /\S+ (.+)/.exec(last_line);
                if (city_match && city_match[1]) {
                    const city = city_match[1];
                    return [
                        ...new Set(
                            cities
                                .filter((c) => c.name === city)
                                .map((guess) =>
                                    variation_country_codes.includes(guess.country)
                                        ? country_name_variations[variation_country_codes.indexOf(guess.country)]
                                        : [
                                              countries[guess.country as keyof typeof countries].name,
                                              countries[guess.country as keyof typeof countries].native,
                                          ]
                                )
                                .flat()
                        ),
                    ];
                }
                return [];
            })();

            return {
                message: `Last line of \`address\` (\`${last_line}\`) is not a country.

We've decided on specific variations for these countries:
${country_name_variations.map((c) => `* \`${c}\``).join('\n')}`,
                json_pointer: '/address',
                suggestions: country_guesses.map((guess) => `${json['address']}\n${guess}`),
            };
        }
    },
};
export default check;
