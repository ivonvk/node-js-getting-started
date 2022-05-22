const db = require("./db");

 async function demo() {

    let result = db.getdata('abc');

    return result ;
  }
  
  
  module.exports = {demo}