# ecommerce-mern

An E-commerce Web App developed using MERN stack where user can buy and checkout product with ease and add their review and rating for the products.

## Features

- User Authentication
- Add Product to Cart
- Buy Product
- Payment Checkout
- Add Review
- Add Rating

## Usage

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

## Website

[Website Link](https://dark-puce-lemur-belt.cyclic.app)

## Connect With Me

[<img align="left" alt="nixrajput | Website" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/globe-icon.svg" />][website]

[<img align="left" alt="nixrajput | GitHub" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/github-brands.svg" />][github]

[<img align="left" alt="nixrajput | Instagram" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/instagram-brands.svg" />][instagram]

[<img align="left" alt="nixrajput | Facebook" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/facebook-brands.svg" />][facebook]

[<img align="left" alt="nixrajput | Twitter" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/twitter-brands.svg" />][twitter]

[<img align="left" alt="nixrajput | LinkedIn" width="24px" src="https://raw.githubusercontent.com/nixrajput/nixlab-files/master/images/icons/linkedin-in-brands.svg" />][linkedin]


[github]: https://github.com/nixrajput
[website]: https://nixlab.co.in
[facebook]: https://facebook.com/nixrajput07
[twitter]: https://twitter.com/nixrajput07
[instagram]: https://instagram.com/nixrajput
[linkedin]: https://linkedin.com/in/nixrajput
