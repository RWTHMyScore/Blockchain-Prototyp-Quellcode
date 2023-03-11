# Credit Mobility Backend

This frontend website provides all of the user interface required to interact with the system. It is intended to be run by every participating institution.

The used framework is `Vue.js`.

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

### Compiles and hot-reloads for development

```
pnpm run serve
```

To run with pre-defined environment variables for local development:

```
pnpm run dev
```

### Compiles and minifies for production

```
pnpm run build
```

### Lints and fixes files

```
pnpm run lint
```
