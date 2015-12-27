<?php
namespace App\Lib;

/**
 * Description of CountryHelper
 *
 * @author stephane
 */
class CountryHelper {
    
    public static $mapCode = [ 
	'AF' => 'Afghanistan',
	'AX' => 'Aland Islands',
	'AL' => 'Albania',
	'DZ' => 'Algeria',
	'AS' => 'American Samoa',
	'AD' => 'Andorra',
	'AO' => 'Angola',
	'AI' => 'Anguilla',
	'AQ' => 'Antarctica',
	'AG' => 'Antigua And Barbuda',
	'AR' => 'Argentina',
	'AM' => 'Armenia',
	'AW' => 'Aruba',
	'AU' => 'Australia',
	'AT' => 'Austria',
	'AZ' => 'Azerbaijan',
	'BS' => 'Bahamas',
	'BH' => 'Bahrain',
	'BD' => 'Bangladesh',
	'BB' => 'Barbados',
	'BY' => 'Belarus',
	'BE' => 'Belgium',
	'BZ' => 'Belize',
	'BJ' => 'Benin',
	'BM' => 'Bermuda',
	'BT' => 'Bhutan',
	'BO' => 'Bolivia',
	'BA' => 'Bosnia And Herzegovina',
	'BW' => 'Botswana',
	'BV' => 'Bouvet Island',
	'BR' => 'Brazil',
	'IO' => 'British Indian Ocean Territory',
	'BN' => 'Brunei Darussalam',
	'BG' => 'Bulgaria',
	'BF' => 'Burkina Faso',
	'BI' => 'Burundi',
	'KH' => 'Cambodia',
	'CM' => 'Cameroon',
	'CA' => 'Canada',
	'CV' => 'Cape Verde',
	'KY' => 'Cayman Islands',
	'CF' => 'Central African Republic',
	'TD' => 'Chad',
	'CL' => 'Chile',
	'CN' => 'China',
	'CX' => 'Christmas Island',
	'CC' => 'Cocos (Keeling) Islands',
	'CO' => 'Colombia',
	'KM' => 'Comoros',
	'CG' => 'Congo',
	'CD' => 'Congo, Democratic Republic',
	'CK' => 'Cook Islands',
	'CR' => 'Costa Rica',
	'CI' => 'Cote D\'Ivoire',
	'HR' => 'Croatia',
	'CU' => 'Cuba',
	'CY' => 'Cyprus',
	'CZ' => 'Czech Republic',
	'DK' => 'Denmark',
	'DJ' => 'Djibouti',
	'DM' => 'Dominica',
	'DO' => 'Dominican Republic',
	'EC' => 'Ecuador',
	'EG' => 'Egypt',
	'SV' => 'El Salvador',
	'GQ' => 'Equatorial Guinea',
	'ER' => 'Eritrea',
	'EE' => 'Estonia',
	'ET' => 'Ethiopia',
	'FK' => 'Falkland Islands (Malvinas)',
	'FO' => 'Faroe Islands',
	'FJ' => 'Fiji',
	'FI' => 'Finland',
	'FR' => 'France',
	'GF' => 'French Guiana',
	'PF' => 'French Polynesia',
	'TF' => 'French Southern Territories',
	'GA' => 'Gabon',
	'GM' => 'Gambia',
	'GE' => 'Georgia',
	'DE' => 'Germany',
	'GH' => 'Ghana',
	'GI' => 'Gibraltar',
	'GR' => 'Greece',
	'GL' => 'Greenland',
	'GD' => 'Grenada',
	'GP' => 'Guadeloupe',
	'GU' => 'Guam',
	'GT' => 'Guatemala',
	'GG' => 'Guernsey',
	'GN' => 'Guinea',
	'GW' => 'Guinea-Bissau',
	'GY' => 'Guyana',
	'HT' => 'Haiti',
	'HM' => 'Heard Island & Mcdonald Islands',
	'VA' => 'Holy See (Vatican City State)',
	'HN' => 'Honduras',
	'HK' => 'Hong Kong',
	'HU' => 'Hungary',
	'IS' => 'Iceland',
	'IN' => 'India',
	'ID' => 'Indonesia',
	'IR' => 'Iran, Islamic Republic Of',
	'IQ' => 'Iraq',
	'IE' => 'Ireland',
	'IM' => 'Isle Of Man',
	'IL' => 'Israel',
	'IT' => 'Italy',
	'JM' => 'Jamaica',
	'JP' => 'Japan',
	'JE' => 'Jersey',
	'JO' => 'Jordan',
	'KZ' => 'Kazakhstan',
	'KE' => 'Kenya',
	'KI' => 'Kiribati',
	'KR' => 'Korea',
	'KW' => 'Kuwait',
	'KG' => 'Kyrgyzstan',
	'LA' => 'Lao People\'s Democratic Republic',
	'LV' => 'Latvia',
	'LB' => 'Lebanon',
	'LS' => 'Lesotho',
	'LR' => 'Liberia',
	'LY' => 'Libyan Arab Jamahiriya',
	'LI' => 'Liechtenstein',
	'LT' => 'Lithuania',
	'LU' => 'Luxembourg',
	'MO' => 'Macao',
	'MK' => 'Macedonia',
	'MG' => 'Madagascar',
	'MW' => 'Malawi',
	'MY' => 'Malaysia',
	'MV' => 'Maldives',
	'ML' => 'Mali',
	'MT' => 'Malta',
	'MH' => 'Marshall Islands',
	'MQ' => 'Martinique',
	'MR' => 'Mauritania',
	'MU' => 'Mauritius',
	'YT' => 'Mayotte',
	'MX' => 'Mexico',
	'FM' => 'Micronesia, Federated States Of',
	'MD' => 'Moldova',
	'MC' => 'Monaco',
	'MN' => 'Mongolia',
	'ME' => 'Montenegro',
	'MS' => 'Montserrat',
	'MA' => 'Morocco',
	'MZ' => 'Mozambique',
	'MM' => 'Myanmar',
	'NA' => 'Namibia',
	'NR' => 'Nauru',
	'NP' => 'Nepal',
	'NL' => 'Netherlands',
	'AN' => 'Netherlands Antilles',
	'NC' => 'New Caledonia',
	'NZ' => 'New Zealand',
	'NI' => 'Nicaragua',
	'NE' => 'Niger',
	'NG' => 'Nigeria',
	'NU' => 'Niue',
	'NF' => 'Norfolk Island',
	'MP' => 'Northern Mariana Islands',
	'NO' => 'Norway',
	'OM' => 'Oman',
	'PK' => 'Pakistan',
	'PW' => 'Palau',
	'PS' => 'Palestinian Territory, Occupied',
	'PA' => 'Panama',
	'PG' => 'Papua New Guinea',
	'PY' => 'Paraguay',
	'PE' => 'Peru',
	'PH' => 'Philippines',
	'PN' => 'Pitcairn',
	'PL' => 'Poland',
	'PT' => 'Portugal',
	'PR' => 'Puerto Rico',
	'QA' => 'Qatar',
	'RE' => 'Reunion',
	'RO' => 'Romania',
	'RU' => 'Russian Federation',
	'RW' => 'Rwanda',
	'BL' => 'Saint Barthelemy',
	'SH' => 'Saint Helena',
	'KN' => 'Saint Kitts And Nevis',
	'LC' => 'Saint Lucia',
	'MF' => 'Saint Martin',
	'PM' => 'Saint Pierre And Miquelon',
	'VC' => 'Saint Vincent And Grenadines',
	'WS' => 'Samoa',
	'SM' => 'San Marino',
	'ST' => 'Sao Tome And Principe',
	'SA' => 'Saudi Arabia',
	'SN' => 'Senegal',
	'RS' => 'Serbia',
	'SC' => 'Seychelles',
	'SL' => 'Sierra Leone',
	'SG' => 'Singapore',
	'SK' => 'Slovakia',
	'SI' => 'Slovenia',
	'SB' => 'Solomon Islands',
	'SO' => 'Somalia',
	'ZA' => 'South Africa',
	'GS' => 'South Georgia And Sandwich Isl.',
	'ES' => 'Spain',
	'LK' => 'Sri Lanka',
	'SD' => 'Sudan',
	'SR' => 'Suriname',
	'SJ' => 'Svalbard And Jan Mayen',
	'SZ' => 'Swaziland',
	'SE' => 'Sweden',
	'CH' => 'Switzerland',
	'SY' => 'Syrian Arab Republic',
	'TW' => 'Taiwan',
	'TJ' => 'Tajikistan',
	'TZ' => 'Tanzania',
	'TH' => 'Thailand',
	'TL' => 'Timor-Leste',
	'TG' => 'Togo',
	'TK' => 'Tokelau',
	'TO' => 'Tonga',
	'TT' => 'Trinidad And Tobago',
	'TN' => 'Tunisia',
	'TR' => 'Turkey',
	'TM' => 'Turkmenistan',
	'TC' => 'Turks And Caicos Islands',
	'TV' => 'Tuvalu',
	'UG' => 'Uganda',
	'UA' => 'Ukraine',
	'AE' => 'United Arab Emirates',
	'GB' => 'United Kingdom',
	'US' => 'United States',
	'UM' => 'United States Outlying Islands',
	'UY' => 'Uruguay',
	'UZ' => 'Uzbekistan',
	'VU' => 'Vanuatu',
	'VE' => 'Venezuela',
	'VN' => 'Viet Nam',
	'VG' => 'Virgin Islands, British',
	'VI' => 'Virgin Islands, U.S.',
	'WF' => 'Wallis And Futuna',
	'EH' => 'Western Sahara',
	'YE' => 'Yemen',
	'ZM' => 'Zambia',
	'ZW' => 'Zimbabwe',
    ];

        
    public static $mapPosition = array (
        'AF' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 38.490876700000008,
              'lng' => 74.8898619,
            ),
            'southwest' => 
            array (
              'lat' => 29.377199999999998,
              'lng' => 60.517000500000002,
            ),
          ),
          'location' => 
          array (
            'lat' => 33.939109999999999,
            'lng' => 67.709952999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 38.490876700000008,
              'lng' => 74.8898619,
            ),
            'southwest' => 
            array (
              'lat' => 29.377199999999998,
              'lng' => 60.517000500000002,
            ),
          ),
        ),
        'AX' => false,
        'AL' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.661081899999999,
              'lng' => 21.0572394,
            ),
            'southwest' => 
            array (
              'lat' => 39.644729599999998,
              'lng' => 19.263904100000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 41.153331999999999,
            'lng' => 20.168330999999998,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.661081899999999,
              'lng' => 21.0572394,
            ),
            'southwest' => 
            array (
              'lat' => 39.644729599999998,
              'lng' => 19.263904100000001,
            ),
          ),
        ),
        'DZ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 37.089820500000002,
              'lng' => 11.999999000000001,
            ),
            'southwest' => 
            array (
              'lat' => 18.968146999999998,
              'lng' => -8.667611299999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 28.033885999999999,
            'lng' => 1.659626,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 37.089820500000002,
              'lng' => 11.999999000000001,
            ),
            'southwest' => 
            array (
              'lat' => 18.968146999999998,
              'lng' => -8.667611299999999,
            ),
          ),
        ),
        'AS' => false,
        'AD' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.655791000000001,
              'lng' => 1.7866390000000001,
            ),
            'southwest' => 
            array (
              'lat' => 42.428748800000001,
              'lng' => 1.4087052,
            ),
          ),
          'location' => 
          array (
            'lat' => 42.506284999999998,
            'lng' => 1.521801,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.655791000000001,
              'lng' => 1.7866390000000001,
            ),
            'southwest' => 
            array (
              'lat' => 42.428748800000001,
              'lng' => 1.4087052,
            ),
          ),
        ),
        'AO' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -4.3879438999999998,
              'lng' => 24.087885499999999,
            ),
            'southwest' => 
            array (
              'lat' => -18.039103900000001,
              'lng' => 11.669562000000001,
            ),
          ),
          'location' => 
          array (
            'lat' => -11.202692000000001,
            'lng' => 17.873887,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -4.3879438999999998,
              'lng' => 24.087885499999999,
            ),
            'southwest' => 
            array (
              'lat' => -18.039103900000001,
              'lng' => 11.669562000000001,
            ),
          ),
        ),
        'AI' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 18.595088000000001,
              'lng' => -62.922434799999991,
            ),
            'southwest' => 
            array (
              'lat' => 18.1499463,
              'lng' => -63.428982100000013,
            ),
          ),
          'location' => 
          array (
            'lat' => 18.220554,
            'lng' => -63.068614999999987,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 18.296594899999999,
              'lng' => -62.922434799999991,
            ),
            'southwest' => 
            array (
              'lat' => 18.1499463,
              'lng' => -63.190832399999998,
            ),
          ),
        ),
        'AQ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -60.000000099999987,
              'lng' => 180,
            ),
            'southwest' => 
            array (
              'lat' => -90,
              'lng' => -180,
            ),
          ),
          'location' => 
          array (
            'lat' => -82.862751899999992,
            'lng' => 135,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -60.000000099999987,
              'lng' => 180,
            ),
            'southwest' => 
            array (
              'lat' => -90,
              'lng' => -180,
            ),
          ),
        ),
        'AG' => false,
        'AR' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -21.781045899999999,
              'lng' => -53.637481000000001,
            ),
            'southwest' => 
            array (
              'lat' => -55.057278999999987,
              'lng' => -73.560360099999997,
            ),
          ),
          'location' => 
          array (
            'lat' => -38.416097000000001,
            'lng' => -63.616671999999987,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -21.781045899999999,
              'lng' => -53.637481000000001,
            ),
            'southwest' => 
            array (
              'lat' => -55.057278999999987,
              'lng' => -73.560360099999997,
            ),
          ),
        ),
        'AM' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 41.300992999999998,
              'lng' => 46.634222000000001,
            ),
            'southwest' => 
            array (
              'lat' => 38.840243999999998,
              'lng' => 43.447260100000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 40.069099000000001,
            'lng' => 45.038189000000003,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 41.300992999999998,
              'lng' => 46.634222000000001,
            ),
            'southwest' => 
            array (
              'lat' => 38.840243999999998,
              'lng' => 43.447260100000001,
            ),
          ),
        ),
        'AW' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.6233629,
              'lng' => -69.86587999999999,
            ),
            'southwest' => 
            array (
              'lat' => 12.411765600000001,
              'lng' => -70.064012399999996,
            ),
          ),
          'location' => 
          array (
            'lat' => 12.52111,
            'lng' => -69.968338000000003,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.6233629,
              'lng' => -69.86587999999999,
            ),
            'southwest' => 
            array (
              'lat' => 12.411765600000001,
              'lng' => -70.064012399999996,
            ),
          ),
        ),
        'AU' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -9.2198215000000001,
              'lng' => 159.25552540000001,
            ),
            'southwest' => 
            array (
              'lat' => -54.777218499999996,
              'lng' => 112.9214544,
            ),
          ),
          'location' => 
          array (
            'lat' => -25.274398000000001,
            'lng' => 133.775136,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -9.3157420000000002,
              'lng' => 162.823061,
            ),
            'southwest' => 
            array (
              'lat' => -46.526369000000003,
              'lng' => 103.67267099999999,
            ),
          ),
        ),
        'AT' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 49.020608099999997,
              'lng' => 17.160686099999999,
            ),
            'southwest' => 
            array (
              'lat' => 46.372335799999988,
              'lng' => 9.5307833999999989,
            ),
          ),
          'location' => 
          array (
            'lat' => 47.516230999999998,
            'lng' => 14.550072,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 49.020608099999997,
              'lng' => 17.160686099999999,
            ),
            'southwest' => 
            array (
              'lat' => 46.372335799999988,
              'lng' => 9.5307833999999989,
            ),
          ),
        ),
        'AZ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 41.912340200000003,
              'lng' => 50.467866099999988,
            ),
            'southwest' => 
            array (
              'lat' => 38.392217100000003,
              'lng' => 44.763259900000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 40.143104999999998,
            'lng' => 47.576926999999998,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 41.912340200000003,
              'lng' => 50.467866099999988,
            ),
            'southwest' => 
            array (
              'lat' => 38.392217100000003,
              'lng' => 44.763259900000001,
            ),
          ),
        ),
        'BS' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 27.263362000000001,
              'lng' => -72.712068599999995,
            ),
            'southwest' => 
            array (
              'lat' => 20.9121311,
              'lng' => -80.474946500000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 25.034279999999999,
            'lng' => -77.39627999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 27.263362000000001,
              'lng' => -72.712068599999995,
            ),
            'southwest' => 
            array (
              'lat' => 20.9121311,
              'lng' => -80.474946500000001,
            ),
          ),
        ),
        'BH' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 26.3303935,
              'lng' => 50.824846099999988,
            ),
            'southwest' => 
            array (
              'lat' => 25.556457699999999,
              'lng' => 50.378150899999987,
            ),
          ),
          'location' => 
          array (
            'lat' => 26.066700000000001,
            'lng' => 50.557699999999997,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 26.3303935,
              'lng' => 50.824846099999988,
            ),
            'southwest' => 
            array (
              'lat' => 25.556457699999999,
              'lng' => 50.378150899999987,
            ),
          ),
        ),
        'BD' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 26.634243399999999,
              'lng' => 92.680115299999997,
            ),
            'southwest' => 
            array (
              'lat' => 20.746410699999998,
              'lng' => 88.00858869999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 23.684994,
            'lng' => 90.356330999999997,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 26.634243399999999,
              'lng' => 92.680115299999997,
            ),
            'southwest' => 
            array (
              'lat' => 20.746410699999998,
              'lng' => 88.00858869999999,
            ),
          ),
        ),
        'BB' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 13.3352656,
              'lng' => -59.420097499999997,
            ),
            'southwest' => 
            array (
              'lat' => 13.044999499999999,
              'lng' => -59.651030300000002,
            ),
          ),
          'location' => 
          array (
            'lat' => 13.193887,
            'lng' => -59.543197999999997,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 13.3352656,
              'lng' => -59.420097499999997,
            ),
            'southwest' => 
            array (
              'lat' => 13.044999499999999,
              'lng' => -59.651030300000002,
            ),
          ),
        ),
        'BY' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 56.171871899999999,
              'lng' => 32.776820200000003,
            ),
            'southwest' => 
            array (
              'lat' => 51.262011000000008,
              'lng' => 23.1783377,
            ),
          ),
          'location' => 
          array (
            'lat' => 53.709806999999998,
            'lng' => 27.953389000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 56.171871899999999,
              'lng' => 32.776820200000003,
            ),
            'southwest' => 
            array (
              'lat' => 51.262011000000008,
              'lng' => 23.1783377,
            ),
          ),
        ),
        'BE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 51.505144899999998,
              'lng' => 6.4081240999999993,
            ),
            'southwest' => 
            array (
              'lat' => 49.497013000000003,
              'lng' => 2.5447948,
            ),
          ),
          'location' => 
          array (
            'lat' => 50.503886999999999,
            'lng' => 4.4699359999999997,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 51.505144899999998,
              'lng' => 6.4081240999999993,
            ),
            'southwest' => 
            array (
              'lat' => 49.497013000000003,
              'lng' => 2.5447948,
            ),
          ),
        ),
        'BZ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 18.495941899999998,
              'lng' => -87.491726899999989,
            ),
            'southwest' => 
            array (
              'lat' => 15.885618900000001,
              'lng' => -89.227587899999989,
            ),
          ),
          'location' => 
          array (
            'lat' => 17.189876999999999,
            'lng' => -88.497649999999993,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 18.495941899999998,
              'lng' => -87.491726899999989,
            ),
            'southwest' => 
            array (
              'lat' => 15.885618900000001,
              'lng' => -89.227587899999989,
            ),
          ),
        ),
        'BJ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.4086111,
              'lng' => 3.8433429000000001,
            ),
            'southwest' => 
            array (
              'lat' => 6.2345965999999997,
              'lng' => 0.77650549999999996,
            ),
          ),
          'location' => 
          array (
            'lat' => 9.3076899999999991,
            'lng' => 2.3158340000000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.4086111,
              'lng' => 3.8433429000000001,
            ),
            'southwest' => 
            array (
              'lat' => 6.2345965999999997,
              'lng' => 0.77650549999999996,
            ),
          ),
        ),
        'BM' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 32.391306800000002,
              'lng' => -64.647377399999996,
            ),
            'southwest' => 
            array (
              'lat' => 32.247050000000002,
              'lng' => -64.886787999999996,
            ),
          ),
          'location' => 
          array (
            'lat' => 32.3078,
            'lng' => -64.750500000000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 32.391306800000002,
              'lng' => -64.647377399999996,
            ),
            'southwest' => 
            array (
              'lat' => 32.247050000000002,
              'lng' => -64.886787999999996,
            ),
          ),
        ),
        'BT' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 28.360824999999998,
              'lng' => 92.125232099999991,
            ),
            'southwest' => 
            array (
              'lat' => 26.702016,
              'lng' => 88.746473500000008,
            ),
          ),
          'location' => 
          array (
            'lat' => 27.514161999999999,
            'lng' => 90.433600999999996,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 28.360824999999998,
              'lng' => 92.125232099999991,
            ),
            'southwest' => 
            array (
              'lat' => 26.702016,
              'lng' => 88.746473500000008,
            ),
          ),
        ),
        'BO' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -9.6693230000000003,
              'lng' => -57.453803000000001,
            ),
            'southwest' => 
            array (
              'lat' => -22.898089899999999,
              'lng' => -69.644989999999993,
            ),
          ),
          'location' => 
          array (
            'lat' => -16.290154000000001,
            'lng' => -63.588652999999987,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -9.6693230000000003,
              'lng' => -57.453803000000001,
            ),
            'southwest' => 
            array (
              'lat' => -22.898089899999999,
              'lng' => -69.644989999999993,
            ),
          ),
        ),
        'BA' => false,
        'BW' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -17.778137000000001,
              'lng' => 29.375304,
            ),
            'southwest' => 
            array (
              'lat' => -26.907544999999999,
              'lng' => 19.998902999999999,
            ),
          ),
          'location' => 
          array (
            'lat' => -22.328474,
            'lng' => 24.684866,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -17.778137000000001,
              'lng' => 29.375304,
            ),
            'southwest' => 
            array (
              'lat' => -26.907544999999999,
              'lng' => 19.998902999999999,
            ),
          ),
        ),
        'BV' => false,
        'BR' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 5.2717862999999996,
              'lng' => -29.3450235,
            ),
            'southwest' => 
            array (
              'lat' => -33.750381599999997,
              'lng' => -73.982816999999997,
            ),
          ),
          'location' => 
          array (
            'lat' => -14.235004,
            'lng' => -51.925280000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 5.2717862999999996,
              'lng' => -32.378186399999997,
            ),
            'southwest' => 
            array (
              'lat' => -33.750381599999997,
              'lng' => -73.982816999999997,
            ),
          ),
        ),
        'IO' => false,
        'BN' => false,
        'BG' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 44.215233300000001,
              'lng' => 28.609263200000001,
            ),
            'southwest' => 
            array (
              'lat' => 41.235446899999999,
              'lng' => 22.357344600000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 42.733882999999999,
            'lng' => 25.48583,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 44.215233300000001,
              'lng' => 28.609263200000001,
            ),
            'southwest' => 
            array (
              'lat' => 41.235446899999999,
              'lng' => 22.357344600000001,
            ),
          ),
        ),
        'BF' => false,
        'BI' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -2.3097302000000002,
              'lng' => 30.849544699999999,
            ),
            'southwest' => 
            array (
              'lat' => -4.4693288000000004,
              'lng' => 29.000993000000001,
            ),
          ),
          'location' => 
          array (
            'lat' => -3.3730560000000001,
            'lng' => 29.918886000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -2.3097302000000002,
              'lng' => 30.849544699999999,
            ),
            'southwest' => 
            array (
              'lat' => -4.4693288000000004,
              'lng' => 29.000993000000001,
            ),
          ),
        ),
        'KH' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 14.6901791,
              'lng' => 107.62768699999999,
            ),
            'southwest' => 
            array (
              'lat' => 9.2857541000000001,
              'lng' => 102.33354199999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 12.565678999999999,
            'lng' => 104.99096299999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 14.6901791,
              'lng' => 107.62768699999999,
            ),
            'southwest' => 
            array (
              'lat' => 9.2857541000000001,
              'lng' => 102.33354199999999,
            ),
          ),
        ),
        'CM' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 13.083335,
              'lng' => 16.1944081,
            ),
            'southwest' => 
            array (
              'lat' => 1.6558999999999999,
              'lng' => 8.4947634000000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 7.3697219999999994,
            'lng' => 12.354722000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 13.0834037,
              'lng' => 16.1944081,
            ),
            'southwest' => 
            array (
              'lat' => 1.6558999999999999,
              'lng' => 8.4947634000000001,
            ),
          ),
        ),
        'CA' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 83.095656199999993,
              'lng' => -52.620696500000001,
            ),
            'southwest' => 
            array (
              'lat' => 41.676555899999997,
              'lng' => -141.00187,
            ),
          ),
          'location' => 
          array (
            'lat' => 56.130366000000002,
            'lng' => -106.346771,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 70,
              'lng' => -50,
            ),
            'southwest' => 
            array (
              'lat' => 42,
              'lng' => -142,
            ),
          ),
        ),
        'CV' => false,
        'KY' => false,
        'CF' => false,
        'TD' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 23.449228000000002,
              'lng' => 24.000001099999999,
            ),
            'southwest' => 
            array (
              'lat' => 7.4429749999999997,
              'lng' => 13.469999899999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 15.454166000000001,
            'lng' => 18.732206999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 23.449228000000002,
              'lng' => 24.000001099999999,
            ),
            'southwest' => 
            array (
              'lat' => 7.4429749999999997,
              'lng' => 13.469999899999999,
            ),
          ),
        ),
        'CL' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -17.498329300000002,
              'lng' => -66.416964300000004,
            ),
            'southwest' => 
            array (
              'lat' => -55.9805353,
              'lng' => -109.4548805,
            ),
          ),
          'location' => 
          array (
            'lat' => -35.675147000000003,
            'lng' => -71.542968999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -17.498329300000002,
              'lng' => -66.416964300000004,
            ),
            'southwest' => 
            array (
              'lat' => -55.9805353,
              'lng' => -75.696197200000015,
            ),
          ),
        ),
        'CN' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 53.560973999999987,
              'lng' => 134.7728099,
            ),
            'southwest' => 
            array (
              'lat' => 18.157615700000001,
              'lng' => 73.499413599999997,
            ),
          ),
          'location' => 
          array (
            'lat' => 35.861660000000001,
            'lng' => 104.195397,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 53.560973999999987,
              'lng' => 134.7728099,
            ),
            'southwest' => 
            array (
              'lat' => 18.157615700000001,
              'lng' => 73.499413599999997,
            ),
          ),
        ),
        'CX' => false,
        'CC' => false,
        'CO' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 13.394483299999999,
              'lng' => -66.851922999999999,
            ),
            'southwest' => 
            array (
              'lat' => -4.2271099999999997,
              'lng' => -81.73574889999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 4.5708679999999999,
            'lng' => -74.297332999999995,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.4584303,
              'lng' => -66.851922999999999,
            ),
            'southwest' => 
            array (
              'lat' => -4.2271099999999997,
              'lng' => -79.055847,
            ),
          ),
        ),
        'KM' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -11.3646394,
              'lng' => 44.5405698,
            ),
            'southwest' => 
            array (
              'lat' => -12.413821199999999,
              'lng' => 43.219421399999987,
            ),
          ),
          'location' => 
          array (
            'lat' => -11.6455,
            'lng' => 43.333300000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -11.3646394,
              'lng' => 43.525772099999998,
            ),
            'southwest' => 
            array (
              'lat' => -11.9393224,
              'lng' => 43.219421399999987,
            ),
          ),
        ),
        'CG' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 3.7077909999999998,
              'lng' => 18.643611,
            ),
            'southwest' => 
            array (
              'lat' => -5.0289717999999999,
              'lng' => 11.153003699999999,
            ),
          ),
          'location' => 
          array (
            'lat' => -0.228021,
            'lng' => 15.827659000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 3.7077909999999998,
              'lng' => 18.643611,
            ),
            'southwest' => 
            array (
              'lat' => -5.0289717999999999,
              'lng' => 11.153003699999999,
            ),
          ),
        ),
        'CD' => false,
        'CK' => false,
        'CR' => false,
        'CI' => false,
        'HR' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 46.555223400000003,
              'lng' => 19.448052300000001,
            ),
            'southwest' => 
            array (
              'lat' => 42.392240200000003,
              'lng' => 13.489691199999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 45.100000000000001,
            'lng' => 15.199999999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 46.555223400000003,
              'lng' => 19.448052300000001,
            ),
            'southwest' => 
            array (
              'lat' => 42.392445100000003,
              'lng' => 13.489691199999999,
            ),
          ),
        ),
        'CU' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 23.2767521,
              'lng' => -74.13222309999999,
            ),
            'southwest' => 
            array (
              'lat' => 19.825899400000001,
              'lng' => -84.951888699999998,
            ),
          ),
          'location' => 
          array (
            'lat' => 21.521757000000001,
            'lng' => -77.781166999999996,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 23.2767521,
              'lng' => -74.13222309999999,
            ),
            'southwest' => 
            array (
              'lat' => 19.825899400000001,
              'lng' => -84.951888699999998,
            ),
          ),
        ),
        'CY' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 35.7071963,
              'lng' => 34.604482500000003,
            ),
            'southwest' => 
            array (
              'lat' => 34.632303,
              'lng' => 32.269481599999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 35.126412999999999,
            'lng' => 33.429859,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 35.7071963,
              'lng' => 34.604482500000003,
            ),
            'southwest' => 
            array (
              'lat' => 34.632303,
              'lng' => 32.269481599999999,
            ),
          ),
        ),
        'CZ' => false,
        'DK' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 57.7518131,
              'lng' => 15.1972813,
            ),
            'southwest' => 
            array (
              'lat' => 54.559121099999999,
              'lng' => 8.0722408999999988,
            ),
          ),
          'location' => 
          array (
            'lat' => 56.263919999999999,
            'lng' => 9.5017849999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 57.7518131,
              'lng' => 12.793939,
            ),
            'southwest' => 
            array (
              'lat' => 54.559121099999999,
              'lng' => 8.0722408999999988,
            ),
          ),
        ),
        'DJ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.7133962,
              'lng' => 43.4169731,
            ),
            'southwest' => 
            array (
              'lat' => 10.9319439,
              'lng' => 41.759721999999996,
            ),
          ),
          'location' => 
          array (
            'lat' => 11.825138000000001,
            'lng' => 42.590274999999998,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.7133962,
              'lng' => 43.4169731,
            ),
            'southwest' => 
            array (
              'lat' => 10.9319439,
              'lng' => 41.759721999999996,
            ),
          ),
        ),
        'DM' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 15.640063899999999,
              'lng' => -61.240303500000003,
            ),
            'southwest' => 
            array (
              'lat' => 15.207682,
              'lng' => -61.479830099999987,
            ),
          ),
          'location' => 
          array (
            'lat' => 15.414999,
            'lng' => -61.370976000000013,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 15.640063899999999,
              'lng' => -61.240303500000003,
            ),
            'southwest' => 
            array (
              'lat' => 15.207682,
              'lng' => -61.479830099999987,
            ),
          ),
        ),
        'DO' => false,
        'EC' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 1.6815561000000001,
              'lng' => -75.188794000000001,
            ),
            'southwest' => 
            array (
              'lat' => -5.0143510999999998,
              'lng' => -92.008459500000001,
            ),
          ),
          'location' => 
          array (
            'lat' => -1.8312390000000001,
            'lng' => -78.183405999999991,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 1.4414233999999999,
              'lng' => -75.188794000000001,
            ),
            'southwest' => 
            array (
              'lat' => -5.0143510999999998,
              'lng' => -81.084980899999991,
            ),
          ),
        ),
        'EG' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 31.671534699999999,
              'lng' => 36.894544600000003,
            ),
            'southwest' => 
            array (
              'lat' => 21.999999899999999,
              'lng' => 24.696774999999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 26.820553,
            'lng' => 30.802498,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 31.671534699999999,
              'lng' => 36.894544600000003,
            ),
            'southwest' => 
            array (
              'lat' => 21.999999899999999,
              'lng' => 24.696774999999999,
            ),
          ),
        ),
        'SV' => false,
        'GQ' => false,
        'ER' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 18.020413699999999,
              'lng' => 43.142977299999998,
            ),
            'southwest' => 
            array (
              'lat' => 12.354723,
              'lng' => 36.433348000000002,
            ),
          ),
          'location' => 
          array (
            'lat' => 15.179384000000001,
            'lng' => 39.782333999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 18.020413699999999,
              'lng' => 43.142977299999998,
            ),
            'southwest' => 
            array (
              'lat' => 12.354723,
              'lng' => 36.433348000000002,
            ),
          ),
        ),
        'EE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 59.685684999999999,
              'lng' => 28.2101389,
            ),
            'southwest' => 
            array (
              'lat' => 57.509316000000013,
              'lng' => 21.7643132,
            ),
          ),
          'location' => 
          array (
            'lat' => 58.595272000000001,
            'lng' => 25.013607,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 59.685659000000001,
              'lng' => 28.2101389,
            ),
            'southwest' => 
            array (
              'lat' => 57.509316000000013,
              'lng' => 21.764372099999999,
            ),
          ),
        ),
        'ET' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 14.894214099999999,
              'lng' => 48.0010561,
            ),
            'southwest' => 
            array (
              'lat' => 3.4041369000000001,
              'lng' => 32.997734000000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 9.1450000000000014,
            'lng' => 40.489673000000003,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 14.894214099999999,
              'lng' => 48.0010561,
            ),
            'southwest' => 
            array (
              'lat' => 3.4041369000000001,
              'lng' => 32.997734000000001,
            ),
          ),
        ),
        'FK' => false,
        'FO' => false,
        'FJ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -12.4798335,
              'lng' => -178.23010679999999,
            ),
            'southwest' => 
            array (
              'lat' => -20.669430200000001,
              'lng' => 176.9094944,
            ),
          ),
          'location' => 
          array (
            'lat' => -17.713370999999999,
            'lng' => 178.065032,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -15.7088269,
              'lng' => -178.3928847,
            ),
            'southwest' => 
            array (
              'lat' => -19.216151700000001,
              'lng' => 176.9094944,
            ),
          ),
        ),
        'FI' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 70.0922932,
              'lng' => 31.587099899999998,
            ),
            'southwest' => 
            array (
              'lat' => 59.705440400000001,
              'lng' => 20.547410800000002,
            ),
          ),
          'location' => 
          array (
            'lat' => 61.924109999999992,
            'lng' => 25.748151,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 70.0922932,
              'lng' => 31.587099899999998,
            ),
            'southwest' => 
            array (
              'lat' => 59.737038600000012,
              'lng' => 20.547410800000002,
            ),
          ),
        ),
        'FR' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 51.089165800000004,
              'lng' => 9.5600677999999988,
            ),
            'southwest' => 
            array (
              'lat' => 41.342327599999997,
              'lng' => -5.1423075999999996,
            ),
          ),
          'location' => 
          array (
            'lat' => 46.227637999999999,
            'lng' => 2.213749,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 51.089165800000004,
              'lng' => 9.5597934000000002,
            ),
            'southwest' => 
            array (
              'lat' => 41.342327599999997,
              'lng' => -5.1421418999999986,
            ),
          ),
        ),
        'GF' => false,
        'PF' => false,
        'TF' => false,
        'GA' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 2.3181090000000002,
              'lng' => 14.526923399999999,
            ),
            'southwest' => 
            array (
              'lat' => -3.9608056999999999,
              'lng' => 8.6990528000000005,
            ),
          ),
          'location' => 
          array (
            'lat' => -0.80368899999999999,
            'lng' => 11.609444,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 2.3181090000000002,
              'lng' => 14.526923399999999,
            ),
            'southwest' => 
            array (
              'lat' => -3.9608056999999999,
              'lng' => 8.6990528000000005,
            ),
          ),
        ),
        'GM' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 13.824949699999999,
              'lng' => -13.792872600000001,
            ),
            'southwest' => 
            array (
              'lat' => 13.0379673,
              'lng' => -16.8136312,
            ),
          ),
          'location' => 
          array (
            'lat' => 13.443182,
            'lng' => -15.310138999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 13.824949699999999,
              'lng' => -13.792872600000001,
            ),
            'southwest' => 
            array (
              'lat' => 13.0379673,
              'lng' => -16.8136312,
            ),
          ),
        ),
        'GE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 35.000658899999998,
              'lng' => -80.840786600000001,
            ),
            'southwest' => 
            array (
              'lat' => 30.355590800000002,
              'lng' => -85.605164900000005,
            ),
          ),
          'location' => 
          array (
            'lat' => 32.1656221,
            'lng' => -82.900075099999995,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 35.000658899999998,
              'lng' => -80.840786600000001,
            ),
            'southwest' => 
            array (
              'lat' => 30.355590800000002,
              'lng' => -85.605164900000005,
            ),
          ),
        ),
        'DE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 55.0738232,
              'lng' => 15.0418962,
            ),
            'southwest' => 
            array (
              'lat' => 47.270111499999999,
              'lng' => 5.8663425,
            ),
          ),
          'location' => 
          array (
            'lat' => 51.165691000000002,
            'lng' => 10.451525999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 55.0738232,
              'lng' => 15.0418962,
            ),
            'southwest' => 
            array (
              'lat' => 47.270111499999999,
              'lng' => 5.8663425,
            ),
          ),
        ),
        'GH' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 11.175031000000001,
              'lng' => 1.1994743000000001,
            ),
            'southwest' => 
            array (
              'lat' => 4.7388737000000001,
              'lng' => -3.260786,
            ),
          ),
          'location' => 
          array (
            'lat' => 7.9465269999999997,
            'lng' => -1.0231939999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 11.175031000000001,
              'lng' => 1.1994743000000001,
            ),
            'southwest' => 
            array (
              'lat' => 4.7388737000000001,
              'lng' => -3.260786,
            ),
          ),
        ),
        'GI' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 36.155118799999997,
              'lng' => -5.3384193999999994,
            ),
            'southwest' => 
            array (
              'lat' => 36.108834799999997,
              'lng' => -5.3674153999999996,
            ),
          ),
          'location' => 
          array (
            'lat' => 36.140751000000002,
            'lng' => -5.3535849999999998,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 36.155118799999997,
              'lng' => -5.3384193999999994,
            ),
            'southwest' => 
            array (
              'lat' => 36.108834799999997,
              'lng' => -5.3674153999999996,
            ),
          ),
        ),
        'GR' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 41.748878400000002,
              'lng' => 29.645147600000001,
            ),
            'southwest' => 
            array (
              'lat' => 34.800916899999997,
              'lng' => 19.372422700000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 39.074207999999999,
            'lng' => 21.824311999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 41.748878400000002,
              'lng' => 28.2469559,
            ),
            'southwest' => 
            array (
              'lat' => 34.800916899999997,
              'lng' => 19.373587400000002,
            ),
          ),
        ),
        'GL' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 83.609580999999991,
              'lng' => -11.3123191,
            ),
            'southwest' => 
            array (
              'lat' => 59.777400999999998,
              'lng' => -73.035063800000003,
            ),
          ),
          'location' => 
          array (
            'lat' => 71.706935999999999,
            'lng' => -42.604303000000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 83.609580999999991,
              'lng' => -11.3123191,
            ),
            'southwest' => 
            array (
              'lat' => 59.777400999999998,
              'lng' => -73.035063800000003,
            ),
          ),
        ),
        'GD' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.5301829,
              'lng' => -61.377997399999998,
            ),
            'southwest' => 
            array (
              'lat' => 11.9848781,
              'lng' => -61.802312800000003,
            ),
          ),
          'location' => 
          array (
            'lat' => 12.1165,
            'lng' => -61.678999999999988,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.2350589,
              'lng' => -61.584720599999997,
            ),
            'southwest' => 
            array (
              'lat' => 11.9848781,
              'lng' => -61.802312800000003,
            ),
          ),
        ),
        'GP' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 16.514251000000002,
              'lng' => -61.0016727,
            ),
            'southwest' => 
            array (
              'lat' => 15.8319387,
              'lng' => -61.809853599999997,
            ),
          ),
          'location' => 
          array (
            'lat' => 16.265000000000001,
            'lng' => -61.550999999999988,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 16.514251000000002,
              'lng' => -61.0016727,
            ),
            'southwest' => 
            array (
              'lat' => 15.8319387,
              'lng' => -61.809853599999997,
            ),
          ),
        ),
        'GU' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 13.6542247,
              'lng' => 144.95653609999999,
            ),
            'southwest' => 
            array (
              'lat' => 13.243063899999999,
              'lng' => 144.61838059999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 13.444304000000001,
            'lng' => 144.79373100000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 13.6542247,
              'lng' => 144.95653609999999,
            ),
            'southwest' => 
            array (
              'lat' => 13.243063899999999,
              'lng' => 144.61838059999999,
            ),
          ),
        ),
        'GT' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 17.815697199999999,
              'lng' => -88.230724899999998,
            ),
            'southwest' => 
            array (
              'lat' => 13.7400214,
              'lng' => -92.234203799999989,
            ),
          ),
          'location' => 
          array (
            'lat' => 15.783471,
            'lng' => -90.230758999999992,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 17.815711400000001,
              'lng' => -88.230724899999998,
            ),
            'southwest' => 
            array (
              'lat' => 13.7400214,
              'lng' => -92.234203799999989,
            ),
          ),
        ),
        'GG' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 49.732782499999999,
              'lng' => -2.1584973000000001,
            ),
            'southwest' => 
            array (
              'lat' => 49.4002032,
              'lng' => -2.6745361000000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 49.465691,
            'lng' => -2.5852780000000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 49.509410799999998,
              'lng' => -2.5016885000000002,
            ),
            'southwest' => 
            array (
              'lat' => 49.416719899999997,
              'lng' => -2.6745361000000001,
            ),
          ),
        ),
        'GN' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.674615899999999,
              'lng' => -7.6378529999999998,
            ),
            'southwest' => 
            array (
              'lat' => 7.1909090999999989,
              'lng' => -15.078206099999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 9.9455869999999997,
            'lng' => -9.6966450000000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.674615899999999,
              'lng' => -7.6378529999999998,
            ),
            'southwest' => 
            array (
              'lat' => 7.1909090999999989,
              'lng' => -15.078206099999999,
            ),
          ),
        ),
        'GW' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.686946799999999,
              'lng' => -13.626523499999999,
            ),
            'southwest' => 
            array (
              'lat' => 10.8599701,
              'lng' => -16.715133900000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 11.803749,
            'lng' => -15.180413,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.686946799999999,
              'lng' => -13.626523499999999,
            ),
            'southwest' => 
            array (
              'lat' => 10.8599701,
              'lng' => -16.715133900000001,
            ),
          ),
        ),
        'GY' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 8.546627599999999,
              'lng' => -56.491120000000002,
            ),
            'southwest' => 
            array (
              'lat' => 1.1647240000000001,
              'lng' => -61.414904999999997,
            ),
          ),
          'location' => 
          array (
            'lat' => 4.8604159999999998,
            'lng' => -58.93018,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 8.546627599999999,
              'lng' => -56.491120000000002,
            ),
            'southwest' => 
            array (
              'lat' => 1.1647240000000001,
              'lng' => -61.414904999999997,
            ),
          ),
        ),
        'HT' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 20.089566000000001,
              'lng' => -71.621753999999996,
            ),
            'southwest' => 
            array (
              'lat' => 18.020527699999999,
              'lng' => -74.480910299999991,
            ),
          ),
          'location' => 
          array (
            'lat' => 18.971187,
            'lng' => -72.285214999999994,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 20.0895318,
              'lng' => -71.621753999999996,
            ),
            'southwest' => 
            array (
              'lat' => 18.021887499999998,
              'lng' => -74.480910299999991,
            ),
          ),
        ),
        'HM' => false,
        'VA' => false,
        'HN' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 17.417103699999998,
              'lng' => -83.127534099999991,
            ),
            'southwest' => 
            array (
              'lat' => 12.984224599999999,
              'lng' => -89.356482200000002,
            ),
          ),
          'location' => 
          array (
            'lat' => 15.199999,
            'lng' => -86.241905000000003,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 16.516872599999999,
              'lng' => -83.127534099999991,
            ),
            'southwest' => 
            array (
              'lat' => 12.984224599999999,
              'lng' => -89.356482200000002,
            ),
          ),
        ),
        'HK' => false,
        'HU' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 48.585234,
              'lng' => 22.898121700000001,
            ),
            'southwest' => 
            array (
              'lat' => 45.737088900000003,
              'lng' => 16.113386599999998,
            ),
          ),
          'location' => 
          array (
            'lat' => 47.162494000000002,
            'lng' => 19.503304,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 48.585234,
              'lng' => 22.898121700000001,
            ),
            'southwest' => 
            array (
              'lat' => 45.737088900000003,
              'lng' => 16.113386599999998,
            ),
          ),
        ),
        'IS' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 66.566318299999992,
              'lng' => -13.4958154,
            ),
            'southwest' => 
            array (
              'lat' => 63.296234199999986,
              'lng' => -24.546524000000002,
            ),
          ),
          'location' => 
          array (
            'lat' => 64.963050999999993,
            'lng' => -19.020835000000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 66.566318299999992,
              'lng' => -13.4958154,
            ),
            'southwest' => 
            array (
              'lat' => 63.296234199999986,
              'lng' => -24.546524000000002,
            ),
          ),
        ),
        'IN' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 35.5087008,
              'lng' => 97.395561000000001,
            ),
            'southwest' => 
            array (
              'lat' => 6.7535159,
              'lng' => 68.162385900000004,
            ),
          ),
          'location' => 
          array (
            'lat' => 20.593684,
            'lng' => 78.962879999999998,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 35.5087008,
              'lng' => 97.395561000000001,
            ),
            'southwest' => 
            array (
              'lat' => 6.7535159,
              'lng' => 68.162885199999991,
            ),
          ),
        ),
        'ID' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 6.0769120000000001,
              'lng' => 141.0195621,
            ),
            'southwest' => 
            array (
              'lat' => -11.0074361,
              'lng' => 95.009706999999992,
            ),
          ),
          'location' => 
          array (
            'lat' => -0.78927499999999995,
            'lng' => 113.92132700000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 5.9068209999999999,
              'lng' => 141.01866200000001,
            ),
            'southwest' => 
            array (
              'lat' => -11.004673,
              'lng' => 95.011064899999994,
            ),
          ),
        ),
        'IR' => false,
        'IQ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 37.380645000000001,
              'lng' => 48.575916300000003,
            ),
            'southwest' => 
            array (
              'lat' => 29.061207899999999,
              'lng' => 38.793602900000003,
            ),
          ),
          'location' => 
          array (
            'lat' => 33.223191,
            'lng' => 43.679290999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 37.380645000000001,
              'lng' => 48.575916300000003,
            ),
            'southwest' => 
            array (
              'lat' => 29.061207899999999,
              'lng' => 38.793602900000003,
            ),
          ),
        ),
        'IE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 55.435134499999997,
              'lng' => -5.9947000999999993,
            ),
            'southwest' => 
            array (
              'lat' => 51.421937700000001,
              'lng' => -10.66958,
            ),
          ),
          'location' => 
          array (
            'lat' => 53.412909999999997,
            'lng' => -8.2438900000000004,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 55.435134499999997,
              'lng' => -5.9947100000000004,
            ),
            'southwest' => 
            array (
              'lat' => 51.422195500000001,
              'lng' => -10.662710000000001,
            ),
          ),
        ),
        'IM' => false,
        'IL' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 33.332805000000008,
              'lng' => 35.896244000000003,
            ),
            'southwest' => 
            array (
              'lat' => 29.490646300000002,
              'lng' => 34.267387100000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 31.046050999999999,
            'lng' => 34.851612000000003,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 33.332805000000008,
              'lng' => 35.896244000000003,
            ),
            'southwest' => 
            array (
              'lat' => 29.490646300000002,
              'lng' => 34.267387100000001,
            ),
          ),
        ),
        'IT' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 47.091999999999999,
              'lng' => 18.520501500000002,
            ),
            'southwest' => 
            array (
              'lat' => 35.492920099999999,
              'lng' => 6.6267201,
            ),
          ),
          'location' => 
          array (
            'lat' => 41.871940000000002,
            'lng' => 12.56738,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 47.091999999999999,
              'lng' => 18.520501500000002,
            ),
            'southwest' => 
            array (
              'lat' => 35.492920099999999,
              'lng' => 6.6267201,
            ),
          ),
        ),
        'JM' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 18.525310399999999,
              'lng' => -76.183159000000003,
            ),
            'southwest' => 
            array (
              'lat' => 17.7057243,
              'lng' => -78.368846099999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 18.109580999999999,
            'lng' => -77.297507999999993,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 18.525310399999999,
              'lng' => -76.183159000000003,
            ),
            'southwest' => 
            array (
              'lat' => 17.7057243,
              'lng' => -78.368846099999999,
            ),
          ),
        ),
        'JP' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 45.522771900000002,
              'lng' => 153.98743049999999,
            ),
            'southwest' => 
            array (
              'lat' => 20.421879300000001,
              'lng' => 122.9338302,
            ),
          ),
          'location' => 
          array (
            'lat' => 36.204824000000002,
            'lng' => 138.25292400000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 45.522771900000002,
              'lng' => 145.81755029999999,
            ),
            'southwest' => 
            array (
              'lat' => 24.048692899999999,
              'lng' => 122.9338302,
            ),
          ),
        ),
        'JE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 49.262131400000001,
              'lng' => -2.0104646000000002,
            ),
            'southwest' => 
            array (
              'lat' => 49.160121699999998,
              'lng' => -2.2548010999999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 49.214438999999999,
            'lng' => -2.1312500000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 49.262131400000001,
              'lng' => -2.0104646000000002,
            ),
            'southwest' => 
            array (
              'lat' => 49.160121699999998,
              'lng' => -2.2548010999999999,
            ),
          ),
        ),
        'JO' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 33.374687799999997,
              'lng' => 39.301153999999997,
            ),
            'southwest' => 
            array (
              'lat' => 29.185036100000001,
              'lng' => 34.958336799999998,
            ),
          ),
          'location' => 
          array (
            'lat' => 30.585163999999999,
            'lng' => 36.238413999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 33.374687799999997,
              'lng' => 39.301153999999997,
            ),
            'southwest' => 
            array (
              'lat' => 29.185036100000001,
              'lng' => 34.958336799999998,
            ),
          ),
        ),
        'KZ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 55.441983899999997,
              'lng' => 87.315415000000002,
            ),
            'southwest' => 
            array (
              'lat' => 40.568584100000002,
              'lng' => 46.493671900000002,
            ),
          ),
          'location' => 
          array (
            'lat' => 48.019573000000001,
            'lng' => 66.923683999999994,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 55.441983899999997,
              'lng' => 87.315415000000002,
            ),
            'southwest' => 
            array (
              'lat' => 40.568584100000002,
              'lng' => 46.493671900000002,
            ),
          ),
        ),
        'KE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 5.0334208999999994,
              'lng' => 41.9068957,
            ),
            'southwest' => 
            array (
              'lat' => -4.6796584999999986,
              'lng' => 33.909821099999988,
            ),
          ),
          'location' => 
          array (
            'lat' => -0.023559,
            'lng' => 37.906193000000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 5.0334208999999994,
              'lng' => 41.9068957,
            ),
            'southwest' => 
            array (
              'lat' => -4.6796584999999986,
              'lng' => 33.909821099999988,
            ),
          ),
        ),
        'KI' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 4.6999585000000002,
              'lng' => -150.19580379999999,
            ),
            'southwest' => 
            array (
              'lat' => -11.446519199999999,
              'lng' => 169.5215322,
            ),
          ),
          'location' => 
          array (
            'lat' => 1.8708833,
            'lng' => -157.36302620000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 2.0482990999999999,
              'lng' => -157.1639691,
            ),
            'southwest' => 
            array (
              'lat' => 1.6934674999999999,
              'lng' => -157.56208319999999,
            ),
          ),
        ),
        'KR' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 38.616915200000001,
              'lng' => 130.9232178,
            ),
            'southwest' => 
            array (
              'lat' => 33.106109600000003,
              'lng' => 124.60813899999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 35.907756999999997,
            'lng' => 127.76692199999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 38.616915200000001,
              'lng' => 129.58467099999999,
            ),
            'southwest' => 
            array (
              'lat' => 33.106109600000003,
              'lng' => 124.60813899999999,
            ),
          ),
        ),
        'KW' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 30.103699299999999,
              'lng' => 48.4304579,
            ),
            'southwest' => 
            array (
              'lat' => 28.524446300000001,
              'lng' => 46.553039899999987,
            ),
          ),
          'location' => 
          array (
            'lat' => 29.31166,
            'lng' => 47.481766,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 30.1037061,
              'lng' => 48.4304579,
            ),
            'southwest' => 
            array (
              'lat' => 28.524446300000001,
              'lng' => 46.553039899999987,
            ),
          ),
        ),
        'KG' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 43.2653569,
              'lng' => 80.226559399999999,
            ),
            'southwest' => 
            array (
              'lat' => 39.180253999999998,
              'lng' => 69.250997999999996,
            ),
          ),
          'location' => 
          array (
            'lat' => 41.20438,
            'lng' => 74.766098,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 43.2653569,
              'lng' => 80.226559399999999,
            ),
            'southwest' => 
            array (
              'lat' => 39.180253999999998,
              'lng' => 69.250997999999996,
            ),
          ),
        ),
        'LA' => false,
        'LV' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 58.085568799999997,
              'lng' => 28.241402900000001,
            ),
            'southwest' => 
            array (
              'lat' => 55.674776899999998,
              'lng' => 20.970093899999998,
            ),
          ),
          'location' => 
          array (
            'lat' => 56.879635,
            'lng' => 24.603189,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 58.085568799999997,
              'lng' => 28.241402900000001,
            ),
            'southwest' => 
            array (
              'lat' => 55.674776899999998,
              'lng' => 20.970093899999998,
            ),
          ),
        ),
        'LB' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 34.69209,
              'lng' => 36.623719999999999,
            ),
            'southwest' => 
            array (
              'lat' => 33.0550256,
              'lng' => 35.103777999999998,
            ),
          ),
          'location' => 
          array (
            'lat' => 33.854720999999998,
            'lng' => 35.862285,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 34.69209,
              'lng' => 36.623719999999999,
            ),
            'southwest' => 
            array (
              'lat' => 33.0550256,
              'lng' => 35.103777999999998,
            ),
          ),
        ),
        'LS' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -28.570801100000001,
              'lng' => 29.455708699999999,
            ),
            'southwest' => 
            array (
              'lat' => -30.6755788,
              'lng' => 27.011230999999999,
            ),
          ),
          'location' => 
          array (
            'lat' => -29.609988000000001,
            'lng' => 28.233608,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -28.570801100000001,
              'lng' => 29.455708699999999,
            ),
            'southwest' => 
            array (
              'lat' => -30.6755788,
              'lng' => 27.011230999999999,
            ),
          ),
        ),
        'LR' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 8.5519859999999994,
              'lng' => -7.3692548999999996,
            ),
            'southwest' => 
            array (
              'lat' => 4.3154139000000002,
              'lng' => -11.475599799999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 6.4280549999999996,
            'lng' => -9.4294990000000016,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 8.5519859999999994,
              'lng' => -7.3692548999999996,
            ),
            'southwest' => 
            array (
              'lat' => 4.3154139000000002,
              'lng' => -11.475599799999999,
            ),
          ),
        ),
        'LY' => false,
        'LI' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 47.270546699999997,
              'lng' => 9.6356500999999994,
            ),
            'southwest' => 
            array (
              'lat' => 47.048289999999987,
              'lng' => 9.4716199999999997,
            ),
          ),
          'location' => 
          array (
            'lat' => 47.165999999999997,
            'lng' => 9.5553729999999995,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 47.270546699999997,
              'lng' => 9.6356500999999994,
            ),
            'southwest' => 
            array (
              'lat' => 47.048289999999987,
              'lng' => 9.4716199999999997,
            ),
          ),
        ),
        'LT' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 56.450320899999987,
              'lng' => 26.835591300000001,
            ),
            'southwest' => 
            array (
              'lat' => 53.896878699999988,
              'lng' => 20.954011699999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 55.169438,
            'lng' => 23.881274999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 56.450320899999987,
              'lng' => 26.835591300000001,
            ),
            'southwest' => 
            array (
              'lat' => 53.896878699999988,
              'lng' => 20.954011699999999,
            ),
          ),
        ),
        'LU' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 50.18282,
              'lng' => 6.5309700999999993,
            ),
            'southwest' => 
            array (
              'lat' => 49.447778999999997,
              'lng' => 5.7356699000000004,
            ),
          ),
          'location' => 
          array (
            'lat' => 49.815272999999998,
            'lng' => 6.1295829999999993,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 50.18282,
              'lng' => 6.5309700999999993,
            ),
            'southwest' => 
            array (
              'lat' => 49.447778999999997,
              'lng' => 5.7356699000000004,
            ),
          ),
        ),
        'MO' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 22.217063899999999,
              'lng' => 113.5982798,
            ),
            'southwest' => 
            array (
              'lat' => 22.1097717,
              'lng' => 113.5276053,
            ),
          ),
          'location' => 
          array (
            'lat' => 22.198744999999999,
            'lng' => 113.543873,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 22.217063899999999,
              'lng' => 113.5982798,
            ),
            'southwest' => 
            array (
              'lat' => 22.1097717,
              'lng' => 113.5276053,
            ),
          ),
        ),
        'MK' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.373646000000001,
              'lng' => 23.034092999999999,
            ),
            'southwest' => 
            array (
              'lat' => 40.853782600000002,
              'lng' => 20.452423,
            ),
          ),
          'location' => 
          array (
            'lat' => 41.608635,
            'lng' => 21.745274999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.535232999999998,
              'lng' => 24.181915,
            ),
            'southwest' => 
            array (
              'lat' => 39.705455000000001,
              'lng' => 20.290008,
            ),
          ),
        ),
        'MG' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -11.951963900000001,
              'lng' => 50.483779899999988,
            ),
            'southwest' => 
            array (
              'lat' => -25.606515699999999,
              'lng' => 43.185139499999998,
            ),
          ),
          'location' => 
          array (
            'lat' => -18.766946999999998,
            'lng' => 46.869107,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -11.951963900000001,
              'lng' => 50.483779899999988,
            ),
            'southwest' => 
            array (
              'lat' => -25.606515699999999,
              'lng' => 43.185139499999998,
            ),
          ),
        ),
        'MW' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -9.3672273999999991,
              'lng' => 35.918572999999988,
            ),
            'southwest' => 
            array (
              'lat' => -17.1295216,
              'lng' => 32.672520499999997,
            ),
          ),
          'location' => 
          array (
            'lat' => -13.254308,
            'lng' => 34.301524999999998,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -9.3672273999999991,
              'lng' => 35.918572999999988,
            ),
            'southwest' => 
            array (
              'lat' => -17.1295216,
              'lng' => 32.672520499999997,
            ),
          ),
        ),
        'MY' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 7.3796369000000004,
              'lng' => 119.26936190000001,
            ),
            'southwest' => 
            array (
              'lat' => 0.85382089999999999,
              'lng' => 98.936252699999997,
            ),
          ),
          'location' => 
          array (
            'lat' => 4.2104840000000001,
            'lng' => 101.97576599999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 7.8198469999999993,
              'lng' => 119.813461,
            ),
            'southwest' => 
            array (
              'lat' => 0.46142100000000003,
              'lng' => 99.42283599999999,
            ),
          ),
        ),
        'MV' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 7.1062797999999994,
              'lng' => 73.759653700000001,
            ),
            'southwest' => 
            array (
              'lat' => -0.7035846,
              'lng' => 72.638581500000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 1.977247,
            'lng' => 73.536103400000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 2.1331625000000001,
              'lng' => 73.5859454,
            ),
            'southwest' => 
            array (
              'lat' => 1.8213315000000001,
              'lng' => 73.486261400000004,
            ),
          ),
        ),
        'ML' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 25.001083999999999,
              'lng' => 4.2673828,
            ),
            'southwest' => 
            array (
              'lat' => 10.147811000000001,
              'lng' => -12.2388849,
            ),
          ),
          'location' => 
          array (
            'lat' => 17.570692000000001,
            'lng' => -3.9961660000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 25.001083999999999,
              'lng' => 4.2673828,
            ),
            'southwest' => 
            array (
              'lat' => 10.147811000000001,
              'lng' => -12.2388849,
            ),
          ),
        ),
        'MT' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 36.082227000000003,
              'lng' => 14.5765028,
            ),
            'southwest' => 
            array (
              'lat' => 35.806236400000003,
              'lng' => 14.183548399999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 35.937496000000003,
            'lng' => 14.375416,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 36.082227000000003,
              'lng' => 14.5765028,
            ),
            'southwest' => 
            array (
              'lat' => 35.806236400000003,
              'lng' => 14.183548399999999,
            ),
          ),
        ),
        'MH' => false,
        'MQ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 14.878716300000001,
              'lng' => -60.810527800000003,
            ),
            'southwest' => 
            array (
              'lat' => 14.3886471,
              'lng' => -61.229092999999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 14.641527999999999,
            'lng' => -61.024174000000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 14.878716300000001,
              'lng' => -60.810527800000003,
            ),
            'southwest' => 
            array (
              'lat' => 14.3886471,
              'lng' => -61.229092999999999,
            ),
          ),
        ),
        'MR' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 27.3158916,
              'lng' => -4.8336008000000001,
            ),
            'southwest' => 
            array (
              'lat' => 14.721273,
              'lng' => -17.068727599999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 21.00789,
            'lng' => -10.940835,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 27.3158916,
              'lng' => -4.8336008000000001,
            ),
            'southwest' => 
            array (
              'lat' => 14.721273,
              'lng' => -17.068727599999999,
            ),
          ),
        ),
        'MU' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -10.3366293,
              'lng' => 63.503594499999998,
            ),
            'southwest' => 
            array (
              'lat' => -20.5255121,
              'lng' => 56.514366699999997,
            ),
          ),
          'location' => 
          array (
            'lat' => -20.348403999999999,
            'lng' => 57.552152000000007,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -18.776299999999999,
              'lng' => 59.584400000000002,
            ),
            'southwest' => 
            array (
              'lat' => -21.637,
              'lng' => 55.766599999999997,
            ),
          ),
        ),
        'YT' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -12.6365371,
              'lng' => 45.3000288,
            ),
            'southwest' => 
            array (
              'lat' => -13.005527900000001,
              'lng' => 45.018170699999999,
            ),
          ),
          'location' => 
          array (
            'lat' => -12.827500000000001,
            'lng' => 45.166243999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -12.6365371,
              'lng' => 45.3000288,
            ),
            'southwest' => 
            array (
              'lat' => -13.005527900000001,
              'lng' => 45.018170699999999,
            ),
          ),
        ),
        'MX' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 32.718762900000002,
              'lng' => -86.710571099999996,
            ),
            'southwest' => 
            array (
              'lat' => 14.5333036,
              'lng' => -118.36492920000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 23.634501,
            'lng' => -102.552784,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 32.718762900000002,
              'lng' => -86.710571099999996,
            ),
            'southwest' => 
            array (
              'lat' => 14.5345485,
              'lng' => -118.36492920000001,
            ),
          ),
        ),
        'FM' => false,
        'MD' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 48.491943999999997,
              'lng' => 30.162538000000001,
            ),
            'southwest' => 
            array (
              'lat' => 45.466904,
              'lng' => 26.616855900000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 47.411631,
            'lng' => 28.369885,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 48.491943999999997,
              'lng' => 30.162538000000001,
            ),
            'southwest' => 
            array (
              'lat' => 45.466904,
              'lng' => 26.616855900000001,
            ),
          ),
        ),
        'MC' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 43.751902899999997,
              'lng' => 7.4398112999999997,
            ),
            'southwest' => 
            array (
              'lat' => 43.7247427,
              'lng' => 7.4091049,
            ),
          ),
          'location' => 
          array (
            'lat' => 43.738417600000012,
            'lng' => 7.4246157999999989,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 43.751902899999997,
              'lng' => 7.4398112999999997,
            ),
            'southwest' => 
            array (
              'lat' => 43.7247427,
              'lng' => 7.4091049,
            ),
          ),
        ),
        'MN' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 52.1486965,
              'lng' => 119.93194889999999,
            ),
            'southwest' => 
            array (
              'lat' => 41.581520099999999,
              'lng' => 87.737619999999993,
            ),
          ),
          'location' => 
          array (
            'lat' => 46.862496,
            'lng' => 103.846656,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 52.1486965,
              'lng' => 119.93194889999999,
            ),
            'southwest' => 
            array (
              'lat' => 41.581520099999999,
              'lng' => 87.737619999999993,
            ),
          ),
        ),
        'ME' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 43.558743,
              'lng' => 20.357486900000001,
            ),
            'southwest' => 
            array (
              'lat' => 41.850101700000003,
              'lng' => 18.433792100000002,
            ),
          ),
          'location' => 
          array (
            'lat' => 42.708677999999999,
            'lng' => 19.374389999999998,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 43.558743,
              'lng' => 20.357486900000001,
            ),
            'southwest' => 
            array (
              'lat' => 41.850101700000003,
              'lng' => 18.433792100000002,
            ),
          ),
        ),
        'MS' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 16.824051900000001,
              'lng' => -62.144175800000014,
            ),
            'southwest' => 
            array (
              'lat' => 16.674821000000001,
              'lng' => -62.241321999999997,
            ),
          ),
          'location' => 
          array (
            'lat' => 16.742498000000001,
            'lng' => -62.187365999999997,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 16.824051900000001,
              'lng' => -62.144175800000014,
            ),
            'southwest' => 
            array (
              'lat' => 16.674821000000001,
              'lng' => -62.241321999999997,
            ),
          ),
        ),
        'MA' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 35.922383400000001,
              'lng' => -0.99697599999999997,
            ),
            'southwest' => 
            array (
              'lat' => 27.667269399999999,
              'lng' => -13.1724701,
            ),
          ),
          'location' => 
          array (
            'lat' => 31.791702000000001,
            'lng' => -7.0926199999999993,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 35.922383400000001,
              'lng' => -0.99697599999999997,
            ),
            'southwest' => 
            array (
              'lat' => 27.667269399999999,
              'lng' => -13.1724701,
            ),
          ),
        ),
        'MZ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -10.4712022,
              'lng' => 40.839121300000002,
            ),
            'southwest' => 
            array (
              'lat' => -26.868162000000002,
              'lng' => 30.215550100000002,
            ),
          ),
          'location' => 
          array (
            'lat' => -18.665694999999999,
            'lng' => 35.529561999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -10.4712022,
              'lng' => 40.839121300000002,
            ),
            'southwest' => 
            array (
              'lat' => -26.868162000000002,
              'lng' => 30.215550100000002,
            ),
          ),
        ),
        'MM' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 28.5478351,
              'lng' => 101.1702717,
            ),
            'southwest' => 
            array (
              'lat' => 9.5990941999999997,
              'lng' => 92.171807999999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 21.913965000000001,
            'lng' => 95.956222999999994,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 28.5478351,
              'lng' => 101.1702717,
            ),
            'southwest' => 
            array (
              'lat' => 9.5990941999999997,
              'lng' => 92.171807999999999,
            ),
          ),
        ),
        'NA' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -16.9634851,
              'lng' => 25.261752000000001,
            ),
            'southwest' => 
            array (
              'lat' => -28.9706391,
              'lng' => 11.7242468,
            ),
          ),
          'location' => 
          array (
            'lat' => -22.957640000000001,
            'lng' => 18.490410000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -16.9634851,
              'lng' => 25.261752000000001,
            ),
            'southwest' => 
            array (
              'lat' => -28.9706391,
              'lng' => 11.7242468,
            ),
          ),
        ),
        'NR' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -0.50263950000000002,
              'lng' => 166.95892810000001,
            ),
            'southwest' => 
            array (
              'lat' => -0.55418939999999994,
              'lng' => 166.90954859999999,
            ),
          ),
          'location' => 
          array (
            'lat' => -0.52277799999999996,
            'lng' => 166.93150299999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -0.50263950000000002,
              'lng' => 166.95892810000001,
            ),
            'southwest' => 
            array (
              'lat' => -0.55418939999999994,
              'lng' => 166.90954859999999,
            ),
          ),
        ),
        'NP' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 30.446945199999998,
              'lng' => 88.201525699999991,
            ),
            'southwest' => 
            array (
              'lat' => 26.347966100000001,
              'lng' => 80.058469800000012,
            ),
          ),
          'location' => 
          array (
            'lat' => 28.394856999999998,
            'lng' => 84.124007999999989,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 30.446945199999998,
              'lng' => 88.201525699999991,
            ),
            'southwest' => 
            array (
              'lat' => 26.347966100000001,
              'lng' => 80.058469800000012,
            ),
          ),
        ),
        'NL' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 53.555199899999998,
              'lng' => 7.2275101999999993,
            ),
            'southwest' => 
            array (
              'lat' => 50.750383799999987,
              'lng' => 3.3579620000000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 52.132632999999998,
            'lng' => 5.2912659999999994,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 53.675600000000003,
              'lng' => 7.2271405000000009,
            ),
            'southwest' => 
            array (
              'lat' => 50.7503837,
              'lng' => 3.3315999999999999,
            ),
          ),
        ),
        'AN' => false,
        'NC' => false,
        'NZ' => false,
        'NI' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 15.0302755,
              'lng' => -82.592071500000003,
            ),
            'southwest' => 
            array (
              'lat' => 10.7080549,
              'lng' => -87.690307599999997,
            ),
          ),
          'location' => 
          array (
            'lat' => 12.865416,
            'lng' => -85.207228999999998,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 15.0302755,
              'lng' => -82.592071500000003,
            ),
            'southwest' => 
            array (
              'lat' => 10.7080549,
              'lng' => -87.690307599999997,
            ),
          ),
        ),
        'NE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 23.499999899999999,
              'lng' => 15.999033900000001,
            ),
            'southwest' => 
            array (
              'lat' => 11.694295,
              'lng' => 0.16171779999999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 17.607789,
            'lng' => 8.0816660000000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 23.499999899999999,
              'lng' => 15.999033900000001,
            ),
            'southwest' => 
            array (
              'lat' => 11.694295,
              'lng' => 0.16171779999999999,
            ),
          ),
        ),
        'NG' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 13.885644900000001,
              'lng' => 14.677982,
            ),
            'southwest' => 
            array (
              'lat' => 4.2698570999999994,
              'lng' => 2.6769319999999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 9.0819989999999997,
            'lng' => 8.6752769999999995,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 13.885644900000001,
              'lng' => 14.677982,
            ),
            'southwest' => 
            array (
              'lat' => 4.2698570999999994,
              'lng' => 2.6769319999999999,
            ),
          ),
        ),
        'NU' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -18.952626200000001,
              'lng' => -169.77432479999999,
            ),
            'southwest' => 
            array (
              'lat' => -19.155480699999998,
              'lng' => -169.94979230000001,
            ),
          ),
          'location' => 
          array (
            'lat' => -19.054445000000001,
            'lng' => -169.867233,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -18.952626200000001,
              'lng' => -169.77432479999999,
            ),
            'southwest' => 
            array (
              'lat' => -19.155480699999998,
              'lng' => -169.94979230000001,
            ),
          ),
        ),
        'NF' => false,
        'MP' => false,
        'NO' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 71.185476199999997,
              'lng' => 31.168268399999999,
            ),
            'southwest' => 
            array (
              'lat' => 57.959595,
              'lng' => 4.5000961999999998,
            ),
          ),
          'location' => 
          array (
            'lat' => 60.47202399999999,
            'lng' => 8.468945999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 71.185476199999997,
              'lng' => 31.149789200000001,
            ),
            'southwest' => 
            array (
              'lat' => 57.965275099999999,
              'lng' => 4.6277065999999998,
            ),
          ),
        ),
        'OM' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 26.405394699999999,
              'lng' => 60.013120999999998,
            ),
            'southwest' => 
            array (
              'lat' => 16.650335999999999,
              'lng' => 52.0000018,
            ),
          ),
          'location' => 
          array (
            'lat' => 21.512582999999999,
            'lng' => 55.923254999999997,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 26.405394699999999,
              'lng' => 60.013120999999998,
            ),
            'southwest' => 
            array (
              'lat' => 16.650335999999999,
              'lng' => 52.0000018,
            ),
          ),
        ),
        'PK' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 37.084107000000003,
              'lng' => 77.831619500000002,
            ),
            'southwest' => 
            array (
              'lat' => 23.694694500000001,
              'lng' => 60.872972099999998,
            ),
          ),
          'location' => 
          array (
            'lat' => 30.375321,
            'lng' => 69.34511599999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 37.084107000000003,
              'lng' => 77.831619500000002,
            ),
            'southwest' => 
            array (
              'lat' => 23.694694500000001,
              'lng' => 60.872972099999998,
            ),
          ),
        ),
        'PW' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 8.0940233999999993,
              'lng' => 134.72109850000001,
            ),
            'southwest' => 
            array (
              'lat' => 2.8127428000000001,
              'lng' => 131.1201097,
            ),
          ),
          'location' => 
          array (
            'lat' => 7.5149799999999987,
            'lng' => 134.58251999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 7.7592679999999987,
              'lng' => 134.64658679999999,
            ),
            'southwest' => 
            array (
              'lat' => 6.9733932999999997,
              'lng' => 134.22160149999999,
            ),
          ),
        ),
        'PS' => false,
        'PA' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 9.6477792000000004,
              'lng' => -77.158487999999991,
            ),
            'southwest' => 
            array (
              'lat' => 7.203556400000001,
              'lng' => -83.052241099999989,
            ),
          ),
          'location' => 
          array (
            'lat' => 8.5379810000000003,
            'lng' => -80.782127000000003,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 9.6474821999999989,
              'lng' => -77.158487999999991,
            ),
            'southwest' => 
            array (
              'lat' => 7.203556400000001,
              'lng' => -83.052241099999989,
            ),
          ),
        ),
        'PG' => false,
        'PY' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -19.2876589,
              'lng' => -54.258561999999998,
            ),
            'southwest' => 
            array (
              'lat' => -27.581759399999999,
              'lng' => -62.638138799999993,
            ),
          ),
          'location' => 
          array (
            'lat' => -23.442502999999999,
            'lng' => -58.443832,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -19.2876589,
              'lng' => -54.258561999999998,
            ),
            'southwest' => 
            array (
              'lat' => -27.581759399999999,
              'lng' => -62.638138799999993,
            ),
          ),
        ),
        'PE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -0.038776999999999999,
              'lng' => -68.652328999999995,
            ),
            'southwest' => 
            array (
              'lat' => -18.351599400000001,
              'lng' => -81.328504099999989,
            ),
          ),
          'location' => 
          array (
            'lat' => -9.1899669999999993,
            'lng' => -75.015152,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -0.038776999999999999,
              'lng' => -68.652328999999995,
            ),
            'southwest' => 
            array (
              'lat' => -18.351599400000001,
              'lng' => -81.328504099999989,
            ),
          ),
        ),
        'PH' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 19.574024099999999,
              'lng' => 126.6043837,
            ),
            'southwest' => 
            array (
              'lat' => 4.5870338999999998,
              'lng' => 116.7029193,
            ),
          ),
          'location' => 
          array (
            'lat' => 12.879721,
            'lng' => 121.774017,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 19.761040699999999,
              'lng' => 130.66002750000001,
            ),
            'southwest' => 
            array (
              'lat' => 3.6346295999999998,
              'lng' => 114.58348100000001,
            ),
          ),
        ),
        'PN' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -23.914566000000001,
              'lng' => -124.77215769999999,
            ),
            'southwest' => 
            array (
              'lat' => -25.079807500000001,
              'lng' => -130.75092559999999,
            ),
          ),
          'location' => 
          array (
            'lat' => -24.376745199999998,
            'lng' => -128.3242353,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -24.330485899999999,
              'lng' => -128.29162020000001,
            ),
            'southwest' => 
            array (
              'lat' => -24.4230044,
              'lng' => -128.35685040000001,
            ),
          ),
        ),
        'PL' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 54.835783999999997,
              'lng' => 24.145893099999999,
            ),
            'southwest' => 
            array (
              'lat' => 49.002025199999999,
              'lng' => 14.122864099999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 51.919438,
            'lng' => 19.145136000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 54.835783999999997,
              'lng' => 24.145893099999999,
            ),
            'southwest' => 
            array (
              'lat' => 49.002025199999999,
              'lng' => 14.122864099999999,
            ),
          ),
        ),
        'PT' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.154204800000002,
              'lng' => -6.1902090999999997,
            ),
            'southwest' => 
            array (
              'lat' => 32.403739999999999,
              'lng' => -31.275329599999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 39.399871999999988,
            'lng' => -8.2244539999999997,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.154204800000002,
              'lng' => -6.1902090999999997,
            ),
            'southwest' => 
            array (
              'lat' => 36.960177199999997,
              'lng' => -9.5171106999999999,
            ),
          ),
        ),
        'PR' => false,
        'QA' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 26.1830927,
              'lng' => 51.643262999999997,
            ),
            'southwest' => 
            array (
              'lat' => 24.471118000000001,
              'lng' => 50.7500553,
            ),
          ),
          'location' => 
          array (
            'lat' => 25.354825999999999,
            'lng' => 51.183883999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 26.1830927,
              'lng' => 51.643262999999997,
            ),
            'southwest' => 
            array (
              'lat' => 24.471118000000001,
              'lng' => 50.7500553,
            ),
          ),
        ),
        'RE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -20.871755700000001,
              'lng' => 55.836553599999988,
            ),
            'southwest' => 
            array (
              'lat' => -21.389621999999999,
              'lng' => 55.216405299999998,
            ),
          ),
          'location' => 
          array (
            'lat' => -21.115141000000001,
            'lng' => 55.536383999999998,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -20.871755700000001,
              'lng' => 55.836553599999988,
            ),
            'southwest' => 
            array (
              'lat' => -21.389621999999999,
              'lng' => 55.216405299999998,
            ),
          ),
        ),
        'RO' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 48.265273999999998,
              'lng' => 29.7571014,
            ),
            'southwest' => 
            array (
              'lat' => 43.618619299999999,
              'lng' => 20.261759300000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 45.943161000000003,
            'lng' => 24.966760000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 48.265273999999998,
              'lng' => 29.7571014,
            ),
            'southwest' => 
            array (
              'lat' => 43.618619299999999,
              'lng' => 20.261759300000001,
            ),
          ),
        ),
        'RU' => [
            'location' => [
                'lat' => 63.605026,
                'lng' => 88.498048
            ]
        ],
        'RW' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -1.0473752999999999,
              'lng' => 30.8991179,
            ),
            'southwest' => 
            array (
              'lat' => -2.8399383,
              'lng' => 28.861754000000001,
            ),
          ),
          'location' => 
          array (
            'lat' => -1.9402779999999999,
            'lng' => 29.873888000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -1.0473752999999999,
              'lng' => 30.8991179,
            ),
            'southwest' => 
            array (
              'lat' => -2.8399383,
              'lng' => 28.861754000000001,
            ),
          ),
        ),
        'BL' => false,
        'SH' => false,
        'KN' => false,
        'LC' => false,
        'MF' => false,
        'PM' => false,
        'VC' => false,
        'WS' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -13.439682299999999,
              'lng' => -171.40585899999999,
            ),
            'southwest' => 
            array (
              'lat' => -14.0765884,
              'lng' => -172.8036764,
            ),
          ),
          'location' => 
          array (
            'lat' => -13.759029,
            'lng' => -172.10462899999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -13.439682299999999,
              'lng' => -171.40585899999999,
            ),
            'southwest' => 
            array (
              'lat' => -14.0765884,
              'lng' => -172.8036764,
            ),
          ),
        ),
        'SM' => false,
        'ST' => false,
        'SA' => false,
        'SN' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 16.693053899999999,
              'lng' => -11.348606999999999,
            ),
            'southwest' => 
            array (
              'lat' => 12.3072891,
              'lng' => -17.5298482,
            ),
          ),
          'location' => 
          array (
            'lat' => 14.497401,
            'lng' => -14.452362000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 16.693053899999999,
              'lng' => -11.348606999999999,
            ),
            'southwest' => 
            array (
              'lat' => 12.3072891,
              'lng' => -17.5298482,
            ),
          ),
        ),
        'RS' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 46.190032000000002,
              'lng' => 23.0063095,
            ),
            'southwest' => 
            array (
              'lat' => 42.231502900000002,
              'lng' => 18.838522099999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 44.016520999999997,
            'lng' => 21.005859000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 46.190032000000002,
              'lng' => 23.0063095,
            ),
            'southwest' => 
            array (
              'lat' => 42.231502900000002,
              'lng' => 18.838522099999999,
            ),
          ),
        ),
        'SC' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -4.2097857999999997,
              'lng' => 56.294294000000008,
            ),
            'southwest' => 
            array (
              'lat' => -10.2270331,
              'lng' => 46.2032965,
            ),
          ),
          'location' => 
          array (
            'lat' => -4.6795739999999997,
            'lng' => 55.491976999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -4.5606996000000004,
              'lng' => 55.539042100000003,
            ),
            'southwest' => 
            array (
              'lat' => -4.8069082999999999,
              'lng' => 55.359914199999999,
            ),
          ),
        ),
        'SL' => false,
        'SG' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 1.4707592,
              'lng' => 104.0884808,
            ),
            'southwest' => 
            array (
              'lat' => 1.1587023000000001,
              'lng' => 103.6055448,
            ),
          ),
          'location' => 
          array (
            'lat' => 1.3520829999999999,
            'lng' => 103.819836,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 1.4707592,
              'lng' => 104.0884808,
            ),
            'southwest' => 
            array (
              'lat' => 1.1587023000000001,
              'lng' => 103.6055448,
            ),
          ),
        ),
        'SK' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 49.613805100000008,
              'lng' => 22.5589339,
            ),
            'southwest' => 
            array (
              'lat' => 47.731158999999998,
              'lng' => 16.833182099999998,
            ),
          ),
          'location' => 
          array (
            'lat' => 48.669026000000002,
            'lng' => 19.699024000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 49.613805100000008,
              'lng' => 22.5589339,
            ),
            'southwest' => 
            array (
              'lat' => 47.731158999999998,
              'lng' => 16.833182099999998,
            ),
          ),
        ),
        'SI' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 46.876658999999997,
              'lng' => 16.596685699999998,
            ),
            'southwest' => 
            array (
              'lat' => 45.421673900000002,
              'lng' => 13.3753355,
            ),
          ),
          'location' => 
          array (
            'lat' => 46.151240999999999,
            'lng' => 14.995463000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 46.876658999999997,
              'lng' => 16.596685699999998,
            ),
            'southwest' => 
            array (
              'lat' => 45.421673900000002,
              'lng' => 13.3753355,
            ),
          ),
        ),
        'SB' => false,
        'SO' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 11.988614399999999,
              'lng' => 51.413028699999998,
            ),
            'southwest' => 
            array (
              'lat' => -1.6620657999999999,
              'lng' => 40.994373000000003,
            ),
          ),
          'location' => 
          array (
            'lat' => 5.1521489999999996,
            'lng' => 46.199615999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 11.988614399999999,
              'lng' => 51.413028699999998,
            ),
            'southwest' => 
            array (
              'lat' => -1.6620657999999999,
              'lng' => 40.994373000000003,
            ),
          ),
        ),
        'ZA' => false,
        'GS' => false,
        'ES' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 43.7923495,
              'lng' => 4.3277839,
            ),
            'southwest' => 
            array (
              'lat' => 27.637893600000002,
              'lng' => -18.160788,
            ),
          ),
          'location' => 
          array (
            'lat' => 40.463667000000008,
            'lng' => -3.7492200000000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 45.244,
              'lng' => 5.0979999999999999,
            ),
            'southwest' => 
            array (
              'lat' => 35.173000000000009,
              'lng' => -12.523999999999999,
            ),
          ),
        ),
        'LK' => false,
        'SD' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 22.224917999999999,
              'lng' => 38.583674700000003,
            ),
            'southwest' => 
            array (
              'lat' => 9.3472208999999999,
              'lng' => 21.814938999999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 12.862807,
            'lng' => 30.217635999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 22.224917999999999,
              'lng' => 38.583674700000003,
            ),
            'southwest' => 
            array (
              'lat' => 9.3472208999999999,
              'lng' => 21.814938999999999,
            ),
          ),
        ),
        'SR' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 6.0092831999999996,
              'lng' => -53.951024500000003,
            ),
            'southwest' => 
            array (
              'lat' => 1.8373060000000001,
              'lng' => -58.070505900000008,
            ),
          ),
          'location' => 
          array (
            'lat' => 3.919305,
            'lng' => -56.027782999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 6.0092831999999996,
              'lng' => -53.951024500000003,
            ),
            'southwest' => 
            array (
              'lat' => 1.8373060000000001,
              'lng' => -58.070505900000008,
            ),
          ),
        ),
        'SJ' => false,
        'SZ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -25.717919999999999,
              'lng' => 32.134906700000002,
            ),
            'southwest' => 
            array (
              'lat' => -27.317402000000001,
              'lng' => 30.79064,
            ),
          ),
          'location' => 
          array (
            'lat' => -26.522503,
            'lng' => 31.465865999999998,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -25.717919999999999,
              'lng' => 32.134906700000002,
            ),
            'southwest' => 
            array (
              'lat' => -27.317402000000001,
              'lng' => 30.79064,
            ),
          ),
        ),
        'SE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 69.059970899999996,
              'lng' => 24.166809199999999,
            ),
            'southwest' => 
            array (
              'lat' => 55.3367024,
              'lng' => 10.9631866,
            ),
          ),
          'location' => 
          array (
            'lat' => 60.128161000000013,
            'lng' => 18.643501000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 69.059970899999996,
              'lng' => 24.166023800000001,
            ),
            'southwest' => 
            array (
              'lat' => 55.3367024,
              'lng' => 10.9644893,
            ),
          ),
        ),
        'CH' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 47.808454599999997,
              'lng' => 10.4923401,
            ),
            'southwest' => 
            array (
              'lat' => 45.817920000000001,
              'lng' => 5.95608,
            ),
          ),
          'location' => 
          array (
            'lat' => 46.818187999999999,
            'lng' => 8.227511999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 47.808454599999997,
              'lng' => 10.4923401,
            ),
            'southwest' => 
            array (
              'lat' => 45.817920000000001,
              'lng' => 5.95608,
            ),
          ),
        ),
        'SY' => false,
        'TW' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 26.3836884,
              'lng' => 123.4934282,
            ),
            'southwest' => 
            array (
              'lat' => 20.5862202,
              'lng' => 116.7118602,
            ),
          ),
          'location' => 
          array (
            'lat' => 23.69781,
            'lng' => 120.960515,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 25.299623199999999,
              'lng' => 122.0071612,
            ),
            'southwest' => 
            array (
              'lat' => 21.806612900000001,
              'lng' => 120.0350435,
            ),
          ),
        ),
        'TJ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 41.044367000000001,
              'lng' => 75.153956399999998,
            ),
            'southwest' => 
            array (
              'lat' => 36.671989799999999,
              'lng' => 67.342012099999991,
            ),
          ),
          'location' => 
          array (
            'lat' => 38.861033999999997,
            'lng' => 71.276093000000003,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 41.044367000000001,
              'lng' => 75.153956399999998,
            ),
            'southwest' => 
            array (
              'lat' => 36.671989799999999,
              'lng' => 67.342012099999991,
            ),
          ),
        ),
        'TZ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -0.98439699999999997,
              'lng' => 40.4449653,
            ),
            'southwest' => 
            array (
              'lat' => -11.7612539,
              'lng' => 29.34,
            ),
          ),
          'location' => 
          array (
            'lat' => -6.3690280000000001,
            'lng' => 34.888821999999998,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -0.98439699999999997,
              'lng' => 40.4449653,
            ),
            'southwest' => 
            array (
              'lat' => -11.7612539,
              'lng' => 29.34,
            ),
          ),
        ),
        'TH' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 20.465143000000001,
              'lng' => 105.63681200000001,
            ),
            'southwest' => 
            array (
              'lat' => 5.6125970000000001,
              'lng' => 97.343395999999998,
            ),
          ),
          'location' => 
          array (
            'lat' => 15.870032,
            'lng' => 100.992541,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 20.465143000000001,
              'lng' => 105.63681200000001,
            ),
            'southwest' => 
            array (
              'lat' => 5.6125970000000001,
              'lng' => 97.343395999999998,
            ),
          ),
        ),
        'TL' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -8.1268457000000005,
              'lng' => 127.3430437,
            ),
            'southwest' => 
            array (
              'lat' => -9.5041949999999993,
              'lng' => 124.041738,
            ),
          ),
          'location' => 
          array (
            'lat' => -8.8742169999999998,
            'lng' => 125.72753899999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -8.1268457000000005,
              'lng' => 127.3430437,
            ),
            'southwest' => 
            array (
              'lat' => -9.4626559999999991,
              'lng' => 124.931763,
            ),
          ),
        ),
        'TG' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 11.140496300000001,
              'lng' => 1.8088218,
            ),
            'southwest' => 
            array (
              'lat' => 6.1123949999999994,
              'lng' => -0.144042,
            ),
          ),
          'location' => 
          array (
            'lat' => 8.6195430000000002,
            'lng' => 0.82478200000000002,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 11.140496300000001,
              'lng' => 1.8088218,
            ),
            'southwest' => 
            array (
              'lat' => 6.1123949999999994,
              'lng' => -0.144042,
            ),
          ),
        ),
        'TK' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -8.5314540000000001,
              'lng' => -171.1811113,
            ),
            'southwest' => 
            array (
              'lat' => -9.4448708999999997,
              'lng' => -172.52074049999999,
            ),
          ),
          'location' => 
          array (
            'lat' => -9.2001999999999988,
            'lng' => -171.8484,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -9.1006561000000001,
              'lng' => -171.7657901,
            ),
            'southwest' => 
            array (
              'lat' => -9.2330112999999994,
              'lng' => -171.87063219999999,
            ),
          ),
        ),
        'TO' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -15.5663927,
              'lng' => -173.70248409999999,
            ),
            'southwest' => 
            array (
              'lat' => -21.473392,
              'lng' => -175.6796157,
            ),
          ),
          'location' => 
          array (
            'lat' => -21.178985999999998,
            'lng' => -175.19824199999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -21.010185199999999,
              'lng' => -174.90059640000001,
            ),
            'southwest' => 
            array (
              'lat' => -21.473392,
              'lng' => -175.35649739999999,
            ),
          ),
        ),
        'TT' => false,
        'TN' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 37.358287300000001,
              'lng' => 11.599216999999999,
            ),
            'southwest' => 
            array (
              'lat' => 30.2280339,
              'lng' => 7.5223110000000002,
            ),
          ),
          'location' => 
          array (
            'lat' => 33.886916999999997,
            'lng' => 9.5374990000000004,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 37.358287300000001,
              'lng' => 11.599216999999999,
            ),
            'southwest' => 
            array (
              'lat' => 30.2280339,
              'lng' => 7.5223110000000002,
            ),
          ),
        ),
        'TR' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.106239100000003,
              'lng' => 44.817844899999997,
            ),
            'southwest' => 
            array (
              'lat' => 35.808591999999997,
              'lng' => 25.664892999999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 38.963745000000003,
            'lng' => 35.243321999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.106239100000003,
              'lng' => 44.817844899999997,
            ),
            'southwest' => 
            array (
              'lat' => 35.808591999999997,
              'lng' => 25.664892999999999,
            ),
          ),
        ),
        'TM' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.798844000000003,
              'lng' => 66.707353099999992,
            ),
            'southwest' => 
            array (
              'lat' => 35.12876,
              'lng' => 52.447844600000003,
            ),
          ),
          'location' => 
          array (
            'lat' => 38.969718999999998,
            'lng' => 59.556277999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 42.798844000000003,
              'lng' => 66.707353099999992,
            ),
            'southwest' => 
            array (
              'lat' => 35.12876,
              'lng' => 52.447844600000003,
            ),
          ),
        ),
        'TC' => false,
        'TV' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -5.6422299999999996,
              'lng' => 179.87106080000001,
            ),
            'southwest' => 
            array (
              'lat' => -10.7916585,
              'lng' => 176.05889070000001,
            ),
          ),
          'location' => 
          array (
            'lat' => -7.4784418000000006,
            'lng' => 178.67992140000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -7.4577730999999998,
              'lng' => 178.69737989999999,
            ),
            'southwest' => 
            array (
              'lat' => -7.4991105999999998,
              'lng' => 178.662463,
            ),
          ),
        ),
        'UG' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 4.2186278000000001,
              'lng' => 35.033048899999997,
            ),
            'southwest' => 
            array (
              'lat' => -1.4823179,
              'lng' => 29.573433000000001,
            ),
          ),
          'location' => 
          array (
            'lat' => 1.3733329999999999,
            'lng' => 32.290275000000001,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 4.2186278000000001,
              'lng' => 35.033048899999997,
            ),
            'southwest' => 
            array (
              'lat' => -1.4823179,
              'lng' => 29.573433000000001,
            ),
          ),
        ),
        'UA' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 52.379580999999988,
              'lng' => 40.228580899999997,
            ),
            'southwest' => 
            array (
              'lat' => 44.386462999999999,
              'lng' => 22.137158899999999,
            ),
          ),
          'location' => 
          array (
            'lat' => 48.379432999999999,
            'lng' => 31.165579999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 52.379580999999988,
              'lng' => 40.228580899999997,
            ),
            'southwest' => 
            array (
              'lat' => 44.386462999999999,
              'lng' => 22.137158899999999,
            ),
          ),
        ),
        'AE' => false,
        'GB' => false,
        'US' => [
            'location' => [
                'lat' => 41.379816,
                'lng' => -102.498496
            ]
        ],
        'UM' => false,
        'UY' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -30.0852149,
              'lng' => -53.184292499999998,
            ),
            'southwest' => 
            array (
              'lat' => -35.031418500000001,
              'lng' => -58.439111699999998,
            ),
          ),
          'location' => 
          array (
            'lat' => -32.522779,
            'lng' => -55.765835000000003,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -30.0852149,
              'lng' => -53.184292499999998,
            ),
            'southwest' => 
            array (
              'lat' => -35.031418500000001,
              'lng' => -58.439111699999998,
            ),
          ),
        ),
        'UZ' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 45.590074999999999,
              'lng' => 73.148945999999995,
            ),
            'southwest' => 
            array (
              'lat' => 37.172257100000003,
              'lng' => 55.9982179,
            ),
          ),
          'location' => 
          array (
            'lat' => 41.377490999999999,
            'lng' => 64.585262,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 45.590074999999999,
              'lng' => 73.148945999999995,
            ),
            'southwest' => 
            array (
              'lat' => 37.172257100000003,
              'lng' => 55.9982179,
            ),
          ),
        ),
        'VU' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -13.072455400000001,
              'lng' => 170.23845969999999,
            ),
            'southwest' => 
            array (
              'lat' => -20.2522929,
              'lng' => 166.5417588,
            ),
          ),
          'location' => 
          array (
            'lat' => -15.376706,
            'lng' => 166.959158,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -13.072455400000001,
              'lng' => 168.64906310000001,
            ),
            'southwest' => 
            array (
              'lat' => -17.825971800000001,
              'lng' => 166.5417588,
            ),
          ),
        ),
        'VE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.486694099999999,
              'lng' => -59.805666000000002,
            ),
            'southwest' => 
            array (
              'lat' => 0.64752909999999997,
              'lng' => -73.351558099999991,
            ),
          ),
          'location' => 
          array (
            'lat' => 6.4237500000000001,
            'lng' => -66.589730000000003,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 12.770409000000001,
              'lng' => -59.803780000000003,
            ),
            'southwest' => 
            array (
              'lat' => 0.54381789999999997,
              'lng' => -73.425561099999996,
            ),
          ),
        ),
        'VN' => false,
        'VG' => false,
        'VI' => false,
        'WF' => false,
        'EH' => false,
        'YE' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => 18.9996331,
              'lng' => 54.533640000000013,
            ),
            'southwest' => 
            array (
              'lat' => 12.108176200000001,
              'lng' => 41.816055300000002,
            ),
          ),
          'location' => 
          array (
            'lat' => 15.552727000000001,
            'lng' => 48.516387999999999,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => 18.9996331,
              'lng' => 54.533640000000013,
            ),
            'southwest' => 
            array (
              'lat' => 12.108176200000001,
              'lng' => 41.816055300000002,
            ),
          ),
        ),
        'ZM' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -8.203284,
              'lng' => 33.709030499999997,
            ),
            'southwest' => 
            array (
              'lat' => -18.077418000000002,
              'lng' => 21.999351000000001,
            ),
          ),
          'location' => 
          array (
            'lat' => -13.133896999999999,
            'lng' => 27.849332,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -8.203284,
              'lng' => 33.709030499999997,
            ),
            'southwest' => 
            array (
              'lat' => -18.077418000000002,
              'lng' => 21.999351000000001,
            ),
          ),
        ),
        'ZW' => 
        array (
          'bounds' => 
          array (
            'northeast' => 
            array (
              'lat' => -15.609318999999999,
              'lng' => 33.068235999999999,
            ),
            'southwest' => 
            array (
              'lat' => -22.4223538,
              'lng' => 25.237368,
            ),
          ),
          'location' => 
          array (
            'lat' => -19.015438,
            'lng' => 29.154857,
          ),
          'location_type' => 'APPROXIMATE',
          'viewport' => 
          array (
            'northeast' => 
            array (
              'lat' => -15.609318999999999,
              'lng' => 33.068235999999999,
            ),
            'southwest' => 
            array (
              'lat' => -22.4223538,
              'lng' => 25.237368,
            ),
          ),
        ),
      );
}
