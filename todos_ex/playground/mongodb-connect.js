const {MongoClient, ObjectId} = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;
//Pulls out the client

// Connection URL
const url = 'mongodb://localhost:27017'

// Database Name
const dbName = 'TodoApp';

// Use connect method to connect to the server
//Take 2 args: Url created above and a callback
//client yields you back the actually client you are talking with
MongoClient.connect(url, (err, client) => {
  if(err) {
    return console.log("Unable to connect to mongodb.");
  }
  //Connect to database --> give name, will create and then
  //connect to a database if it is not created yet
  const db = client.db(dbName);
  //Returns a databse object (the databse it is talking too)

  //From database, pull out the given database
  db.collection('Todos')

  //Insert one returns a promise
  //Insert
    //InsertOne
    //insertMany
  //
  // db.collection('Todos').insertMany([
  //   //Takes an array
  //   {
  //     text: 'hike',
  //     completed: false
  //   },
  //   {
  //     text: 'play basketball',
  //     completed: true
  //   }
  // ])
  // .then(response => {
  //   console.log(JSON.stringify(response.ops, undefined, 2));
  // })
  // .catch(err => {
  //   console.log("Unable to write to mongodb", err);
  // })
  // , err => {
  //   //Another way to do .catch
  // })


  //Find
    //Returns a cursor --> turns it into an array
    //Can put restrictions on find
    //Can also limit the amount of responses you want
  // db.collection('Todos').find({
  //     _id: new ObjectId("5aa97dd231a4fa622d0374bc")
  // })
  //    .limit(3).toArray()
  //   .then(response => {
  //     console.log(JSON.stringify(response, undefined, 2));
  //   })
  //   .catch(err => {
  //     console.log("Unable to write to mongodb", err);
  //   })
    //~Many other methods related to this~
    //findOne

  //Update
    //updateOne
      //First arg is filter, second is the change you want to make
      //using $set operator

      // db.collection('Todos').updateOne({
      //   text: 'eat lunch'
      // },
      // {
      //   $set: {completed: true}
      // })
      //   .then(response => {
      //     console.log(JSON.stringify(response, undefined, 2));
      //   })
      //   .catch(err => {
      //     console.log("Unable to update");
      //   })

      // db.collection('Todos').findOneAndUpdate({
      //   text: 'eat lunch'
      //   //Search fiter
      // },
      // {
      //   $set: {completed: false}
      //   //Setting
      // },
      // {
      //   returnOriginal: false
      //   //Return updated one
      //   //NOT ORIGINAL (one without change)
      // })
      //   .then(response => {
      //     console.log(JSON.stringify(response.value, undefined, 2));
      //   })
      //   .catch(err => {
      //     console.log("Unable to update");
      //   })

//~can use find one a update/delete~

  //Delete --> find one and delete and replace/update
  // db.collection('Todos').findOneAndDelete({
  //   _id: new ObjectId("5aa97eede4519762d81b0239")
  // })
  // .then(response => {
  //   console.log(JSON.stringify(response.value, undefined, 2));
  // })
  // .catch(err => {
  //   console.log("Unable to write to mongodb", err);
  // })

  //If you dont call 'client.close()' your program will run indefinitely
  //So you have to actually close the connection, so it exits and stops
  client.close();
})
