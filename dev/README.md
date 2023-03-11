# Development Setup

This directory contains everything to quickly boot up a two-party test setup.

## Setup Hint

While you do not need to follow dependency installations (because the containers install their own dependencies), you
still need to add all additional files required for the sub-projects. Check their readme files.

## Command Reference

This file starts everything apart form one frontend and one backend (allows easy development with hot reloading on one half of the services).

### Build

```
docker-compose --profile demo build
```

### Run

```
docker-compose --profile demo up
```

### Removing existing containers

```
docker-compose --profile demo down
```
