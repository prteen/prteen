# Prteen
API for searching, creating and participating to parties

### Members
Lorenzo Bodini, [topongo]("https://github.com/topongo")  
Filippo De Grandi, [Degra02]("https://github.com/Degra02")

## Main objective
The primary objective of this application is to furnish users with a dependable and efficient platform for the purpose of creating, managing, and participating in various social gatherings and events. By offering a comprehensive suite of features and functionalities, the application aims to facilitate the entire process of organizing and engaging in parties, ensuring reliability and convenience for its users.

## Deploy link
The RESTful API is deployed with [render](https://render.com/) at
https://prteen.onrender.com.

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
