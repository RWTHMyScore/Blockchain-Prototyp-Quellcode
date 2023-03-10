# Credit Mobility Backend

This is the database required for the backend. It mainly stores transcripts and user data.

Requires `sqlite3` to be installed.

## Initial Setup

Prefill a database with predefined data for testing and development:

```
./extendedInit.sh
```

If you want to pass in your own initial configuration via environment variables:

```
node init.js
```
