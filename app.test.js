const fs = require("fs");
const { execSync } = require("child_process");
const request = require("supertest");
const app = require("../app");
const { reloadDatabase } = require("../services/database");
const { announceTranscript } = require("../services/announcementHandler");

let transcript;
let transcriptId;

beforeAll(async () => {
  execSync("cd database && ./extendedInit.sh", {
    stdio: "inherit",
  });
  reloadDatabase();
  transcript = fs.readFileSync("../testfiles/RWTH CS RWTH CS MAX DEMO.xml", {
    encoding: "utf8",
    flag: "r",
  });
});

afterAll(() => {
  execSync("cd database && ./extendedInit.sh", {
    stdio: "inherit",
  });
});

describe("app", () => {
  it("should export the express app correctly", () => {
    expect(app).toBeTruthy();
  });

  describe("GET /", () => {
    it("should respond to the GET method with 200", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /404", () => {
    beforeEach(() => {
      // Avoid polluting the test output with 404 error messages
      jest.spyOn(console, "error").mockImplementation(() => {});
    });

    it("should respond to the GET method with a 404 for a route that does not exist", async () => {
      const response = await request(app).get("/404");
      expect(response.statusCode).toBe(404);
      expect(response.text).toBe('{"message":"Not Found"}');
    });
  });

  describe("POST /api/register", () => {
    it("should respond with 200 if registration is successful", async () => {
      const response = await request(app).post("/api/register").send({
        firstname: "Carol",
        lastname: "Testperson",
        email: "carol@example.com",
        password: "whatever",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeTruthy();
      expect(response.body.error).toBeFalsy();
      expect(response.body.message).toBeTruthy();
    });

    it("should respond with 200 if login on newly created account is successful", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "carol@example.com", password: "whatever" });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeTruthy();
      expect(response.body.error).toBeFalsy();
      expect(response.body.message).toBeTruthy();
    });
  });

  describe("POST /api/login", () => {
    it("should respond with 400 if request is incomplete", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "test@example.com" });
      expect(response.statusCode).toBe(400);
      expect(response.body).toBeTruthy();
      expect(response.body.error).toBeTruthy();
    });

    it("should respond with 401 if login is unsuccessful", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "test@example.com", password: "password" });
      expect(response.statusCode).toBe(401);
      expect(response.body).toBeTruthy();
      expect(response.body.error).toBeTruthy();
    });

    it("should respond with 200 if login is successful", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "alice@example.com", password: "credit" });
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeTruthy();
      expect(response.body.error).toBeFalsy();
      expect(response.body.message).toBeTruthy();
    });
  });

  describe("GET /api/whoami", () => {
    it("should respond with error if not providing a token", async () => {
      const response2 = await request(app).get("/api/whoami");
      expect(response2.statusCode).toBe(403);
      expect(response2.body).toBeTruthy();
      expect(response2.body.error).toBeTruthy();
    });

    it("should respond with correct user info for valid token", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "alice@example.com", password: "credit" });
      expect(response.statusCode).toBe(200);
      const response2 = await request(app)
        .get("/api/whoami")
        .query({ token: response.body.message.token });
      expect(response2.statusCode).toBe(200);
      expect(response2.body).toBeTruthy();
      expect(response2.body.message).toBeTruthy();
      expect(response2.body.message.email).toBe("alice@example.com");
      expect(response2.body.message.roles).toStrictEqual(["Owner", "Admin"]);
    });
  });

  describe("POST /api/departments", () => {
    it("should respond with error if not providing a token", async () => {
      const response2 = await request(app).post("/api/departments");
      expect(response2.statusCode).toBe(403);
      expect(response2.body).toBeTruthy();
      expect(response2.body.error).toBeTruthy();
    });

    it("should allow department creation by owner", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "alice@example.com", password: "credit" });
      expect(response.statusCode).toBe(200);
      const response2 = await request(app).post("/api/register").send({
        firstname: "Ella",
        lastname: "Testperson",
        email: "ella@example.com",
        password: "whatever",
      });
      expect(response2.statusCode).toBe(200);
      const response3 = await request(app).post("/api/departments").send({
        token: response.body.message.token,
        name: "Test Department Please Ignore",
        server: "testdepartment.de",
        admin: "ella@example.com",
      });
      expect(response3.statusCode).toBe(200);
    });
  });

  describe("GET /api/partners", () => {
    it("should respond with error if not providing a token", async () => {
      const response = await request(app).get("/api/partners");
      expect(response.statusCode).toBe(403);
      expect(response.body).toBeTruthy();
      expect(response.body.error).toBeTruthy();
    });

    it("should respond with correct partner infos for valid token", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "alice@example.com", password: "credit" });
      expect(response.statusCode).toBe(200);
      const response2 = await request(app)
        .get("/api/partners")
        .query({ token: response.body.message.token });
      expect(response2.statusCode).toBe(200);
      expect(response2.body).toBeTruthy();
      expect(response2.body.message).toBeTruthy();
      expect(response2.body.message[0].university).toBeTruthy();
      expect(response2.body.message[0].department).toBeTruthy();
      expect(response2.body.message[0].server).toBeTruthy();
      expect(response2.body.message[0].address).toBeTruthy();
    });
  });

  describe("GET /api/transcripts", () => {
    it("should respond with error if not providing a token", async () => {
      const response = await request(app).get("/api/transcripts");
      expect(response.statusCode).toBe(403);
      expect(response.body).toBeTruthy();
      expect(response.body.error).toBeTruthy();
    });

    it("should respond with transcript list for valid token", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "alice@example.com", password: "credit" });
      expect(response.statusCode).toBe(200);
      const response2 = await request(app)
        .get("/api/transcripts")
        .query({ token: response.body.message.token });
      expect(response2.statusCode).toBe(200);
      expect(response2.body).toBeTruthy();
      expect(response2.body.message).toBeTruthy();
      expect(response2.body.message[0].id).toBeTruthy();
      expect(response2.body.message[0].fullname).toBeTruthy();
      expect(response2.body.message[0].homeMatriculation).toBeTruthy();
      expect(response2.body.message[0].toUniversity).toBeTruthy();
      expect(response2.body.message[0].toDepartment).toBeTruthy();
      expect(response2.body.message[0].content).toBeTruthy();
      expect(response2.body.message[0].hash).toBeTruthy();
    });
  });

  describe("POST /api/transcripts", () => {
    it("should respond with error if not providing a token", async () => {
      const response = await request(app).post("/api/transcripts");
      expect(response.statusCode).toBe(403);
      expect(response.body).toBeTruthy();
      expect(response.body.error).toBeTruthy();
    });

    it("should respond with inserted row id on upload", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "alice@example.com", password: "credit" });
      expect(response.statusCode).toBe(200);
      const response2 = await request(app)
        .post("/api/transcripts")
        .send({
          token: response.body.message.token,
          content: Buffer.from(transcript).toString("base64"),
        });
      expect(response2.statusCode).toBe(200);
      expect(response2.body).toBeTruthy();
      expect(response2.body.message).toBeTruthy();
      // eslint-disable-next-line no-restricted-globals
      expect(!isNaN(parseInt(response2.body.message, 10))).toBeTruthy();
      transcriptId = response2.body.message;
    });
  });

  describe("POST /api/incomings", () => {
    it("should allow uploading announced transcript", async () => {
      jest.setTimeout(15000);

      // create the announcement
      // alice sends to herself, so we do not need a second backend server up
      const rowId = await announceTranscript(
        "alice@example.com",
        transcriptId,
        "0x67D2A308300320f8f35951D260925893930a46aF"
      );
      expect(typeof rowId).toBe("number");

      // actual test
      const response = await request(app)
        .post("/api/login")
        .send({ email: "alice@example.com", password: "credit" });
      expect(response.statusCode).toBe(200);
      const response2 = await request(app)
        .post("/api/incomings")
        .send({
          token: response.body.message.token,
          content: Buffer.from(transcript).toString("base64"),
          recipient: "0x67D2A308300320f8f35951D260925893930a46aF",
          sender: "0x67D2A308300320f8f35951D260925893930a46aF",
        });
      expect(response2.statusCode).toBe(200);
      expect(response2.body).toBeTruthy();
      expect(response2.body.message).toBeTruthy();
    });

    it("should detect duplicate upload", async () => {
      jest.setTimeout(15000);
      const response = await request(app)
        .post("/api/login")
        .send({ email: "alice@example.com", password: "credit" });
      expect(response.statusCode).toBe(200);
      const response2 = await request(app)
        .post("/api/incomings")
        .send({
          token: response.body.message.token,
          content: Buffer.from(transcript).toString("base64"),
          recipient: "0x67D2A308300320f8f35951D260925893930a46aF",
          sender: "0x67D2A308300320f8f35951D260925893930a46aF",
        });
      expect(response2.statusCode).toBe(200);
      expect(response2.body).toBeTruthy();
      expect(response2.body.message).toBeTruthy();
      expect(response2.body.message).toBe("Already transferred");
    });

    it("should allow to set it to read", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "alice@example.com", password: "credit" });
      expect(response.statusCode).toBe(200);
      const responseIncomings = await request(app)
        .get("/api/incomings")
        .query({ token: response.body.message.token });
      const response2 = await request(app).post("/api/incomings/read").send({
        token: response.body.message.token,
        id: responseIncomings.body.message[0].id,
        read: true,
      });
      expect(response2.statusCode).toBe(200);
      expect(response2.body).toBeTruthy();
      expect(response2.body.message).toBeTruthy();
    });
  });

  describe("PUT /api/departments", () => {
    it("should respond with error if not providing a token", async () => {
      const response2 = await request(app).put("/api/user/assignDepartment");
      expect(response2.statusCode).toBe(403);
      expect(response2.body).toBeTruthy();
      expect(response2.body.error).toBeTruthy();
    });

    it("should allow updating department if admin", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({ email: "alice@example.com", password: "credit" });
      expect(response.statusCode).toBe(200);
      const response2 = await request(app).put("/api/departments").send({
        token: response.body.message.token,
        server: "realserver.com",
      });
      expect(response2.statusCode).toBe(200);
    });
  });
});
