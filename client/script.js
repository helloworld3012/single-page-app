let mode = '';
let sessionid = 0;
let currentuser = 'Anonymous';
const login = document.getElementById('users');

login.addEventListener('submit', async function (event) {
  event.preventDefault();
  const data = new FormData(login);
  let username = data.get('userinput');
  const position = document.querySelector('#currentlogin');
  if (username.length === 0) {
    username = 'Anonymous';
  }
  try {
    const response = await fetch('http://127.0.0.1:8090/newuser/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username })
    });
    const result = await response.json();
    sessionid = result.userid;
    currentuser = result.username;
    position.innerHTML = 'Logged in as: ' + '<u>' + currentuser + '</u>';
    document.querySelector('#userinput').value = null;
  } catch (error) { alert('The server has gone down try again later'); }
});
const submit = document.getElementById('newpost');
// Used filereader to store base-64 encoding of images into json (easiest way as previously it would return C:/fakefilepath) - https://developer.mozilla.org/en-US/docs/Web/API/FileReader
submit.addEventListener('submit', async function (event) {
  event.preventDefault();
  const data = new FormData(submit);
  const imagedata = data.get('imageinput');
  const newcomment = data.get('commentinput');
  const position = document.querySelector('#messageboard');
  const read = new FileReader();
  read.readAsDataURL(imagedata); //Reads the data and result contains data: as a URL so I can do src=read.result for easy uploading
  read.addEventListener('load', async function () {
    let html = '';
    const newimage = read.result; // converts into base64 for storage/upload
    if (newcomment.length === 0 && newimage.length > 5) { // if no image submitted, newimage = 'data:' so newimage.length = 5
      html = `
      <div class="row pt-4">
        <h>${currentuser} posted:</h>
      </div>
      <img src="${newimage}" width="140px" height="70px" height alt="">
      `;
      try {
        await fetch('http://127.0.0.1:8090/newpost/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment: '', image: newimage, id: sessionid })
        });
      } catch (error) { alert('The server has gone down try again later'); }
    }
    if (newcomment.length !== 0 && newimage.length > 5) {
      html = `
      <div class="row pt-4">
        <h>${currentuser} posted:</h>
        <h>${newcomment}<h>
      </div>
      <img src="${newimage}" width="140px" height="70px" height alt="">
      `
      try {
        await fetch('http://127.0.0.1:8090/newpost/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment: newcomment, image: newimage, id: sessionid })
        });
      } catch (error) { alert('The server has gone down try again later'); }
    }
    if (newimage.length <= 5 && newcomment.length !== 0) {
      html = `
      <div class="row pt-4">
        <h>${currentuser} posted:</h>
        <h>${newcomment}<h>
      </div>
      `;
      try {
        await fetch('http://127.0.0.1:8090/newpost/post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment: newcomment, image: '', id: sessionid })
        });
      } catch (error) { alert('The server has gone down try again later'); }
    }
    if (mode === 'image' && newimage.length > 5) {
      html = `
      <div class="row pt-5"></div>
      <h>${currentuser} posted:</h>
      <img src=${newimage} width="140px" height="70px" height alt="">
      `;
    }
    if (mode === 'text' && newcomment.length !== 0) {
      html = `
      <div class="row pt-4">
        <h>${currentuser} posted:</h>
        <h>${newcomment}<h>
      </div>
      `;
    }
    if ((mode === 'text' && newcomment.length === 0) || (mode === 'image' && newimage.length <= 5)) {
      html = undefined;
    }
    if (html !== undefined) {
      position.insertAdjacentHTML('afterbegin', html); //used as before i would have to keep creating elements then updating them then .innerHTML - https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
    }
  });
  document.querySelector('#imageinput').value = null;
  document.querySelector('#commentinput').value = null;
});
const lookup = document.getElementById('individual');

lookup.addEventListener('submit', async function (event) {
  event.preventDefault();
  let answer = '';
  let html = '';
  let totalcount = '';
  let i = 0;
  const data = new FormData(lookup);
  const params = new URLSearchParams(data);
  const messagedata = data.get('individualmessage');
  if (messagedata.includes('user:') === true) { // https://www.w3schools.com/jsref/jsref_includes.asp
    try {
      const response = await fetch('http://127.0.0.1:8090/user/lookup?' + params);
      answer = await response.json();
    } catch (error) { alert('The server has gone down try again later'); }
  }
  if (messagedata.length !== 0 && messagedata.includes('user:') === false) {
    try {
      const response = await fetch('http://127.0.0.1:8090/message/lookup?' + params);
      answer = await response.json();
    } catch (error) { alert('The server has gone down try again later'); }
  }
  if (messagedata.length === 0) {
    answer = ['Flag'];
  }
  const position = document.querySelector('#lookupmessages');
  position.innerHTML = '';
  let count = 0;
  if (answer.length === 0) {
    html = `
    <div class="row pb-5">
      <h><b>No matching messages</b></h>
    </div>
    `;
    position.insertAdjacentHTML('beforeend', html);
  }
  if (answer[0] !== 'Flag') {
    for (i in answer) {
      if (answer[i][1] === 'comment' && answer[i][2].length !== 0) {
        count++;
        html = `
        <div class="row pb-5">
            <li>
            <h>${answer[i][3]} posted:</h>
            <h><b>${answer[i][0]}</b></h>
            <img src=${answer[i][2]} width="140px" height="70px" height alt="">
            </li>
          </div>
        `;
      } else {
        count++;
        html = `
        <div class="row pb-5">
            <li>
            <h>${answer[i][3]} posted:</h>
            <h><b>${answer[i][0]}</b></h>
            </li>
          </div>
        `;
      }
      position.insertAdjacentHTML('beforeend', html);
    }
    if (count === 1) {
      totalcount = `
      <div class="pb-3">
        <h>Found <b>${count}</b> result</h>
      </div>
      `;
    } else {
      totalcount = `
      <div class="pb-3">
        <h>Found <b>${count}</b> results</h>
      </div>
      `;
    }
    position.insertAdjacentHTML('afterbegin', totalcount);
  }
});

const listallusers = document.getElementById('userlist');

listallusers.addEventListener('click', async function () {
  try {
    const response = await fetch('http://127.0.0.1:8090/users/list');
    const users = await response.json();
    alert('All known users are: ' + users);
  } catch (error) { alert('The server has gone down try again later'); }
});

const button = document.getElementById('loadmessages');

button.addEventListener('click', async function () {
  mode = 'all';
  let id = '';
  let html = '';
  try {
    const response = await fetch('http://127.0.0.1:8090/messageboard/load/');
    const messages = await response.json();
    const position = document.querySelector('#messageboard');
    position.innerHTML = '';
    for (let j = messages.posts.length - 1; j >= 0; j--) {
      id = messages.posts[j].id;
      if (messages.posts[j].image.length > 5 && messages.posts[j].comment.length !== 0) {
        html = `
        <div class="row">
          <h>${messages.users[id].name} posted:</h>
          <h>${messages.posts[j].comment}</h>
        </div>
        <img src="${messages.posts[j].image}" width="140px" height="70px" height alt="">
        <div class="row pb-5">
        </div>
        `;
      }
      if (messages.posts[j].image.length <= 5 && messages.posts[j].comment.length !== 0) {
        html = `
        <div class="row">
          <h>${messages.users[id].name} posted:</h>
        </div>
        <div class="row pb-5">
          <h>${messages.posts[j].comment}</h>
        </div>
        `;
      }
      if (messages.posts[j].image.length > 5 && messages.posts[j].comment.length === 0) {
        html = `
        <div class="row">
          <h>${messages.users[id].name} posted:</h>
        </div>
        <img src="${messages.posts[j].image}" width="140px" height="70px" height alt="">
        <div class="row pb-5">
        </div>
        `;
      }
      position.insertAdjacentHTML('beforeend', html);
    }
  } catch (error) { alert('The server has gone down try again later'); }
});

const button2 = document.getElementById('textonly');

button2.addEventListener('click', async function () {
  mode = 'text';
  try {
    const response = await fetch('http://127.0.0.1:8090/messageboard/textonly/');
    const messages = await response.json();
    const position = document.querySelector('#messageboard');
    position.innerHTML = '';
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i][0].length !== 0) {
        const html = `
        <div class="row pb-5">
          <h>${messages[i][1]} posted:</h>
          <h>${messages[i][0]}</h>
        </div>
        `;
        position.insertAdjacentHTML('beforeend', html);
      }
    }
  } catch (error) { alert('The server has gone down try again later'); }
});

const button3 = document.getElementById('imageonly');
button3.addEventListener('click', async function () {
  mode = 'image';
  try {
    const response = await fetch('http://127.0.0.1:8090/messageboard/imageonly/');
    const messages = await response.json();
    const position = document.querySelector('#messageboard');
    position.innerHTML = '';
    for (let j = messages.length - 1; j >= 0; j--) {
      if (messages[j][0].length !== 0) {
        const html = `
          <div class="row pt-5"></div>
          <h>${messages[j][1]} posted:</h>
          <img src="${messages[j][0]}" width="140px" height="70px" height alt="">
          `;
        position.insertAdjacentHTML('beforeend', html);
      }
    }
  } catch (error) { alert('The server has gone down try again later'); }
});
