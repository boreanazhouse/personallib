const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  let bookId; // Store a book ID for use in later tests

  suite('Routing tests', function () {
    suite('POST /api/books with title => create book object/expect book object', function () {
      
      test('Test POST /api/books with title', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .send({ title: 'Test Book' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.equal(res.body.title, 'Test Book');
            bookId = res.body._id; // Save the book ID for later tests
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai
          .request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
    });

    suite('GET /api/books => array of books', function () {
      
      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get('/api/books')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'Response should be an array');
            if (res.body.length > 0) {
              assert.property(res.body[0], '_id');
              assert.property(res.body[0], 'title');
              assert.property(res.body[0], 'commentcount');
            }
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {
      
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get('/api/books/invalidid')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${bookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            assert.equal(res.body._id, bookId);
            done();
          });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function () {
      
      test('Test POST /api/books/[id] with comment', function (done) {
        chai
          .request(server)
          .post(`/api/books/${bookId}`)
          .send({ comment: 'Great book!' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.include(res.body.comments, 'Great book!');
            assert.equal(res.body._id, bookId);
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function (done) {
        chai
          .request(server)
          .post(`/api/books/${bookId}`)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai
          .request(server)
          .post('/api/books/invalidid')
          .send({ comment: 'Invalid book' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function () {

      test('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .delete(`/api/books/${bookId}`)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .delete('/api/books/invalidid')
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
    });
  });
});