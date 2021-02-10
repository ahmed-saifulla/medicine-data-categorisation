const csv = require('csv-parser');
const fs = require('fs');
const results = [];

// List all categories and condition to match that in below array 
var CATEGORIES = [
    {
        CATEGORY_NAME: "CAPSULES",
        CATEGORY_CONDITIONS: ["CAPS ", " CAPS"],
        MEDICINES: []
    },
    {
        CATEGORY_NAME: "TABLETS",
        CATEGORY_CONDITIONS: ["TAB ", " TAB", "TAB.", "TABS ", " TABS", "TABS.", "TABLET ", " TABLET", "TABLET.", "TABLETS ", " TABLETS", "TABLETS."],
        MEDICINES: []
    },
    {
        CATEGORY_NAME: "OINMENT",
        CATEGORY_CONDITIONS: ["OINT "],
        MEDICINES: []
    },
]

// List key and name of all fields to be added to output CSVs
// id: input field name
// title: output field name
const OUTPUT_FIELD_HEADERS = [
    { id: 'IT_NAME', title: 'IT_NAME' },
    { id: 'IT_CODE', title: 'IT_CODE' }
]

// Reading from Input CSV 
fs.createReadStream('./csv/input.csv')
    .pipe(csv({}))
    .on('data', (data) => results.push(data))
    .on('end', () => {
        console.log('\n--------------\nTOTAL ITEMS ON SELECTED CSV : ', results.length);
        console.log('--------------\n');

        // Categorising based on condition match 
        results.forEach(RESULTS_element => {
            CATEGORIES.forEach((CATEGORIES_element, index) => {
                if (CATEGORIES_element.CATEGORY_CONDITIONS.some(el => Object.values(RESULTS_element)[0].includes(el))) {
                    CATEGORIES[index].MEDICINES.push(RESULTS_element)
                }
            });
        });

        // Printing Result and writing to individual CSVs
        CATEGORIES.forEach((CATEGORIES_element, index) => {
            console.log( CATEGORIES_element.CATEGORY_NAME, ': ', CATEGORIES_element.MEDICINES.length, '--------------\n');

            const createCsvWriter = require('csv-writer').createObjectCsvWriter;
            const csvWriter = createCsvWriter({
                path: `output/${CATEGORIES_element.CATEGORY_NAME}.csv`,
                header: OUTPUT_FIELD_HEADERS
            });

            csvWriter.writeRecords(CATEGORIES_element.MEDICINES)       // returns a promise
                .then(() => {
                    console.log(`---CSV generated for.. ${CATEGORIES_element.CATEGORY_NAME} \n`);
                });
        });
    })




