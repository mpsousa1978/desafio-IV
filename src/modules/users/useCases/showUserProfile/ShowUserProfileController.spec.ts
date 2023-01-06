import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

let connection: Connection;

describe("Create user profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection;
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Get toke profile", async () => {
    await request(app).post("/api/v1/users/").send({
      name: "User Test",
      email: "testmarcio@email.com",
      password: "admin",
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "testmarcio@email.com",
      password: "admin"
    })

    //console.log(responseToken.body);
    const { token, user } = responseToken.body;
    const { id } = user;

    const response = await request(app)
      .get("/api/v1/profile")
      .send({ id })
      .set({
        Authorization: `Bearer ${token}`
      })
    expect(response.status).toBe(200);
  });

});
