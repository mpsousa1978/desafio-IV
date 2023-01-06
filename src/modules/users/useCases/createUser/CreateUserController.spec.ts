import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection;
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at)
      values('${id}', 'admin', 'admin@rentx.com.br', '${password}', 'now()')
     `
    );

  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Get toke", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin"
    })

    //console.log(response.body);
    //expect(response.body.length).toBe(1);
  });

  it("Should be able to post User", async () => {
    const response = await request(app).post("/api/v1/users/").send({
      name: "User Test",
      email: "test@email.com",
      password: "admin",
    });
    expect(response.status).toBe(201);
  });
  it("Should not be able to post an already existing User", async () => {
    await request(app).post("/api/v1/users/").send({
      name: "User1",
      email: "testmail@email.com",
      password: "admin",
    });
    const response = await request(app).post("/api/v1/users/").send({
      name: "User2",
      email: "testmail@email.com",
      password: "admin",
    });
    expect(response.status).toBe(400);
  });


});
