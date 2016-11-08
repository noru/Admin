## Admin Console UI

### Prerequisites

Node.js v6+

### Run

Before start, make sure `npm install` run successfully in project root folder.

##### Local
`npm run local` Start a server on local, listening 8080 & 8443(for https). To be able to work with Oxygen, `hosts` file on your machine had to point `venus-local.autodesk.com` to `localhost (or 127.0.0.1)`.

To skip login, execute `localStorage.setItem('token', 'whatever')`

##### Dev
`npm run dev` Like `local`, but serve built files instead src files. Correspondingly, point `venus-dev.autodesk.com` to local address in `hosts`.

### Build
`npm run build-{env}` where env can be `dev`, `stg`, `prod`. Find the built files in `/dist` folder.
