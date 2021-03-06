const cron = require('node-cron');
const pool = require('../database');


  cron.schedule('0 14 1,15 1-12 *', async() =>  {

    var emails = await pool.query('SELECT email FROM usuarios');
    var array = JSON.parse(JSON.stringify(emails))
  
    for (let i=0; i < array.length; i++) {
        
        console.log("enviando email a "+array[i].email)
        
      }


      });
