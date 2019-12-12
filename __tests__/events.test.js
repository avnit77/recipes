require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Recipe = require('../lib/models/Recipe');
const Event = require('../lib/models/Event');

describe('event routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let recipe;
  let event;
  beforeEach(async() => {
    recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [
        { name: 'flour', amount: 1, measurement: 'cup' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    event = await Event.create({
      recipeId: recipe._id,
      dateOfEvent: new Date('2014-12-12T00:00:00'),
      notes: 'It was good',
      rating: 5
    });
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates an event', () => {
    return request(app)
      .post('/api/v1/events')
      .send({
        recipeId: recipe._id,
        dateOfEvent: Date('2014-12-12T00:00:00'),
        notes: 'It went well',
        rating: 4
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe._id.toString(),
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });

  it('has a day get virtual', () => {
    expect(event.day).toEqual('Friday');
  });
  it('has a month get virtual', () => {
    expect(event.month).toEqual('December');
  });
  it('has a year get virtual', () => {
    expect(event.year).toEqual(2014);
  });

  it('has a day set virtual', () => {
    event.day = 'Thursday';
    expect(event.dateOfEvent).toEqual(new Date('2014-12-05T00:00:00'));
  });
  it('has a month set virtual', () => {
    event.month = 'November';
    expect(event.dateOfEvent).toEqual(new Date('2014-11-12T00:00:00'));
  });
  it('has a year set virtual', () => {
    event.year = 2013;
    expect(event.dateOfEvent).toEqual(new Date('2013-12-12T00:00:00'));
  });

  it('gets all events', async() => {
    const events = await Event.create([
      { recipeId: recipe._id, dateOfEvent: Date.now(), rating: 3 },
      { recipeId: recipe._id, dateOfEvent: Date.now(), rating: 2 },
      { recipeId: recipe._id, dateOfEvent: Date.now(), rating: 3 },
      { recipeId: recipe._id, dateOfEvent: Date.now(), rating: 5 },
    ]);

    return request(app)
      .get('/api/v1/events')
      .then(res => {
        events.forEach(event => {
          expect(res.body).toContainEqual(JSON.parse(JSON.stringify(event)));
        });
      });
  });

  it('gets an event by id', async() => {
    return request(app)
      .get(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: JSON.parse(JSON.stringify(recipe)),
          dateOfEvent: expect.any(String),
          notes: 'It was good',
          rating: 5,
          __v: 0
        });
      });
  });

  it('updates an event by id', async() => {
    return request(app)
      .patch(`/api/v1/events/${event._id}`)
      .send({ rating: 4 })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe._id.toString(),
          dateOfEvent: expect.any(String),
          notes: 'It was good',
          rating: 4,
          __v: 0
        });
      });
  });

  it('deletes an event by id', async() => {
    return request(app)
      .delete(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe._id.toString(),
          dateOfEvent: expect.any(String),
          notes: 'It was good',
          rating: 5,
          __v: 0
        });
      });
  });
});
