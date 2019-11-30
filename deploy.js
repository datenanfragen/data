const fs = require('fs');
const crypto = require('crypto');
const msgpack = require('@ygoe/msgpack');
const request = require('request');

const XAPIAND_URL = 'http://127.0.0.1:8080/';

function upload(err, files) {
  const restore_timestamp = Date.now();
  let companies = [];

  files.forEach((file, index) => {
      console.log(file);
      let c = JSON.parse(fs.readFileSync(database_directory + '/' + file));

      c._id = c.slug;
      c.restore_timestamp = restore_timestamp; // This is a trick to recognize restores so that we can delete old records.

      companies.push(c);
  });

  const content_buffer = Buffer.from(msgpack.serialize(companies));

  const options = {
    uri: XAPIAND_URL + index + '/',
    method: 'RESTORE',
    encoding: 'utf-8',
    headers: {
      'Content-Type': 'application/x-msgpack; charset=utf-8',
      'Content-Length': content_buffer.length,
      'Accept': '*/*'
    },
    body: content_buffer
  } 

  request(options, (error, response, body) => {
    if(response && response.statusCode == 200) {
      // Wait for the changes to apply before deleting (there is no other way to find out if they already did)
      setTimeout(() => {collect_garbage(index, restore_timestamp)}, 5000)
    } 
    if(error) console.error('error:', error); // Print the error if one occurred
  });
}

function collect_garbage(index, latest_restore) {
  request({
    uri: XAPIAND_URL + index + '/',
    method: 'SEARCH',
    encoding: 'utf-8',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      _query: {
        _not: [{
          restore_timestamp: latest_restore
        }]
      },
      _limit: -1
    })
  }, 
  (error, response, body) => {
    if(response && response.statusCode == 200) {
      const entries = JSON.parse(response.body)
      entries['hits'].forEach(entry => {
        console.log('Deleting entry: ' + entry['_id']);
        delete_entry(index, entry['_id'], entry['_version']);
      });
    } else {
      if(error) console.error('error:', error); // Print the error if one occurred
    }
  });
}

function delete_entry(index, id, version = null) {
  request({
    uri: XAPIAND_URL + index + '/' + id + (version ? '?version=' + version : ''),
    method: 'DELETE',
    encoding: 'utf-8',
    headers: {
      'Accept': 'application/json'
    },
    body: ''
  },
  (error, response, body) => {
    if(response) {
      switch(response.statusCode) {
        case 409:
          console.error('Conflict error: Versions mismatch. Maybe the record changed during deleting?');
          break;
        case 204:
          console.log('Deleted entry: ' + id);
          break;
      }
    } else {
      if(error) console.error('error:', error); // Print the error if one occurred
    }
  });
}

// Execution
const database_directory = process.argv[2];
const index = process.argv[3];

fs.readdir(database_directory, upload);

