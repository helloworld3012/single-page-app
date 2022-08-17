
'use strict';

const request = require('supertest');
const app = require('./app');

describe('Tests', () => {
    test('GET /messageboard/load succeeds', () => {
        return request(app)
	    .get('/messageboard/load')
	    .expect(200);
    });

    test('GET /messageboard/load returns JSON', () => {
        return request(app)
	    .get('/messageboard/load')
	    .expect('Content-type', /json/);
    });

    test('GET /messageboard/posts succeeds', () => {
        return request(app)
	    .get('/messageboard/posts')
	    .expect(200);
    });

    test('GET /messageboard/posts returns JSON', () => {
        return request(app)
	    .get('/messageboard/posts')
	    .expect('Content-type', /json/);
    });

    test('GET /messageboard/textonly succeeds', () => {
        return request(app)
	    .get('/messageboard/textonly')
	    .expect(200);
    });

    test('GET /messageboard/textonly returns JSON', () => {
        return request(app)
	    .get('/messageboard/textonly')
	    .expect('Content-type', /json/);
    });

    test('GET /messageboard/imageonly succeeds', () => {
        return request(app)
	    .get('/messageboard/imageonly')
	    .expect(200);
    });

    test('GET /messageboard/imageonly returns JSON', () => {
        return request(app)
	    .get('/messageboard/imageonly')
	    .expect('Content-type', /json/);
    });

    test('GET /user/lookup fails without a correct query', () => {
        return request(app)
	    .get('/user/lookup?')
	    .expect(500);
    });

    test('GET /user/lookup succeeds with a correct query', () => {
        return request(app)
	    .get('/user/lookup?individualmessage=user:Anonymous')
	    .expect(200);
    });

    test('GET /user/lookup returns JSON', () => {
        return request(app)
	    .get('/user/lookup?individualmessage=user:Anonymous')
	    .expect('Content-type', /json/);
    });

    test('GET /users/list succeeds', () => {
        return request(app)
	    .get('/users/list')
	    .expect(200);
    });

    test('GET /users/list returns JSON', () => {
        return request(app)
	    .get('/users/list')
	    .expect('Content-type', /json/);
    });

    test('GET /message/lookup fails without a correct query', () => {
        return request(app)
	    .get('/message/lookup?')
	    .expect(500);
    });

    test('GET /message/lookup succeeds with a correct query', () => {
        return request(app)
	    .get('/message/lookup?individualmessage=test')
	    .expect(200);
    });

    test('GET /message/lookup returns JSON with a correct query', () => {
        return request(app)
	    .get('/message/lookup?individualmessage=test')
	    .expect('Content-type', /json/);
    });

    test('POST /newpost/post succeeds with a valid body', () => {
        const params = { comment: 'Hello!', image: '' , id:1 };
        return request(app)
        .post('/newpost/post')
        .send(params)
	    .expect(200);
    });

    test('POST /newpost/post fails without a valid body', () => {
        const params = { comment: 'Larry', id:0 }; //No image
        return request(app)
        .post('/newpost/post')
        .send(params)
	    .expect(500);
    });

    test('POST /newpost/post returns JSON with a valid body', () => {
	    const params = { comment: 'Hello again!', image: '' , id:1 };
        return request(app)
        .post('/newpost/post')
        .send(params)
	    .expect('Content-type', /json/);
    });

    test('POST /newuser/add fails without a valid body', () => {
        const params = {}; //No name
        return request(app)
        .post('/newpost/post')
        .send(params)
	    .expect(500);
    });

    test('POST /newuser/add succeeds with a valid body', () => {
        const params = { name: "Admin" };
        return request(app)
        .post('/newuser/add')
        .send(params)
	    .expect(200);
    });

    test('POST /newuser/add returns JSON with a valid body', () => {
	    const params = { name: "Admin" };
        return request(app)
        .post('/newuser/add')
        .send(params)
	    .expect('Content-type', /json/);
    });
});
