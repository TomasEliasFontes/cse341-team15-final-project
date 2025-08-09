const request = require("supertest");
const app = require("../server");

describe("Venues API - GET routes", () => {
  test("GET /venues should return 200 and an array", async () => {
    const res = await request(app).get("/venues");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("GET /venues/:id should return 200 and a venue object when an id exists", async () => {
    const list = await request(app).get("/venues");
    expect(list.status).toBe(200);
    const items = Array.isArray(list.body) ? list.body : [];
    if (items.length === 0) {
      expect(items).toEqual([]);
      return;
    }
    const id = items[0]._id || items[0].id || null;
    if (!id) {
      expect(Object.keys(items[0]).length).toBeGreaterThan(0);
      return;
    }
    const res = await request(app).get(`/venues/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("venueName");
  });
});
