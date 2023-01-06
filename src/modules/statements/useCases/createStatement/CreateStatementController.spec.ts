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

  it("GET /api/v1/statements/balance", async () => {
    const responseUser = await request(app).post("/api/v1/users/").send({
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

    await request(app).post("/api/v1/statements/deposit")
      .send({
        user_id: id,
        type: '+',
        amount: 100,
        description: 'teste1'
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    await request(app).post("/api/v1/statements/deposit")
      .send({
        user_id: id,
        type: '+',
        amount: 300,
        description: 'teste2'
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    const responseBalance = await request(app).get("/api/v1/statements/balance")
      .send({
        user_id: id
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    //console.log(responseBalance.body);

    expect(responseBalance.status).toBe(200);
    expect(responseBalance.body).toHaveProperty("balance");
  });

  ////////////////////////////////////////deposit///////////////////////////////////////////////
  it("Post /api/v1/statements/deposit", async () => {
    const responseUser = await request(app).post("/api/v1/users/").send({
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

    const responseDeposit = await request(app).post("/api/v1/statements/deposit")
      .send({
        user_id: id,
        type: '+',
        amount: 100,
        description: 'teste1'
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(responseDeposit.status).toBe(201);
  });
  /////////////////////////////////////////withdraw////////////////////////////////////////////
  it("Post /api/v1/statements/withdraw", async () => {
    const responseUser = await request(app).post("/api/v1/users/").send({
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

    const responseWithdraw = await request(app).post("/api/v1/statements/withdraw")
      .send({
        user_id: id,
        type: '+',
        amount: 50,
        description: 'withdraw teste1'
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    //console.log(responseWithdraw.body);
    expect(responseWithdraw.status).toBe(201);
  });


  /////////////////////////////////////////statement_id////////////////////////////////////////////
  it("GET /api/v1/statements/:statement_id", async () => {
    const responseUser = await request(app).post("/api/v1/users/").send({
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

    //console.log(responseToken.body);
    const response = await request(app).post("/api/v1/statements/withdraw")
      .send({
        user_id: id,
        type: '+',
        amount: 50,
        description: 'withdraw teste1'
      })
      .set({
        Authorization: `Bearer ${token}`
      });

    // console.log(response.body);

    const { id: id_teste } = response.body;

    const responseT = await request(app).get("/api/v1/statements/" + id_teste)
      .set({
        Authorization: `Bearer ${token}`
      });

    expect(response.status).toBe(201);
  });


});
