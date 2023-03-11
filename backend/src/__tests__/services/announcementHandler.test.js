const { execSync } = require("child_process");
const {
  announceTranscript,
  getAnnouncementFromChain,
} = require("../../services/announcementHandler");
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

describe("transcript announcement", () => {
  it("should be able to announce a transcript on chain and log to db", async () => {
    jest.setTimeout(15000);
    const rowId = await announceTranscript(
      "alice@example.com",
      1,
      "0x03CA1f52C11362E2088c79aBC290E31c4C09aAd1"
    );
    expect(typeof rowId).toBe("number");
  });

  it("should be able to find previous announcement", async () => {
    const { hash } = getDatabase()
      .prepare("SELECT hash FROM transcripts WHERE id = ?")
      .get(1);
    const announcement = await getAnnouncementFromChain(
      "0x67D2A308300320f8f35951D260925893930a46aF",
      "0x03CA1f52C11362E2088c79aBC290E31c4C09aAd1",
      hash
    );
    expect(announcement).toBeTruthy();
  });
});
