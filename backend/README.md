# Credit Mobility Backend

This backend api with included lightweight database provides all of the data and functionality to the frontend. Key management, reading from the blockchain, managing transcripts, etc... Similarly to the frontend, it also runs at every participating institution.

The project is based on a boilerplate template [found here](https://github.com/rzgry/Express-REST-API-Template).

## Initial Setup

```
pnpm install
```

Also, you have to provide the following certificate files:

```
certificates/server.crt
certificates/server.key
```

Feel free to use the script `generateCertificate.sh` to generate a self-signed test certificate file.

## Command Reference

### Running in development

```
pnpm run dev
```

### Running in production

```
pnpm start
```

Runs on localhost:3000 by default but can be configured using the `PORT` environment variable.

### Running tests

```
pnpm test

# Watch repo
pnpm run test:watch
```

### Linting

```
pnpm run lint

# fix issues
pnpm run lint:fix
```
