# prteen
Official prteen repo

## Deploy locally
- *Note that this application depends on MongoDB, so for deploying you have to have access credentials to a MongoDB server.*
- *Also note that if you are under unitn network and you're trying to deploy the app, you'll be likely not be able to connect to any remote MongoDB server.*

```sh
git clone https://github.com/prteen/prteen

cp .template.env .env
nano .env
# edit .env file with your credentials
npm install

# for single start
npm run dev
# for auto restart
npm run restart
```
