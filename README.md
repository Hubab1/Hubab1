<img src="https://i2.wp.com/www.bubbleblabber.com/wp-content/uploads/2015/06/Woodhouse.jpg" alt="Woodhouse" width="500" align="center"/>

## Woodhouse [![Generic badge](https://img.shields.io/badge/React-v16.13-blue.svg)](https://reactjs.org/) [![Generic badge](https://img.shields.io/badge/Node-v10.15-brightgreen.svg)](https://nodejs.org/en/)

Woodhouse is the front-end application used for Funnel's Automated Online Leasing product. Is is built with React, Redux, JavaScript, and HTML/CSS

## Installation and Setup Instructions
### Dependencies
To run Woodhouse you will need:
- npm 6.13.0
- node v10.15.0

You can check the [Docker Configuration](.buildkite/docker-compose.yml) file for the current used node version.

### Configuration

Woodhouse depends on the [Chuck Backend Server](https://github.com/Nestio/chuck).
To make Woodhouse work with chuck you need to configure the following:
- Make sure the following is added to `settings_local.py` in Chuck to avoid cors issues

    
    DEFAULT_PROTOCOL = 'https'
    ALLOWED_HOSTS = '*'
    CORS_ORIGIN_ALLOW_ALL = True
    CORS_ALLOW_CREDENTIALS = True
    CORS_URLS_REGEX = r'^.*$'
    CORS_ORIGIN_WHITELIST = (
        'localhost:8080',
        'https://vars.hotjar.com',
    )

- You will need to use an existing LeaseSettings or you will have to create a new one in chuck. you can do that in the [admin interface](http://localhost:8000/admin/onlineleasing/leasesettings/).

- Make sur the Online Leasing [APIs](https://nestiolistings.com/api/onlineleasing/api-doc/#/) are accessible. For development environment, it should be available on port 8000 (default port for chuck).  


### Installation

- Install dependencies


    $ npm install

- Start development server 


    $ npm start
    // Woodhouse should be running on port 3000 (`localhost:3000`)

### Getting started

Update the localhost url appending the LeaseSettings object optional personalized hash identified in the previous step like this:

format: `localhost:3000/{your-lease-settings-id}/v={your-optional-personalized-hash}`

without hash: `localhost:3000/1`

with hash: `localhost:3000/1/?v=za7jDFkEML`


## Documentation:
You can find very useful documentation and very helpful other resources related to Woodhouse, the Automated Online Project, and the development guidelines in the [Nuclino](https://app.nuclino.com/Nestio/Dev/Online-Leasing-d470cb31-b040-4fb0-946b-0da6e62c5ec6) page.
