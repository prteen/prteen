# Prteen
API for searching, creating and participating to parties

### Members
Lorenzo Bodini, [topongo]("https://github.com/topongo")  
Filippo De Grandi, [Degra02]("https://github.com/Degra02")

## Main objective
The primary objective of this application is to furnish users with a dependable and efficient platform for the purpose of creating, managing, and participating in various social gatherings and events. By offering a comprehensive suite of features and functionalities, the application aims to facilitate the entire process of organizing and engaging in parties, ensuring reliability and convenience for its users.

## Git strategy
The employed git strategy entails the utilization of branches to effectively manage and implement distinct features within a software development project. By adopting this approach, we created separate branches for each feature, thereby allowing for isolated development and testing of individual functionalities. This strategy promotes modularity and facilitates parallel work, as team members can focus on specific features without interfering with each other's progress. Additionally, utilizing feature branches enabled efficient code revies and quality assurance processes, as changes are contained within isolated branches before being merged into the main codebase. Through the systematic use of branches for feature implementation, the git strategy enhanced our collaboration, code organization, and overall development efficiency.

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
