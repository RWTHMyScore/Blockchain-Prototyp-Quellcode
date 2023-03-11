# Development Setup

This directory contains everything to quickly boot up a two-party demo setup. Everything is containerized.

## Setup Hint

While you do not need to follow dependency installations (because the containers install their own dependencies), you
still need to add all additional files required for the sub-projects. Check their readme files.

## Command Reference

This profile starts all services, including a development chain, to allow for easy demos of the system.

### Build

```
docker-compose build
```

### Run

```
docker-compose up
```

### Removing existing containers

```
docker-compose down
```
