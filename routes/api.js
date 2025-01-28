/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {
  let books = []
  const trackId = () => {
    let count = 0;
    return () => (++count).toString();
  }
  const setId = trackId();

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      return res.json(books);
    })
    
    .post(function (req, res){
      const { title } = req.body;
      //response will contain new book object including atleast _id and title
      if(!title) return res.send("missing required field title")

      const book = {
        _id: setId(),
        title,
        commentcount: 0
      }

      books.push(book)

      return res.json(book)
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      books = [];
      return res.send("complete delete successful")
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const book = books.find(book => book._id === bookid)
      if(!book) return res.send("no book exists")
      if(!book.comments) book.comments = [];
      
      return res.json(book);
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      const book = books.find(book => book._id === bookid);
      if(!book) return res.send("no book exists")
      
      if(!comment) return res.send("missing required field comment")
      
      if (!book.comments) book.comments = [];        
      book.comments.push(comment);
      book.commentcount = book.comments.length;

      return res.json(book)
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      
      const bookIndex = books.findIndex(book => book._id === bookid);
      if (bookIndex === -1) return res.send("no book exists");

      books.splice(bookIndex, 1);

      return res.send("delete successful");
    });
  
};
