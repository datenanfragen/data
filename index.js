const fs = require('fs');
const crypto = require('crypto');
const msgpack = require('@ygoe/msgpack');
const request = require('request');

const restore_timestamp = Date.now();
const database_directory = process.argv[2];
const index = process.argv[3];

fs.readdir(database_directory, upload);

function upload(err, files) {
    let companies = [];

    files.forEach(function(file, index) {
        console.log(file);
        let c = JSON.parse(fs.readFileSync(process.argv[2] + '/' + file));

        c._id = c.slug;
        c.restore_timestamp = restore_timestamp; // This is a trick to recognize restores so that we can delete old records.

        companies.push(c);
    });

    const content_buffer = Buffer.from(msgpack.serialize(companies));

    console.log(content_buffer);

    const options = {
      uri: 'http://127.0.0.1:8880/' + index,
      method: 'RESTORE',
      encoding: 'utf-8',
      headers: {
        'Content-Type': 'application/x-msgpack; charset=utf-8',
        'Content-Length': content_buffer.length,
        'Accept': '*/*'
      },
      body: content_buffer
    } 

    request(options, function (error, response, body) {
      console.error('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
    });
}
