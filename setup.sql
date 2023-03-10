-- only for local users
CREATE TABLE users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    department INTEGER,
    email TEXT UNIQUE NOT NULL,
    password CHAR(128) NOT NULL,
    salt CHAR(16) NOT NULL,
    owner BOOL DEFAULT FALSE,
    FOREIGN KEY (department) REFERENCES departments(id)
);

-- only for local department x user mapping (and key management)
CREATE TABLE departments(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    pubkey TEXT UNIQUE NOT NULL,
    privkey TEXT NOT NULL,
    admin INTEGER NOT NULL,
    FOREIGN KEY (admin) REFERENCES users(id)
);

-- data representation of text based transcripts
CREATE TABLE transcripts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT NOT NULL,
    homeMatriculation TEXT NOT NULL,
    fromUniversity TEXT NOT NULL,
    -- text form
    fromDepartment TEXT NOT NULL,
    -- text form
    toUniversity TEXT NOT NULL,
    -- text form
    toDepartment TEXT NOT NULL,
    -- text form
    content TEXT NOT NULL,
    hash TEXT NOT NULL,
    time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- only captures data for on-chain announcements made by local employees
CREATE TABLE transfer_announcements(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user INTEGER NOT NULL,
    transcript INTEGER NOT NULL,
    recipient TEXT NOT NULL,
    -- ETH Address derived from university and department
    tx TEXT NOT NULL,
    block TEXT NOT NULL,
    time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user) REFERENCES users(id),
    FOREIGN KEY (transcript) REFERENCES transcripts(id)
);

-- a record here captures that a transcript was sent to the target transfer server
CREATE TABLE transfer_records(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user INTEGER NOT NULL,
    announcement INTEGER NOT NULL,
    time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user) REFERENCES users(id),
    FOREIGN KEY (announcement) REFERENCES transfer_announcements(id)
);

-- stores info regarding a received transcript
CREATE TABLE incoming_records(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transcript INTEGER NOT NULL,
    recipient TEXT NOT NULL,
    -- ETH Address
    sender TEXT NOT NULL,
    tx TEXT NOT NULL,
    block TEXT NOT NULL,
    -- ETH Address
    read BOOL DEFAULT FALSE,
    FOREIGN KEY (transcript) REFERENCES transcripts(id)
);

-- stores info regarding a transcript validation
CREATE TABLE validation_records(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inrecord INTEGER NOT NULL,
    valid BOOL NOT NULL,
    time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inrecord) REFERENCES incoming_records(id)
);

-- stores info regarding a received transcript
CREATE TABLE incoming_errors(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    hash TEXT,
    recipient TEXT NOT NULL,
    -- ETH Address
    sender TEXT NOT NULL,
    -- ETH Address
    comment TEXT NOT NULL,
    time DATETIME DEFAULT CURRENT_TIMESTAMP
);