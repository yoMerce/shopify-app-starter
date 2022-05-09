# shopify-app-starter

This is a starter kit for developing shopify apps. It is build using:

- Express
- Mongo
- Polaris
- React
- Tailwindcss

The repository is inspired by the official app starter from shopify and uses code from it. The repository is written using typescript for both server and the app. The databse is Mongo and the repo comes with the setup for some basic collections to store sessions, shops and gdpr request data.

## How to run locally?

To access the app in the internet you need to first start the local tunnel using the follwoing command:

```
yarn tunnel
```

The url returned from the above comand needs to be configured in the local env file and the shopify app settings. Once the url is configured, open a new console and follow the steps from below.

Build and run the app using the follwoing command

```
yarn dev
```

if you want to keep the server running with the watch on, you can use the following command

```
yarn dev:watch
```

The above command will look for any changes in server or the app folder and will rebuild the entire project. To avoid continuous building when you are in dev mode, the nodemon will delya the build by 15 secs and will batch all the changes in a single build.

The above command will build the app (frontend) using vite and the server using typescript compiler. It will then start the app.

Try to install the app from your partner dashboard or using th follwoing url

```
<YOUR LOCAL TUNNEL URL>/auth?shop=<YOUR DEV SHOP URL>
```

this will ask for you to istall the app and shows you the scope configured in the env file. Once the auth is complete, you can see the app embedded in your dev store.

## Webhooks

The repo configures the uninstall webhook by default. It also provides the endpoints for mandatory webhooks for GDPR purposes. You have to configure the mandatory webhooks directly in the app setup.
