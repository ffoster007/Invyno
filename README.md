<div align="center">
  <a href="#">
    <img src= "./resources/Banner.png" alt="Logo">
  </a>

  <h3 align="center">Invyno</h3>

  <p align="center">
    Best Investment Tracker for Modern Investors
  </p>
</div>

## About The Project

<p align="center">
  <a href="#" target="_blank" rel="noopener">
    <img src="./resources/Invyno_pub.png" alt="avacx" />
  </a>
</p>

Invyno is a **Next.js** web application that can also run as a **desktop app** via **Electron**. The desktop build bundles a production Next.js server (standalone output) and packages it with 

## Prerequisites

- **Node.js** (LTS recommended, e.g. 20+)
- **npm**
- **PostgreSQL** (for API/auth and Prisma — required at runtime for the full app)
- Copy environment file: `webapp/.env.example` → `webapp/.env` and set at least `DATABASE_URL` (and any OAuth/email variables you use)

## Get Started

```bash
git clone https://github.com/ffoster007/Invyno.git
cd Invyno
```

### Linux / macOS setup

```bash
cp webapp/.env.example webapp/.env
bash setup.sh
```

## LICENSE
This project is licensed under the MIT License 