# Auto Generator Auto Games

## Live preview: [DEMO](https://agag-313620.ew.r.appspot.com/)

## Build with

- **Server**: Express, WebSocket, TypeScript
- **Client**: React, TypeScript, Three.js, WebSocket, Material UI

## Install and run

- Configure **.env** files for client and server, examples bellow.

**Client**
```bash
npm install
npm start
```

**Server**
```bash
npm install
npm run dev
```

## Missing __mockData

1. Download from [upload.7z](https://agag-313620.ew.r.appspot.com/assets/upload.7z)
2. Copy "assets" folder to public
3. Copy "__mockData" folder to src
  
## Read Map

- [x] Initial Game Client
- [ ] Initial IDE
  - [x] data preview
  - [ ] data editing
- [ ] Real-Time IDE
- [ ] Custom Scripting System
- [ ] Multiplayer Online Game Server/Client

## Server - example .env

In server root directory create:

- .env.development .env.production .env.test

```environment
PORT=8080
WEB_SERVER=false
```
