//Connect to the mongodb Database
const {MongoClient, ObjectId} = require('mongodb');

const url = "mongodb://localhost:27017";
const dbname = "TodoApp";

MongoClient.connect(url, (err, client) => {
  //Connect to TodoApp
  const db = client.db(dbname);

  //Create a Users collection
    //name - String
    //age - Number
    //grade - String

    //Explore all CRUD operations

    //create
      //insert one
    db.collection("Users").insertOne({
      name: "Andrew",
      age: 17,
      grade: "12th"
    })
    .then(response => {
      console.log(JSON.stringify(response.ops, undefined, 2));
    })
    .catch(error => {
      console.log("Error");
    })
       //insert many
    db.collection("Users").insertMany([
      {
        name: "Alexa",
        age: 14,
        grade: "9th"
      },
      {
        name: "Zach",
        age: 17,
        grade: "11th"
      },
      {
        name: "Zage",
        age: 17,
        grade: "11th"
      }
    ])
    .then(response => {
      console.log(JSON.stringify(response.ops, undefined, 2));
    })
    .catch(error => {
      console.log("Error");
    })

    //read
      //find
    db.collection('Users').find({
      age: 17
    })
      //practice using limit and without limit
    .limit(2).toArray()
    .then(response => {
      console.log(JSON.stringify(response, undefined, 2));
    })
    .catch(err => {
      console.log("Unable to write to mongodb", err);
    })
      //find and sort
      //a -z
    let mysortaz = { name: 1 };
    db.collection("Users").find().sort(mysortaz).toArray(function(err, result) {
       if (err) throw err;
       console.log(result);
    });
      //z-a
    let mysortza = { name: -1 };
    db.collection("Users").find().sort(mysortza).toArray(function(err, result) {
       if (err) throw err;
       console.log(result);
    });

    //update
      //update one
      db.collection('Users').updateOne({
        name: 'Zage'
      },
      {
        $set: {age: 16}
      })
        .then(response => {
          console.log(JSON.stringify(response, undefined, 2));
        })
        .catch(err => {
          console.log("Error");
        })

      //find one and update
      db.collection('Users').findOneAndUpdate({
        name: 'Zach'
        //Search fiter
      },
      {
        $set: {grade: "college"}
        //Setting
      },
      {
        returnOriginal: false
        //Return updated one
        //NOT ORIGINAL (one without change)
      })
        .then(response => {
          console.log(JSON.stringify(response.value, undefined, 2));
        })
        .catch(err => {
          console.log("Unable to update");
        })

      //find one and replace
      db.collection('Users').findOneAndReplace({
        name: 'Andrew'
        //Search fiter
      },
      {
        name: "Natalie",
        age: 14,
        grade: "9th"
      })
        .then(response => {
          console.log(JSON.stringify(response.value, undefined, 2));
        })
        .catch(err => {
          console.log("Unable to update");
        })

    // //delete
    //   //find one and delete
    db.collection('Users').findOneAndDelete({
      _id: new ObjectId("5aa9d50f1a44ba71544e07e6")
      // grade: "college"
    })
    .then(response => {
      console.log(JSON.stringify(response.value, undefined, 2));
    })
    .catch(err => {
      console.log("Error");
    })

  client.close();
})
