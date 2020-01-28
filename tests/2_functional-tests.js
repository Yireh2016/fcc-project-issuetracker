/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var { assert } = chai;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("POST /api/issues/{project} => object with issue data", function() {
    test("Required fields filled in", function(done) {
      chai
        .request(server)
        .post(`/api/issues/test`)
        .send({
          issue_title: "Required",
          issue_text: "Required fields filled in",
          created_by: "chai"
        })
        .end((err, res) => {
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });
    test("Every field filled in", function(done) {
      chai
        .request(server)
        .post(`/api/issues/test`)
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Chai_1",
          assigned_to: "Mocha_1",
          status_text: "open"
        })
        .end(function(err, res) {
          // console.log("res body", res.body);
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "text");
          assert.equal(res.body.created_by, "Chai_1");
          assert.equal(res.body.assigned_to, "Mocha_1");
          assert.equal(res.body.status_text, "open");
          // assert(/^[0-9abcdef]{24}$/.test(res.body._id), "_id exists");
          const now = new Date();
          const nowObj = {
            day: now.getDay(),
            month: now.getMonth(),
            year: now.getFullYear()
          };
          const createdFromDb = new Date(res.body.created_on);
          const createdObj = {
            day: createdFromDb.getDay(),
            month: createdFromDb.getMonth(),
            year: createdFromDb.getFullYear()
          };
          assert.equal(createdObj.day, nowObj.day);
          assert.equal(createdObj.month, nowObj.month);
          assert.equal(createdObj.year, nowObj.year);
          //updated_on
          const updatedFromDb = new Date(res.body.updated_on);
          const updatedObj = {
            day: updatedFromDb.getDay(),
            month: updatedFromDb.getMonth(),
            year: updatedFromDb.getFullYear()
          };
          assert.equal(updatedObj.day, nowObj.day);
          assert.equal(updatedObj.month, nowObj.month);
          assert.equal(updatedObj.year, nowObj.year);
          //fill me in too!
          done();
        });
    });
    test("Missing required fields", function(done) {
      chai
        .request(server)
        .post(`/api/issues/test`)
        .send({
          issue_title: "",
          issue_text: "",
          created_by: ""
        })
        .end((err, res) => {
          assert.equal(res.body, "missing inputs");
          done();
        });
    });
  });

  suite("PUT /api/issues/{project} => text", function() {
    test("No body", function(done) {
      chai
        .request(server)
        .put(`/api/issues/test`)
        .send({})
        .end((err, res) => {
          assert.equal(res.body, "no updated field sent");
          done();
        });
    });

    test("One field to update", function(done) {
      
      const date = new Date();
      chai
        .request(server)
        .post(`/api/issues/test`)
        .send({
          _id: date.getTime().toString(),
          issue_title: "No actualizado",
          issue_text: "Creadno para actualizar UNO",
          created_by: "Jainer",
          assigned_to: "Mocha_0",
          status_text: "open"
        })
        .end((err, res) => {
          if (err) {
            console.log({
              error: "no se pudo guardar doc para probar el update" 
            });
          }

          const _id = res.body._id;
          chai
            .request(server)
            .put(`/api/issues/test`)
            .send({
              _id,
              issue_title: "Updtated Title",
            })
            .end((err, res) => {
              if (err) {
                console.log({
                  error: "no se pudo actualizar",
                  err: JSON.stringify(err)
                });
              }
              assert.equal(res.body, "successfully updated");
              done();
            });
        });
      
      
      // chai
      //   .request(server)
      //   .put(`/api/issues/test`)
      //   .send({
      //     _id: "5e1e7b13418dda053b63336a",
      //     issue_title: "Updtated Title2"
      //   })
      //   .end((err, res) => {
      //     assert.equal(res.body, "successfully updated");
      //     done();
      //   });
    });

    test("Multiple fields to update", function(done) {
      const date = new Date();
      chai
        .request(server)
        .post(`/api/issues/test`)
        .send({
          _id: date.getTime().toString(),
          issue_title: "No actualizado",
          issue_text: "Creadno para actualizar",
          created_by: "Jainer",
          assigned_to: "Mocha_1",
          status_text: "open"
        })
        .end((err, res) => {
          if (err) {
            console.log({
              error: "no se pudo guardar doc para probar el update" 
            });
          }

          const _id = res.body._id;
          chai
            .request(server)
            .put(`/api/issues/test`)
            .send({
              _id,
              issue_title: "Updtated Title",
              issue_text: "text",
              created_by: "Chai_1",
              assigned_to: "Mocha_1",
              status_text: "close"
            })
            .end((err, res) => {
              if (err) {
                console.log({
                  error: "no se pudo actualizar",
                  err: JSON.stringify(err)
                });
              }
              assert.equal(res.body, "successfully updated");
              done();
            });
        });
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function() {
      
      test("No filter", function(done) {
        
        //insert data into de db
        const date = new Date();
        chai
          .request(server)
          .post(`/api/issues/test`)
          .send({
            _id: date.getTime().toString(),
            issue_title: "Data to Get test",
            issue_text: "Creadno para leer",
            created_by: "Jainer",
            assigned_to: "Mocha_triple",
            status_text: "open"
          }).end((err)=>{
          
          if(err){
            console.log("error on posting data",err)
            done()
          }
           
        chai
          .request(server)
          .get(`/api/issues/test`)
          .query({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
          
          
        })

       
      });

      test("One filter", function(done) {
        
        
        //insert data into de db
        const date = new Date();
        chai
          .request(server)
          .post(`/api/issues/test`)
          .send({
            _id: date.getTime().toString(),
            issue_title: `Data to Get test${date.getTime().toString()}`,
            issue_text: "Creadno para leer",
            created_by: "Jainer",
            assigned_to: "Mocha_triple ",
            status_text: "open"
          }).end((err)=>{
          
          if(err)done()
               chai
            .request(server)
            .get(`/api/issues/test`)
            .query({issue_title:`Data to Get test${date.getTime().toString()}`})
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.isArray(res.body);
              assert.property(res.body[0], "issue_title");
              done();
            });
          
          
        })
        
        
        
        
      });

      test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
        
        const date = new Date();

        const filter={
            _id: date.getTime().toString(),
            issue_title: `Data to Get test${date.getTime().toString()}`,
            issue_text: "Creadno para leer",
            created_by: "Jainer",
            assigned_to: "Mocha_triple ",
            status_text: "open"
          }
        
          //insert data into de db
          chai
            .request(server)
            .post(`/api/issues/test`)
            .send(filter).end((err)=>{

            if(err)done();

                 chai
              .request(server)
              .get(`/api/issues/test`)
              .query(filter)
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.property(res.body[0], "issue_title");
                done();
              });


        });
        
        
      })
        
    }
  );

  suite("DELETE /api/issues/{project} => text", function() {
    test("No _id", function(done) {
      chai
        .request(server)
        .delete(`/api/issues/test`)
        .send()
        .end((err, res) => {
          if (err) {
            console.log({ error: "hubo error enviando DELETE" });
          }
          assert.equal(res.body, "_id error");
          done();
        });
    });
    
    test("Valid _id", function(done) {
      const date = new Date();
      chai
        .request(server)
        .post(`/api/issues/test`)
        .send({
          _id: date.getTime().toString(),
          issue_title: "No eliminado",
          issue_text: "Creadno para eliminar",
          created_by: "Jainer",
          assigned_to: "Mocha_",
          status_text: "open"
        })
        .end((err, res) => {
          if (err) {
            console.log({
              error: "no se pudo guardar doc para probar la eliminacion"
            });
            done();
          }
          const _id = res.body._id;
          console.log("typeof res.body._id ", typeof _id);
          console.log(" res.body._id", _id);
          chai
            .request(server)
            .delete(`/api/issues/test`)
            .send({
              _id
            })
            .end((err, res) => {
              if (err) {
                console.log({ error: "no se pudo borrar" });
                done();
              }
              assert.equal(res.body, "deleted " + _id);
              done();
            });
        });
    });
  });
});
