const { execSync } = require("child_process");
const { reloadDatabase, getDatabase } = require("../../services/database");

beforeAll(() => {
  execSync("cd database && ./extendedInit.sh", {
    stdio: "inherit",
  });
  reloadDatabase();
});

afterAll(() => {
  execSync("cd database/ && ./extendedInit.sh", {
    stdio: "inherit",
  });
});

describe("login", () => {
  it("should be able to read row from database", async () => {
    const row = getDatabase()
      .prepare("SELECT * FROM users WHERE email = ?")
      .get("alice@example.com");
    expect(row).toBeTruthy();
  });
});
