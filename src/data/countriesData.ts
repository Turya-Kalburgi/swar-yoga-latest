/**
 * Comprehensive Countries Data
 * Structure: Countries → States/Provinces → Capital Cities with Coordinates
 * Used by SwarYogaCalendar for accurate sunrise calculations
 */

export interface CapitalData {
  name: string;
  lat: number;
  lng: number;
}

export interface StateData {
  [stateName: string]: CapitalData;
}

export interface CountriesDataType {
  [countryName: string]: StateData;
}

// All countries list (200+ countries A-Z)
export const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
  'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia',
  'Fiji', 'Finland', 'France',
  'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary',
  'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan',
  'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
  'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman',
  'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
  'Qatar',
  'Romania', 'Russia', 'Rwanda',
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
  'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen',
  'Zambia', 'Zimbabwe'
];

// Comprehensive states/provinces and capital cities with coordinates for ALL countries
export const capitalsByCountry: CountriesDataType = {
  'Afghanistan': {
    'Kabul': { name: 'Kabul', lat: 34.5553, lng: 69.2075 }
  },
  'Albania': {
    'Tirana': { name: 'Tirana', lat: 41.3275, lng: 19.8187 }
  },
  'Algeria': {
    'Algiers': { name: 'Algiers', lat: 36.7538, lng: 3.0588 }
  },
  'Andorra': {
    'Andorra la Vella': { name: 'Andorra la Vella', lat: 42.5063, lng: 1.5218 }
  },
  'Angola': {
    'Luanda': { name: 'Luanda', lat: -8.8383, lng: 13.2344 }
  },
  'Argentina': {
    'Buenos Aires': { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816 }
  },
  'Armenia': {
    'Yerevan': { name: 'Yerevan', lat: 40.1792, lng: 44.5012 }
  },
  'Australia': {
    'New South Wales': { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    'Victoria': { name: 'Melbourne', lat: -37.8136, lng: 144.9631 },
    'Queensland': { name: 'Brisbane', lat: -27.4698, lng: 153.0251 },
    'Western Australia': { name: 'Perth', lat: -31.9505, lng: 115.8605 },
    'South Australia': { name: 'Adelaide', lat: -34.9285, lng: 138.6007 },
    'Tasmania': { name: 'Hobart', lat: -42.8821, lng: 147.3272 },
    'Northern Territory': { name: 'Darwin', lat: -12.4634, lng: 130.8456 },
    'Australian Capital Territory': { name: 'Canberra', lat: -35.2809, lng: 149.1300 }
  },
  'Austria': {
    'Vienna': { name: 'Vienna', lat: 48.2082, lng: 16.3738 }
  },
  'Azerbaijan': {
    'Baku': { name: 'Baku', lat: 40.3856, lng: 49.8671 }
  },
  'Bahamas': {
    'Nassau': { name: 'Nassau', lat: 25.0343, lng: -77.3963 }
  },
  'Bahrain': {
    'Manama': { name: 'Manama', lat: 26.1386, lng: 50.3557 }
  },
  'Bangladesh': {
    'Dhaka': { name: 'Dhaka', lat: 23.8103, lng: 90.4125 }
  },
  'Barbados': {
    'Bridgetown': { name: 'Bridgetown', lat: 13.1939, lng: -59.5432 }
  },
  'Belarus': {
    'Minsk': { name: 'Minsk', lat: 53.9045, lng: 27.5615 }
  },
  'Belgium': {
    'Brussels': { name: 'Brussels', lat: 50.8503, lng: 4.3517 }
  },
  'Belize': {
    'Belmopan': { name: 'Belmopan', lat: 17.2505, lng: -88.7590 }
  },
  'Benin': {
    'Porto-Novo': { name: 'Porto-Novo', lat: 6.4969, lng: 2.6289 }
  },
  'Bhutan': {
    'Thimphu': { name: 'Thimphu', lat: 27.5142, lng: 89.6432 }
  },
  'Bolivia': {
    'La Paz': { name: 'La Paz', lat: -16.5898, lng: -68.1506 }
  },
  'Bosnia and Herzegovina': {
    'Sarajevo': { name: 'Sarajevo', lat: 43.8564, lng: 18.4131 }
  },
  'Botswana': {
    'Gaborone': { name: 'Gaborone', lat: -24.6282, lng: 25.9242 }
  },
  'Brazil': {
    'Brasília': { name: 'Brasília', lat: -15.7975, lng: -47.8919 }
  },
  'Brunei': {
    'Bandar Seri Begawan': { name: 'Bandar Seri Begawan', lat: 4.8900, lng: 114.9422 }
  },
  'Bulgaria': {
    'Sofia': { name: 'Sofia', lat: 42.6977, lng: 23.3219 }
  },
  'Burkina Faso': {
    'Ouagadougou': { name: 'Ouagadougou', lat: 12.3714, lng: -1.5197 }
  },
  'Burundi': {
    'Gitega': { name: 'Gitega', lat: -3.4276, lng: 29.9299 }
  },
  'Cambodia': {
    'Phnom Penh': { name: 'Phnom Penh', lat: 11.5564, lng: 104.9282 }
  },
  'Cameroon': {
    'Yaoundé': { name: 'Yaoundé', lat: 3.8667, lng: 11.5167 }
  },
  'Canada': {
    'Alberta': { name: 'Edmonton', lat: 53.5461, lng: -113.4938 },
    'British Columbia': { name: 'Victoria', lat: 48.4761, lng: -123.3709 },
    'Manitoba': { name: 'Winnipeg', lat: 49.8951, lng: -97.1384 },
    'New Brunswick': { name: 'Fredericton', lat: 45.9636, lng: -66.6557 },
    'Newfoundland and Labrador': { name: 'St. John\'s', lat: 47.5615, lng: -52.7126 },
    'Northwest Territories': { name: 'Yellowknife', lat: 62.4561, lng: -114.3525 },
    'Nova Scotia': { name: 'Halifax', lat: 44.6426, lng: -63.2181 },
    'Nunavut': { name: 'Iqaluit', lat: 63.7467, lng: -68.5119 },
    'Ontario': { name: 'Toronto', lat: 43.6532, lng: -79.3832 },
    'Prince Edward Island': { name: 'Charlottetown', lat: 46.2382, lng: -63.1311 },
    'Quebec': { name: 'Quebec City', lat: 46.8139, lng: -71.2080 },
    'Saskatchewan': { name: 'Regina', lat: 50.4452, lng: -104.6189 },
    'Yukon': { name: 'Whitehorse', lat: 60.7212, lng: -135.0568 }
  },
  'Cape Verde': {
    'Praia': { name: 'Praia', lat: 14.9215, lng: -23.6339 }
  },
  'Central African Republic': {
    'Bangui': { name: 'Bangui', lat: 4.3947, lng: 18.5582 }
  },
  'Chad': {
    'N\'Djamena': { name: 'N\'Djamena', lat: 12.1348, lng: 15.0557 }
  },
  'Chile': {
    'Santiago': { name: 'Santiago', lat: -33.4489, lng: -70.6693 }
  },
  'China': {
    'Beijing': { name: 'Beijing', lat: 39.9042, lng: 116.4074 }
  },
  'Colombia': {
    'Bogotá': { name: 'Bogotá', lat: 4.7110, lng: -74.0721 }
  },
  'Comoros': {
    'Moroni': { name: 'Moroni', lat: -11.6869, lng: 43.3333 }
  },
  'Congo': {
    'Brazzaville': { name: 'Brazzaville', lat: -4.2634, lng: 15.2429 }
  },
  'Costa Rica': {
    'San José': { name: 'San José', lat: 9.9281, lng: -84.0907 }
  },
  'Croatia': {
    'Zagreb': { name: 'Zagreb', lat: 45.8150, lng: 16.0023 }
  },
  'Cuba': {
    'Havana': { name: 'Havana', lat: 23.1291, lng: -82.3794 }
  },
  'Cyprus': {
    'Nicosia': { name: 'Nicosia', lat: 35.1264, lng: 33.4299 }
  },
  'Czech Republic': {
    'Prague': { name: 'Prague', lat: 50.0755, lng: 14.4378 }
  },
  'Denmark': {
    'Copenhagen': { name: 'Copenhagen', lat: 55.6761, lng: 12.5683 }
  },
  'Djibouti': {
    'Djibouti City': { name: 'Djibouti City', lat: 11.5897, lng: 43.1456 }
  },
  'Dominica': {
    'Roseau': { name: 'Roseau', lat: 15.3007, lng: -61.3833 }
  },
  'Dominican Republic': {
    'Santo Domingo': { name: 'Santo Domingo', lat: 18.4861, lng: -69.9312 }
  },
  'Ecuador': {
    'Quito': { name: 'Quito', lat: -0.2299, lng: -78.5249 }
  },
  'Egypt': {
    'Cairo': { name: 'Cairo', lat: 30.0444, lng: 31.2357 }
  },
  'El Salvador': {
    'San Salvador': { name: 'San Salvador', lat: 13.7942, lng: -89.2723 }
  },
  'Equatorial Guinea': {
    'Malabo': { name: 'Malabo', lat: 3.7521, lng: 8.7737 }
  },
  'Eritrea': {
    'Asmara': { name: 'Asmara', lat: 15.3387, lng: 38.9155 }
  },
  'Estonia': {
    'Tallinn': { name: 'Tallinn', lat: 59.4370, lng: 24.7536 }
  },
  'Eswatini': {
    'Mbabane': { name: 'Mbabane', lat: -26.5225, lng: 31.1367 }
  },
  'Ethiopia': {
    'Addis Ababa': { name: 'Addis Ababa', lat: 9.0320, lng: 38.7469 }
  },
  'Fiji': {
    'Suva': { name: 'Suva', lat: -18.1248, lng: 178.4501 }
  },
  'Finland': {
    'Helsinki': { name: 'Helsinki', lat: 60.1695, lng: 24.9354 }
  },
  'France': {
    'Paris': { name: 'Paris', lat: 48.8566, lng: 2.3522 }
  },
  'Gabon': {
    'Libreville': { name: 'Libreville', lat: 0.4162, lng: 9.4673 }
  },
  'Gambia': {
    'Banjul': { name: 'Banjul', lat: 13.4549, lng: -16.5790 }
  },
  'Georgia': {
    'Tbilisi': { name: 'Tbilisi', lat: 41.7151, lng: 44.8271 }
  },
  'Germany': {
    'Berlin': { name: 'Berlin', lat: 52.5200, lng: 13.4050 }
  },
  'Ghana': {
    'Accra': { name: 'Accra', lat: 5.5527, lng: -0.2038 }
  },
  'Greece': {
    'Athens': { name: 'Athens', lat: 37.9838, lng: 23.7275 }
  },
  'Grenada': {
    'Saint George\'s': { name: 'Saint George\'s', lat: 12.0561, lng: -61.7454 }
  },
  'Guatemala': {
    'Guatemala City': { name: 'Guatemala City', lat: 14.6343, lng: -90.5069 }
  },
  'Guinea': {
    'Conakry': { name: 'Conakry', lat: 9.6412, lng: -13.5784 }
  },
  'Guinea-Bissau': {
    'Bissau': { name: 'Bissau', lat: 11.8637, lng: -15.5957 }
  },
  'Guyana': {
    'Georgetown': { name: 'Georgetown', lat: 6.8016, lng: -58.1551 }
  },
  'Haiti': {
    'Port-au-Prince': { name: 'Port-au-Prince', lat: 18.9712, lng: -72.2852 }
  },
  'Honduras': {
    'Tegucigalpa': { name: 'Tegucigalpa', lat: 14.0723, lng: -87.1921 }
  },
  'Hungary': {
    'Budapest': { name: 'Budapest', lat: 47.4979, lng: 19.0402 }
  },
  'Iceland': {
    'Reykjavik': { name: 'Reykjavik', lat: 64.1466, lng: -21.9426 }
  },
  'India': {
    'Andhra Pradesh': { name: 'Amaravati', lat: 16.5062, lng: 80.6480 },
    'Arunachal Pradesh': { name: 'Itanagar', lat: 27.0844, lng: 93.6053 },
    'Assam': { name: 'Dispur', lat: 26.1445, lng: 91.7898 },
    'Bihar': { name: 'Patna', lat: 25.5941, lng: 85.1376 },
    'Chhattisgarh': { name: 'Raipur', lat: 21.2514, lng: 81.6296 },
    'Goa': { name: 'Panaji', lat: 15.4909, lng: 73.8278 },
    'Gujarat': { name: 'Gandhinagar', lat: 23.2156, lng: 72.6369 },
    'Haryana': { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
    'Himachal Pradesh': { name: 'Shimla', lat: 31.1048, lng: 77.1734 },
    'Jharkhand': { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
    'Karnataka': { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    'Kerala': { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
    'Madhya Pradesh': { name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
    'Maharashtra': { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    'Manipur': { name: 'Imphal', lat: 24.8170, lng: 93.9368 },
    'Meghalaya': { name: 'Shillong', lat: 25.5788, lng: 91.8933 },
    'Mizoram': { name: 'Aizawl', lat: 23.7271, lng: 92.7176 },
    'Nagaland': { name: 'Kohima', lat: 25.6751, lng: 94.1086 },
    'Odisha': { name: 'Bhubaneswar', lat: 20.2961, lng: 85.8245 },
    'Punjab': { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
    'Rajasthan': { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    'Sikkim': { name: 'Gangtok', lat: 27.3389, lng: 88.6065 },
    'Tamil Nadu': { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    'Telangana': { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    'Tripura': { name: 'Agartala', lat: 23.8315, lng: 91.2868 },
    'Uttar Pradesh': { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    'Uttarakhand': { name: 'Dehradun', lat: 30.3165, lng: 78.0322 },
    'West Bengal': { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    'Delhi': { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
    'Chandigarh': { name: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
    'Puducherry': { name: 'Puducherry', lat: 12.0142, lng: 79.8047 },
    'Ladakh': { name: 'Leh', lat: 34.1526, lng: 77.5770 },
    'Jammu and Kashmir': { name: 'Srinagar', lat: 34.0837, lng: 74.7973 }
  },
  'Indonesia': {
    'Jakarta': { name: 'Jakarta', lat: -6.2088, lng: 106.8456 }
  },
  'Iran': {
    'Tehran': { name: 'Tehran', lat: 35.6892, lng: 51.3890 }
  },
  'Iraq': {
    'Baghdad': { name: 'Baghdad', lat: 33.3157, lng: 44.3661 }
  },
  'Ireland': {
    'Dublin': { name: 'Dublin', lat: 53.3498, lng: -6.2603 }
  },
  'Israel': {
    'Jerusalem': { name: 'Jerusalem', lat: 31.7683, lng: 35.2137 }
  },
  'Italy': {
    'Rome': { name: 'Rome', lat: 41.9028, lng: 12.4964 }
  },
  'Jamaica': {
    'Kingston': { name: 'Kingston', lat: 18.0179, lng: -76.8099 }
  },
  'Japan': {
    'Tokyo': { name: 'Tokyo', lat: 35.6762, lng: 139.6503 }
  },
  'Jordan': {
    'Amman': { name: 'Amman', lat: 31.9454, lng: 35.9284 }
  },
  'Kazakhstan': {
    'Nur-Sultan': { name: 'Nur-Sultan', lat: 51.1694, lng: 71.4491 }
  },
  'Kenya': {
    'Nairobi': { name: 'Nairobi', lat: -1.2865, lng: 36.8172 }
  },
  'Kiribati': {
    'Tarawa': { name: 'Tarawa', lat: 1.2921, lng: 172.9789 }
  },
  'Kosovo': {
    'Pristina': { name: 'Pristina', lat: 42.6635, lng: 21.1658 }
  },
  'Kuwait': {
    'Kuwait City': { name: 'Kuwait City', lat: 29.3759, lng: 47.9774 }
  },
  'Kyrgyzstan': {
    'Bishkek': { name: 'Bishkek', lat: 42.8746, lng: 74.5698 }
  },
  'Laos': {
    'Vientiane': { name: 'Vientiane', lat: 17.9757, lng: 102.6331 }
  },
  'Latvia': {
    'Riga': { name: 'Riga', lat: 56.9496, lng: 24.1052 }
  },
  'Lebanon': {
    'Beirut': { name: 'Beirut', lat: 33.8886, lng: 35.4955 }
  },
  'Lesotho': {
    'Maseru': { name: 'Maseru', lat: -29.6100, lng: 27.4833 }
  },
  'Liberia': {
    'Monrovia': { name: 'Monrovia', lat: 6.3156, lng: -10.8074 }
  },
  'Libya': {
    'Tripoli': { name: 'Tripoli', lat: 32.8872, lng: 13.1913 }
  },
  'Liechtenstein': {
    'Vaduz': { name: 'Vaduz', lat: 47.1411, lng: 9.5209 }
  },
  'Lithuania': {
    'Vilnius': { name: 'Vilnius', lat: 54.6872, lng: 25.2797 }
  },
  'Luxembourg': {
    'Luxembourg City': { name: 'Luxembourg City', lat: 49.6116, lng: 6.1319 }
  },
  'Madagascar': {
    'Antananarivo': { name: 'Antananarivo', lat: -18.8792, lng: 47.5079 }
  },
  'Malawi': {
    'Lilongwe': { name: 'Lilongwe', lat: -13.9634, lng: 33.7837 }
  },
  'Malaysia': {
    'Kuala Lumpur': { name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869 }
  },
  'Maldives': {
    'Malé': { name: 'Malé', lat: 4.1755, lng: 73.5093 }
  },
  'Mali': {
    'Bamako': { name: 'Bamako', lat: 12.6392, lng: -8.0029 }
  },
  'Malta': {
    'Valletta': { name: 'Valletta', lat: 35.8989, lng: 14.5146 }
  },
  'Marshall Islands': {
    'Majuro': { name: 'Majuro', lat: 7.1315, lng: 171.1845 }
  },
  'Mauritania': {
    'Nouakchott': { name: 'Nouakchott', lat: 18.0735, lng: -15.9582 }
  },
  'Mauritius': {
    'Port Louis': { name: 'Port Louis', lat: -20.1609, lng: 57.5012 }
  },
  'Mexico': {
    'Mexico City': { name: 'Mexico City', lat: 19.4326, lng: -99.1332 }
  },
  'Micronesia': {
    'Palikir': { name: 'Palikir', lat: 6.9150, lng: 158.1550 }
  },
  'Moldova': {
    'Chişinău': { name: 'Chişinău', lat: 47.4159, lng: 28.3644 }
  },
  'Monaco': {
    'Monaco': { name: 'Monaco', lat: 43.7384, lng: 7.4246 }
  },
  'Mongolia': {
    'Ulaanbaatar': { name: 'Ulaanbaatar', lat: 47.9064, lng: 106.8835 }
  },
  'Montenegro': {
    'Podgorica': { name: 'Podgorica', lat: 42.4419, lng: 19.2594 }
  },
  'Morocco': {
    'Rabat': { name: 'Rabat', lat: 34.0209, lng: -6.8416 }
  },
  'Mozambique': {
    'Maputo': { name: 'Maputo', lat: -23.8636, lng: 35.3338 }
  },
  'Myanmar': {
    'Naypyidaw': { name: 'Naypyidaw', lat: 19.7633, lng: 96.0656 }
  },
  'Namibia': {
    'Windhoek': { name: 'Windhoek', lat: -22.5597, lng: 17.0832 }
  },
  'Nauru': {
    'Yaren': { name: 'Yaren', lat: -0.5478, lng: 166.9239 }
  },
  'Nepal': {
    'Kathmandu': { name: 'Kathmandu', lat: 27.7172, lng: 85.3240 }
  },
  'Netherlands': {
    'Amsterdam': { name: 'Amsterdam', lat: 52.3676, lng: 4.9041 }
  },
  'New Zealand': {
    'Wellington': { name: 'Wellington', lat: -41.2865, lng: 174.7762 }
  },
  'Nicaragua': {
    'Managua': { name: 'Managua', lat: 12.1150, lng: -86.2362 }
  },
  'Niger': {
    'Niamey': { name: 'Niamey', lat: 13.5116, lng: 2.1257 }
  },
  'Nigeria': {
    'Abuja': { name: 'Abuja', lat: 9.0765, lng: 7.3986 }
  },
  'North Korea': {
    'Pyongyang': { name: 'Pyongyang', lat: 39.0176, lng: 125.7484 }
  },
  'North Macedonia': {
    'Skopje': { name: 'Skopje', lat: 41.9973, lng: 21.4280 }
  },
  'Norway': {
    'Oslo': { name: 'Oslo', lat: 59.9139, lng: 10.7522 }
  },
  'Oman': {
    'Muscat': { name: 'Muscat', lat: 23.6100, lng: 58.5400 }
  },
  'Pakistan': {
    'Islamabad': { name: 'Islamabad', lat: 33.6844, lng: 73.0479 }
  },
  'Palau': {
    'Ngerulmud': { name: 'Ngerulmud', lat: 7.3425, lng: 134.4839 }
  },
  'Palestine': {
    'Ramallah': { name: 'Ramallah', lat: 31.9454, lng: 35.2075 }
  },
  'Panama': {
    'Panama City': { name: 'Panama City', lat: 8.9824, lng: -79.5199 }
  },
  'Papua New Guinea': {
    'Port Moresby': { name: 'Port Moresby', lat: -9.4438, lng: 147.1803 }
  },
  'Paraguay': {
    'Asunción': { name: 'Asunción', lat: -25.2637, lng: -57.5759 }
  },
  'Peru': {
    'Lima': { name: 'Lima', lat: -12.0464, lng: -77.0428 }
  },
  'Philippines': {
    'Manila': { name: 'Manila', lat: 14.5995, lng: 120.9842 }
  },
  'Poland': {
    'Warsaw': { name: 'Warsaw', lat: 52.2297, lng: 21.0122 }
  },
  'Portugal': {
    'Lisbon': { name: 'Lisbon', lat: 38.7223, lng: -9.1393 }
  },
  'Qatar': {
    'Doha': { name: 'Doha', lat: 25.2854, lng: 51.5310 }
  },
  'Romania': {
    'Bucharest': { name: 'Bucharest', lat: 44.4268, lng: 26.1025 }
  },
  'Russia': {
    'Moscow': { name: 'Moscow', lat: 55.7558, lng: 37.6173 }
  },
  'Rwanda': {
    'Kigali': { name: 'Kigali', lat: -1.9505, lng: 30.0571 }
  },
  'Saint Kitts and Nevis': {
    'Basseterre': { name: 'Basseterre', lat: 17.3578, lng: -62.7830 }
  },
  'Saint Lucia': {
    'Castries': { name: 'Castries', lat: 14.0126, lng: -60.9781 }
  },
  'Saint Vincent and the Grenadines': {
    'Kingstown': { name: 'Kingstown', lat: 13.1619, lng: -61.2248 }
  },
  'Samoa': {
    'Apia': { name: 'Apia', lat: -13.8330, lng: -171.7373 }
  },
  'San Marino': {
    'San Marino': { name: 'San Marino', lat: 43.9424, lng: 12.4578 }
  },
  'Sao Tome and Principe': {
    'São Tomé': { name: 'São Tomé', lat: 0.3365, lng: 6.7273 }
  },
  'Saudi Arabia': {
    'Riyadh': { name: 'Riyadh', lat: 24.7136, lng: 46.6753 }
  },
  'Senegal': {
    'Dakar': { name: 'Dakar', lat: 14.7167, lng: -17.4677 }
  },
  'Serbia': {
    'Belgrade': { name: 'Belgrade', lat: 44.8176, lng: 20.4568 }
  },
  'Seychelles': {
    'Victoria': { name: 'Victoria', lat: -4.6176, lng: 55.4514 }
  },
  'Sierra Leone': {
    'Freetown': { name: 'Freetown', lat: 8.4657, lng: -13.2317 }
  },
  'Singapore': {
    'Singapore': { name: 'Singapore', lat: 1.3521, lng: 103.8198 }
  },
  'Slovakia': {
    'Bratislava': { name: 'Bratislava', lat: 48.1486, lng: 17.1077 }
  },
  'Slovenia': {
    'Ljubljana': { name: 'Ljubljana', lat: 46.0569, lng: 14.5058 }
  },
  'Solomon Islands': {
    'Honiara': { name: 'Honiara', lat: -9.4280, lng: 159.9789 }
  },
  'Somalia': {
    'Mogadishu': { name: 'Mogadishu', lat: 2.0469, lng: 45.3182 }
  },
  'South Africa': {
    'Pretoria': { name: 'Pretoria', lat: -25.7482, lng: 28.2293 }
  },
  'South Korea': {
    'Seoul': { name: 'Seoul', lat: 37.5665, lng: 126.9780 }
  },
  'South Sudan': {
    'Juba': { name: 'Juba', lat: 4.8517, lng: 31.5825 }
  },
  'Spain': {
    'Madrid': { name: 'Madrid', lat: 40.4168, lng: -3.7038 }
  },
  'Sri Lanka': {
    'Colombo': { name: 'Colombo', lat: 6.9271, lng: 80.7789 }
  },
  'Sudan': {
    'Khartoum': { name: 'Khartoum', lat: 15.5007, lng: 32.5599 }
  },
  'Suriname': {
    'Paramaribo': { name: 'Paramaribo', lat: 5.8520, lng: -58.0105 }
  },
  'Sweden': {
    'Stockholm': { name: 'Stockholm', lat: 59.3293, lng: 18.0686 }
  },
  'Switzerland': {
    'Bern': { name: 'Bern', lat: 46.9479, lng: 7.4474 }
  },
  'Syria': {
    'Damascus': { name: 'Damascus', lat: 33.5138, lng: 36.2765 }
  },
  'Taiwan': {
    'Taipei': { name: 'Taipei', lat: 25.0330, lng: 121.5654 }
  },
  'Tajikistan': {
    'Dushanbe': { name: 'Dushanbe', lat: 38.5598, lng: 68.7738 }
  },
  'Tanzania': {
    'Dar es Salaam': { name: 'Dar es Salaam', lat: -6.8000, lng: 39.2833 }
  },
  'Thailand': {
    'Bangkok': { name: 'Bangkok', lat: 13.7563, lng: 100.5018 }
  },
  'Timor-Leste': {
    'Dili': { name: 'Dili', lat: -8.5580, lng: 125.5603 }
  },
  'Togo': {
    'Lomé': { name: 'Lomé', lat: 6.1256, lng: 1.2320 }
  },
  'Tonga': {
    'Nukualofa': { name: 'Nukualofa', lat: -21.1393, lng: -175.2028 }
  },
  'Trinidad and Tobago': {
    'Port of Spain': { name: 'Port of Spain', lat: 10.6918, lng: -61.2225 }
  },
  'Tunisia': {
    'Tunis': { name: 'Tunis', lat: 36.8065, lng: 10.1686 }
  },
  'Turkey': {
    'Ankara': { name: 'Ankara', lat: 39.9334, lng: 32.8597 }
  },
  'Turkmenistan': {
    'Ashgabat': { name: 'Ashgabat', lat: 37.9601, lng: 58.3261 }
  },
  'Tuvalu': {
    'Funafuti': { name: 'Funafuti', lat: -8.5211, lng: 179.1982 }
  },
  'Uganda': {
    'Kampala': { name: 'Kampala', lat: 0.3476, lng: 32.5825 }
  },
  'Ukraine': {
    'Kyiv': { name: 'Kyiv', lat: 50.4501, lng: 30.5234 }
  },
  'United Arab Emirates': {
    'Abu Dhabi': { name: 'Abu Dhabi', lat: 24.4539, lng: 54.3773 }
  },
  'United Kingdom': {
    'England': { name: 'London', lat: 51.5074, lng: -0.1278 },
    'Scotland': { name: 'Edinburgh', lat: 55.9533, lng: -3.1883 },
    'Wales': { name: 'Cardiff', lat: 51.4816, lng: -3.1791 },
    'Northern Ireland': { name: 'Belfast', lat: 54.5973, lng: -5.9301 }
  },
  'United States': {
    'Alabama': { name: 'Montgomery', lat: 32.3617, lng: -86.2792 },
    'Alaska': { name: 'Juneau', lat: 58.3019, lng: -134.4197 },
    'Arizona': { name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
    'Arkansas': { name: 'Little Rock', lat: 34.7465, lng: -92.2896 },
    'California': { name: 'Sacramento', lat: 38.5816, lng: -121.4944 },
    'Colorado': { name: 'Denver', lat: 39.7392, lng: -104.9903 },
    'Connecticut': { name: 'Hartford', lat: 41.7658, lng: -72.6734 },
    'Delaware': { name: 'Dover', lat: 39.1612, lng: -75.5264 },
    'Florida': { name: 'Tallahassee', lat: 30.4518, lng: -84.2807 },
    'Georgia': { name: 'Atlanta', lat: 33.7490, lng: -84.3880 },
    'Hawaii': { name: 'Honolulu', lat: 21.3099, lng: -157.8581 },
    'Idaho': { name: 'Boise', lat: 43.6150, lng: -116.2023 },
    'Illinois': { name: 'Springfield', lat: 39.7817, lng: -89.6501 },
    'Indiana': { name: 'Indianapolis', lat: 39.7684, lng: -86.1581 },
    'Iowa': { name: 'Des Moines', lat: 41.5868, lng: -93.6250 },
    'Kansas': { name: 'Topeka', lat: 39.0473, lng: -95.6890 },
    'Kentucky': { name: 'Frankfort', lat: 38.2009, lng: -84.8733 },
    'Louisiana': { name: 'Baton Rouge', lat: 30.4515, lng: -91.1871 },
    'Maine': { name: 'Augusta', lat: 44.3106, lng: -69.7795 },
    'Maryland': { name: 'Annapolis', lat: 38.9784, lng: -76.5951 },
    'Massachusetts': { name: 'Boston', lat: 42.3601, lng: -71.0589 },
    'Michigan': { name: 'Lansing', lat: 42.3314, lng: -84.5467 },
    'Minnesota': { name: 'Saint Paul', lat: 44.9537, lng: -93.0900 },
    'Mississippi': { name: 'Jackson', lat: 32.2988, lng: -90.1848 },
    'Missouri': { name: 'Jefferson City', lat: 38.5767, lng: -92.1735 },
    'Montana': { name: 'Helena', lat: 46.5958, lng: -112.0362 },
    'Nebraska': { name: 'Lincoln', lat: 40.8136, lng: -96.7026 },
    'Nevada': { name: 'Carson City', lat: 39.1638, lng: -119.7674 },
    'New Hampshire': { name: 'Concord', lat: 43.2081, lng: -71.5376 },
    'New Jersey': { name: 'Trenton', lat: 40.2206, lng: -74.7565 },
    'New Mexico': { name: 'Santa Fe', lat: 35.6870, lng: -105.9378 },
    'New York': { name: 'Albany', lat: 42.6526, lng: -73.7562 },
    'North Carolina': { name: 'Raleigh', lat: 35.7796, lng: -78.6382 },
    'North Dakota': { name: 'Bismarck', lat: 46.8083, lng: -100.7837 },
    'Ohio': { name: 'Columbus', lat: 39.9612, lng: -82.9988 },
    'Oklahoma': { name: 'Oklahoma City', lat: 35.4676, lng: -97.5164 },
    'Oregon': { name: 'Salem', lat: 44.9429, lng: -123.0351 },
    'Pennsylvania': { name: 'Harrisburg', lat: 40.2732, lng: -76.8839 },
    'Rhode Island': { name: 'Providence', lat: 41.8240, lng: -71.4128 },
    'South Carolina': { name: 'Columbia', lat: 34.0000, lng: -81.0348 },
    'South Dakota': { name: 'Pierre', lat: 44.2998, lng: -100.3510 },
    'Tennessee': { name: 'Nashville', lat: 36.1627, lng: -86.7816 },
    'Texas': { name: 'Austin', lat: 30.2672, lng: -97.7431 },
    'Utah': { name: 'Salt Lake City', lat: 40.7608, lng: -111.8910 },
    'Vermont': { name: 'Montpelier', lat: 44.2601, lng: -72.5806 },
    'Virginia': { name: 'Richmond', lat: 37.5407, lng: -77.4360 },
    'Washington': { name: 'Olympia', lat: 47.0379, lng: -122.9015 },
    'West Virginia': { name: 'Charleston', lat: 38.3498, lng: -81.6326 },
    'Wisconsin': { name: 'Madison', lat: 43.0731, lng: -89.4012 },
    'Wyoming': { name: 'Cheyenne', lat: 41.1400, lng: -104.8197 }
  },
  'Uruguay': {
    'Montevideo': { name: 'Montevideo', lat: -34.9011, lng: -56.1645 }
  },
  'Uzbekistan': {
    'Tashkent': { name: 'Tashkent', lat: 41.2995, lng: 69.2401 }
  },
  'Vanuatu': {
    'Port Vila': { name: 'Port Vila', lat: -17.7412, lng: 168.3068 }
  },
  'Vatican City': {
    'Vatican City': { name: 'Vatican City', lat: 41.9029, lng: 12.4534 }
  },
  'Venezuela': {
    'Caracas': { name: 'Caracas', lat: 10.4806, lng: -66.9036 }
  },
  'Vietnam': {
    'Hanoi': { name: 'Hanoi', lat: 21.0285, lng: 105.8542 }
  },
  'Yemen': {
    'Sana\'a': { name: 'Sana\'a', lat: 15.3694, lng: 48.2255 }
  },
  'Zambia': {
    'Lusaka': { name: 'Lusaka', lat: -15.4167, lng: 28.2833 }
  },
  'Zimbabwe': {
    'Harare': { name: 'Harare', lat: -17.8252, lng: 31.0335 }
  }
};
