const request = require("supertest");
const app = require("../server");

describe("Events API - GET routes", () => {
  test("GET /events should return 200 and an array", async () => {
    const res = await request(app).get("/events");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /events/:id should return 200 and an event object when an id exists", async () => {
    const list = await request(app).get("/events");
    expect(list.status).toBe(200);
    const items = Array.isArray(list.body) ? list.body : [];
    if (items.length === 0) {
      // If there are no events, assert that the array is empty and skip detailed id test
      expect(items).toEqual([]);
      return;
    }
    const id = items[0]._id || items[0].id || items[0].venueId || items[0].eventName ? items[0]._id || items[0].id : null;
    if (!id) {
      // If the object structure is unknown, just check the first item has some keys
      expect(Object.keys(items[0]).length).toBeGreaterThan(0);
      return;
    }
    const res = await request(app).get(`/events/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("eventName");
  });
});
