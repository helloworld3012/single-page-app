const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.static('client'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
const messages = require('./client/data.json');
const posts = messages.posts;
let i = 0;

app.get('/messageboard/load', function (req, resp) {
  resp.json(messages);
});

app.get('/messageboard/posts', function (req, resp) {
  resp.json(posts);
});

app.get('/messageboard/textonly', function (req, resp) {
  const comments = [];
  for (i in posts) {
    comments.push([posts[i].comment, messages.users[posts[i].id].name]);
  }
  resp.json(comments);
});

app.get('/messageboard/imageonly', function (req, resp) {
  const images = [];
  for (i in posts) {
    images.push([posts[i].image, messages.users[posts[i].id].name]);
  }
  resp.json(images);
});
app.get('/user/lookup', function (req, resp) {
  const query = req.query.individualmessage;
  if (query === undefined) {
    throw new Error('INCORRECT QUERY'); // https://expressjs.com/en/guide/error-handling.html
  }
  const answers = [];
  let username = '';
  let register = false;
  let position = -1;
  for (i in query) {
    if (register === true) {
      username = username + query[i];
    }
    if (query[i] === ':') {
      register = true;
    }
  }
  for (i in messages.users) {
    if (username === messages.users[i].name) {
      position = i;
    }
  }
  if (position !== -1) {
    for (i in posts) {
      if (Number(posts[i].id) === Number(position)) {
        answers.push([posts[i].comment, 'comment', posts[i].image, username]);
      }
    }
  }
  resp.json(answers);
});
app.get('/users/list', function (req, resp) {
  const answers = [];
  for (i in messages.users) {
    answers.push(messages.users[i].name);
  }
  resp.json(answers);
});
app.get('/message/lookup', function (req, resp) {
  const query = req.query.individualmessage;
  if (query === undefined) {
    throw new Error('INCORRECT QUERY');
  }
  const answers = [];
  for (i in posts) {
    if (posts[i].comment === query && query.length !== 0) {
      answers.push([query, 'comment', posts[i].image, messages.users[posts[i].id].name]);
    }
  }
  resp.json(answers);
});

app.post('/newpost/post', function (req, resp) {
  const newpost = req.body;
  if (req.body.comment === undefined || req.body.image === undefined || req.body.id === undefined) {
    throw new Error('INVALID BODY');
  }
  messages.posts.push(newpost);
  fs.writeFileSync('./client/data.json', JSON.stringify(messages));
  resp.json(messages.posts);
});

app.post('/newuser/add', function (req, resp) {
  const username = req.body.name;
  if (req.body.name === undefined) {
    throw new Error('INVALID BODY');
  }
  let userid = 0;
  for (i in messages.users) {
    if (messages.users[i].name === username) {
      userid = messages.users[i].id;
    }
  }
  if (userid === 0 && username !== 'Anonymous') {
    userid = messages.users.length;
    messages.users.push({ name: username, id: userid });
    fs.writeFileSync('./client/data.json', JSON.stringify(messages));
  }
  resp.json({ userid, username });
});

module.exports = app;
