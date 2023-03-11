# credit-mobility

## Overview

This project explores an efficient and structured approach to creating an MVP for Student Mobility using Blockchain.

This is a collection of multiple projects making up the prototype. You can find more information in each sub-folder's README file.

Apart from smart contract code, all code is written in `JavaScript`. Dependency management is done with `pnpm` for faster package management operations (compared to `npm`). Using macOS or Linux (**not** WSL) for development is recommended.

**NOTE:** For easy testing setup, this repository contains exemplary key material. Do not use this in any kind of production-like environment.

**NOTE:** Testing locally might require adjusting browser settings to accept self-signed certificates.

**NOTE:** Development on Windows is viable through the use of WSL. Always use WSL1, because WSL2 degrades cross-OS fileystem access times by several orders of magnitude, leading to non-usability. There can also be problems with certain development configurations, due to the fact that Docker on Windows runs inside WSL (no matter from where you access it), but has containers always binding to the host Windows.

**NOTE:** Depending on the browser used, a test setup with self-signed certificates explicitly needs browser acceptance rules for such certificates for the website and API URLs. Otherwise, this can manifest as a CORS error.

## How do develop

More information on every sub-project can be found in the corresponding README file. Here is a quick start guide for a development setup:

1. Create missing files in every repo (e.g., certificates) and install global dependencies according to the README files (including in `backend/database`).
2. Start chain using `localdev.sh` script in `contracts` folder. This will also automatically copy contract ABIs to the backend.
3. Go into `dev` folder and run `docker-compose down` to remove old containers, `docker-compose build` to rebuild, and `docker-compose up` to finally launch.
4. Run local auto-reloading frontend and backend in their respective directories with `pnpm dev` each.
5. Now you are ready to develop frontend and backend features. Pre-configured login information for development can be found in the `docker-compose.yml` file in the `dev` directory.
