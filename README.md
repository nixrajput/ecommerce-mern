# ecommerce-mern

An E-commerce Web App developed using MERN stack where user can buy and checkout product with ease and add their review and rating for the products.

[![Stars](https://img.shields.io/github/stars/nixrajput/ecommerce-mern?label=Stars)][repo]
[![Forks](https://img.shields.io/github/forks/nixrajput/ecommerce-mern?label=Forks)][repo]
[![Watchers](https://img.shields.io/github/watchers/nixrajput/ecommerce-mern?label=Watchers)][repo]
[![Contributors](https://img.shields.io/github/contributors/nixrajput/ecommerce-mern?label=Contributors)][repo]

[![GitHub last commit](https://img.shields.io/github/last-commit/nixrajput/ecommerce-mern?label=Last+Commit)][repo]
[![GitHub issues](https://img.shields.io/github/issues/nixrajput/ecommerce-mern?label=Issues)][issues]
[![GitHub pull requests](https://img.shields.io/github/issues-pr/nixrajput/ecommerce-mern?label=Pull+Requests)][pulls]
[![GitHub Licence](https://img.shields.io/github/license/nixrajput/ecommerce-mern?label=Licence)][license]

## Features

- User Authentication
- Add Product to Cart
- Buy Product
- Payment Checkout
- Add Review
- Add Rating

## Website

The website is hosted at [nixlab-shop.cyclic.app](https://nixlab-shop.cyclic.app).

## Setup

- Clone the repository

```bash
git clone https://github.com/nixrajput/ecommerce-mern.git
```

- Install required modules
  
```bash
npm install
```

- Create a new directory `config` in `backend` directory
- Create a new file `config.env` in `config` directory
- Add following VARIABLES in `config.env` or in production Environment Variables
  
```env
PORT = 4000

DB_URI = 'YOUR MONGO-DB URI'
DB_NAME = 'ecommerce'

NODE_ENV = 'dev'

JWT_SECRET = 'YOUR JWT SECRET'
JWT_EXPIRES_IN = 7d

COOKIE_EXPIRES_IN = 5

SMTP_FROM = 'Test <noreply@yourcompany.com>'

SENDGRID_API_KEY = 'YOUR SENDGRID API KEY'

# Cloudinary
CLOUDINARY_CLOUD_NAME = 'YOUR CLOUDINARY CLOUD NAME'
CLOUDINARY_API_KEY = 'YOUR CLOUDINARY API KEY'
CLOUDINARY_API_SECRET = 'YOUR CLOUDINARY API SECRET'

# URL
FRONTEND_URL = 'http://localhost:3000';

# STRIPE CONFIG
STRIPE_API_KEY = 'YOUR STRIPE API KEY'
STRIPE_SECRET_KEY = 'YOUR STRIPE SECRET KEY'
```

- Run the server

```bash
npm run dev
cd frontend
npm start
```

## Activities

![Alt](https://repobeats.axiom.co/api/embed/04e548c478a20ba97a199265dc0e5659137489a3.svg "Repobeats analytics image")

## Connect With Me

[![Instagram: nixrajput](https://img.shields.io/badge/nixrajput-141430?logo=Instagram&logoColor=fff)][instagram]
[![Linkedin: nixrajput](https://img.shields.io/badge/nixrajput-141430?logo=Linkedin&logoColor=fff)][linkedin]
[![GitHub: nixrajput](https://img.shields.io/badge/nixrajput-141430?logo=Github&logoColor=fff)][github]
[![Twitter: nixrajput07](https://img.shields.io/badge/nixrajput07-141430?logo=Twitter&logoColor=fff)][twitter]
[![Facebook: nixrajput07](https://img.shields.io/badge/nixrajput07-141430?logo=Facebook&logoColor=fff)][facebook]

[github]: https://github.com/nixrajput
[facebook]: https://facebook.com/nixrajput07
[twitter]: https://twitter.com/nixrajput07
[instagram]: https://instagram.com/nixrajput
[linkedin]: https://linkedin.com/in/nixrajput
[repo]: https://github.com/nixrajput/ecommerce-mern
[issues]: https://github.com/nixrajput/ecommerce-mern/issues
[pulls]: https://github.com/nixrajput/ecommerce-mern/pulls
[license]: https://github.com/nixrajput/ecommerce-mern/blob/master/LICENSE.md
