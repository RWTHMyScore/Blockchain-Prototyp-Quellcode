const fs = require("fs");
const { execSync } = require("child_process");
const crypto = require("crypto");
const process = require("process");

function initialize(purge) {
  process.chdir(__dirname);

  if (purge) {
    // db purge
    try {
      execSync("rm mobility.db", {
        stdio: "inherit",
      });
    } catch (error) {
      return;
    }
  }

  // do not override by default
  if (fs.existsSync("mobility.db")) {
    return;
  }

  // db creation
  try {
    execSync("sqlite3 mobility.db < setup.sql", {
      stdio: "inherit",
    });
  } catch (error) {
    return;
  }

  // if appropriate environment variables are set, provision initial account data
  if (!(process.env.INIT_ACCOUNTS && process.env.INIT_DEPARTMENTS)) {
    return;
  }

  // account provisioning
  // first account is automatically made owner
  const accounts = JSON.parse(process.env.INIT_ACCOUNTS);
  const departments = JSON.parse(process.env.INIT_DEPARTMENTS);
  const createdDepartments = [];
  for (let i = 0; i < accounts.length; i += 1) {
    const account = accounts[i];
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(account.password, salt, 1000, 64, "sha512")
      .toString("hex");
    const statement = `INSERT INTO
    users (
        firstname,
        lastname,
        email,
        password,
        salt,
        owner
    )
    VALUES
    (
        '${account.firstname}',
        '${account.lastname}',
        '${account.email}',
        '${hash}',
        '${salt}',
        ${i === 0 ? 1 : 0}
    );`;

    try {
      execSync(`sqlite3 mobility.db "${statement}"`, {
        stdio: "inherit",
      });
    } catch (error) {
      // eslint-disable-next-line no-useless-return
      return;
    }

    // add department data if required
    if (!account.department) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (!createdDepartments.includes(account.department)) {
      // still need to create that department
      const department = departments.find((d) => d.name === account.department);
      const statement2 = `INSERT INTO
      departments (
          name,
          pubkey,
          privkey,
          admin
      )
      VALUES
      (
          '${account.department}',
          '${department.pubkey}',
          '${department.privkey}',
          (SELECT id FROM users WHERE email='${account.email}')
      );`;

      try {
        execSync(`sqlite3 mobility.db "${statement2}"`, {
          stdio: "inherit",
        });
        createdDepartments.push(account.department);
      } catch (error) {
        // eslint-disable-next-line no-useless-return
        return;
      }
    }

    // update account affiliation to the department
    const statement3 = `UPDATE users
    SET department = (SELECT id FROM departments WHERE name='${account.department}')
    WHERE email='${account.email}';`;
    try {
      execSync(`sqlite3 mobility.db "${statement3}"`, {
        stdio: "inherit",
      });
    } catch (error) {
      // eslint-disable-next-line no-useless-return
      return;
    }
  }

  // if appropriate environment variables are set, provision initial transcript data
  if (!process.env.INIT_TEST_TRANSCRIPT_PATH) {
    return;
  }
  // add transcript
  const transcript = fs.readFileSync(process.env.INIT_TEST_TRANSCRIPT_PATH, {
    encoding: "utf8",
    flag: "r",
  });
  const reName1 = /(?<=<givenNames>)[\w ]+/i;
  const reName2 = /(?<=<familyName>)[\w ]+/i;
  const reMatr = /(?<=<homeMatriculation>)\w+/i;
  const reUni = /(?<=<toUniversity>)[\w ]+/i;
  const reDept = /(?<=<toDepartment>)[\w ]+/i;
  const reUniFrom = /(?<=<fromUniversity>)[\w ]+/i;
  const reDeptFrom = /(?<=<fromDepartment>)[\w ]+/i;
  const transcriptBased = Buffer.from(transcript).toString("base64");
  const tsHash = crypto
    .createHash("sha512")
    .update(transcriptBased, "utf-8")
    .digest("hex");
  const statement4 = `INSERT INTO transcripts(fullname,homeMatriculation,fromUniversity,fromDepartment,toUniversity,toDepartment,content,hash)
VALUES(
  '${transcript.match(reName1)[0]} ${transcript.match(reName2)[0]}',
  '${transcript.match(reMatr)[0]}',
  '${transcript.match(reUniFrom)[0]}',
  '${transcript.match(reDeptFrom)[0]}',
  '${transcript.match(reUni)[0]}',
  '${transcript.match(reDept)[0]}',
  '${transcriptBased}',
  '${tsHash}'
  );`;
  try {
    execSync(`sqlite3 mobility.db "${statement4}"`, {
      stdio: "inherit",
    });
  } catch (error) {
    // eslint-disable-next-line no-useless-return
    return;
  }
}

const args = process.argv.slice(2);
initialize(args[0] === "-f");
