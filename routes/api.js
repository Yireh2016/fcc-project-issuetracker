/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectID = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app,db) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
    
          const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;
    
    const posibleQuery={     _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text}
    
    const query={}
    for(const prop in posibleQuery){
      if(posibleQuery[prop]){
        query[prop]=posibleQuery[prop]
      }
    }
    console.log("final query",query)
    
      let dbTest = db.db("fcc");

      dbTest.collection("issues").find(query).toArray((err, docs) => {
      if(err){
        console.log("error on GET",err)
        return
      }
        console.log("docs on GET",docs,query)
        if(docs.length >0){
          res.json(docs)
        }
      })
    })
    
     .post(function(req, res) {
      var project = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        updated_on
      } = req.body;

      /*
       issue_title, issue_text, created_by
      
      */
      if (!issue_title || !issue_text || !created_by) {
        res.json("missing inputs");
        return;
      }
      const now = new Date();
      const objToInsert = {
        _id,
        issue_title,
        issue_text,
        created_by,
        created_on: now,
        updated_on: now,
        open: true,
        assigned_to: assigned_to ? assigned_to : "",
        status_text: status_text ? status_text : ""
      };
      let dbTest = db.db("fcc");

      dbTest.collection("issues").insertOne(objToInsert, (err, doc) => {
        if (err || !doc) {
          console.log("err insertOne ", objToInsert, err);
          res.json({ error: err });
          return;
        }

        let {
          _id,
          issue_title,
          issue_text,
          created_by,
          created_on,
          updated_on,
          open,
          assigned_to,
          status_text
        } = doc.ops[0];

        const result = {
          _id,
          issue_title,
          issue_text,
          created_by,
          created_on,
          updated_on,
          open: open === true ? "open" : "close",
          assigned_to,
          status_text
        };

        console.log("result al crear", typeof result._id);

        res.json(result);
      });
    })
    
     .put(function(req, res) {
      var project = req.params.project;
      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        _id,
        created_on,
        open
      } = req.body;

      const updated_on = new Date();

      const issue = {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        created_on,
        updated_on,
        open
      };

      const issueToUpdate = {};
      let cont = 0;
      for (const key in issue) {
        if (issue[key]) {
          issueToUpdate[key] = issue[key];
          cont++;
        }
      }


      if (cont === 1) {
        res.json("no updated field sent");
        console.log("no updated field sent");

        return;
      }

      if (!_id) {
        res.json("could not update");
        console.log("could not update");

        return;
      }

    
    

  
      const newvalues = { ...issueToUpdate };

      console.log("updating...", _id, newvalues);
      let dbTest = db.db("fcc");
      dbTest.collection("issues").updateOne({_id}, newvalues, function(
        err,
        doc
      ) {
        if (err) {
          console.log("error updateOne ", err);
          res.json("could not update " + _id);
          return;
        }

        console.log("updated doc ", JSON.stringify(doc));
        if (doc.modifiedCount > 0) {
          res.json("successfully updated");
          return;
        }
        res.json("could not update " + _id);
      });
    })
    
    .delete(function (req, res){
      var project = req.params.project;
    const {
        _id,
      } = req.body;
    
    if(!_id){
      res.json('_id error')
    }

    let dbTest = db.db("fcc");
    dbTest.collection("issues").deleteOne({_id},(err,doc)=>{
      if(err){
        //error al borrar
        res.json('could not delete '+_id)
        return
      }      
      
      if(doc.deletedCount > 0 ){
        //borro
        res.json('deleted '+_id)
        return
      }
      //no borro nada
      res.json('could not delete '+_id)
    })
    
    
    });
    
};
