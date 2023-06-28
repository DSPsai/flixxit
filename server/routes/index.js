var express = require('express');
const { Content, User } = require('../database/mongo_connection');
const { checkAuth } = require('../global_functions/content');
var app = express.Router();

/* GET home page. */
app.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



app.get('/content', (req, res) => {
  Content.find()
    .then((content) => {
      const userId = checkAuth(req, res)
      if (userId != "") {
        console.log('found user id ', userId)
        User.findById(userId).then(user => {
          const wishlist = user.wishlist
          const recentlyWatched = user.recentlyWatched

          const res_wishlist = []
          const res_recentlyWatched = []

          // find the lists ids in the content
          for (let i of content) {
            if (i._id in wishlist) {
              res_wishlist.push(i)
            } else if (i._id in recentlyWatched) {
              res_recentlyWatched.push(i)
            }
          }

          res.json({ content: content, wishlist: res_wishlist, recentlyWatched: res_recentlyWatched });
        }).catch(err => {
          res.json({ content: content, error: 'token expired' });
        })
      } else {
        res.json({ content: content });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ error: 'An error occurred while fetching content' });
    });
});

app.get('/content/:contentId', (req, res) => {
  const { contentId } = req.params;

  Content.findById(contentId)
    .then((content) => {
      if (content) {
        res.json(content);
      } else {
        res.status(404).json({ error: 'Content not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while fetching the content' });
    });
});


// Create Content
app.post('/content', (req, res) => {
  // console.log('got a request')
  // console.log(req.body)
  let { poster, title, rating, genre, releaseDate, description, cast, videoUrl, intro_skip } = req.body;
  releaseDate = new Date(releaseDate)

  // Create a new content
  const newContent = new Content({
    poster,
    title,
    rating,
    genre,
    releaseDate,
    description,
    cast,
    videoUrl,
    intro_skip
  });

  // Save the content to the database
  newContent.save()
    .then(() => {
      res.status(201).json({ message: 'Content created successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred while creating the content' });
    });
});

module.exports = app;
