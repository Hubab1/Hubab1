# Woodhouse

![Woodhouse](https://i2.wp.com/www.bubbleblabber.com/wp-content/uploads/2015/06/Woodhouse.jpg)

online leasing front end

## Development Setup

Woodhouse runs on Node 10 (see [.buildkite/docker-compose.yml](.buildkite/docker-compose.yml) for current version)

### Run Chuck

Run Chuck locally on port 8000 (default)

Chuck handles all API functionality. Online Leasing endpoint specs can be found here:
https://nestiolistings.com/api/onlineleasing/api-doc/#/

### Chuck Config (settings_local.py)

Make sure the following is added to `settings_local.py` in Chuck to avoid cors issues

    ALLOWED_HOSTS = '*'
    CORS_ORIGIN_ALLOW_ALL = True
    CORS_ALLOW_CREDENTIALS = True
    CORS_URLS_REGEX = r'^.*$'
    CORS_ORIGIN_WHITELIST = (
        'localhost:8080',
        'https://vars.hotjar.com',
    )


### Use Existing LeaseSettings or Create One in Chuck
 
 The LeaseSettings object in Chuck maps to the configuration on the frontend App. For development purposes you can use the following LeaseSettings object:

    LeaseSettings with selected attributes
    id: 1,
    community: The Excelsior (id:37),
    background: 'https://nestiolistings-assets-dev.s3.amazonaws.com/onlineleasing_background/b10195d50ab77145bdf59e0b54b2fe5d.png',
    logo: 'https://nestiolistings-assets-dev.s3.amazonaws.com/onlineleasing_logos/c9bed1d02d3b3b0a0f1c19a3ec4b8e9c.png',
    primary_color: '286165',
    secondary_color: 'FFFFFF'

    Personalized Hash: za7jDFkEML

You can also create or identify a LeaseSettings object in admin: http://localhost:8000/admin/onlineleasing/leasesettings/

If you'd like to make a personalized link with associated client and/or unit data, you can create a hash in the shell with [PersonalizedHash](https://github.com/Nestio/chuck/blob/d6eadddac786af3a0af4acdaf017f1c5fc64a954/chuck/onlineleasing/utils.py#L6)


### Logging in

Create an Applicant in Chuck. Set an email and password and associate a client.

You should use the applicant.set_password(raw_password) method to set a password on the applicant.

### Styling with emotion

This project uses emotion.js for styling. There are two ways to apply styling:

1. Styled Components:
```
import styled from '@emotion/styled';

export const H1 = styled.h1`
    font-weight:600;
    font-size:23px;
    margin: 0 auto;
`

<H1>A big ol' heading</H1>
```
- Use this to create a React component with styling
- Our convention is to use this for more common components used throughout the application
    
2. Pass css variables
```
import { css } from 'emotion';

export const totalContainer = css`
    background-color: rgba(86,186,130,0.1);
    display: flex;
    justify-content: space-between;
    padding: 12px 15px;
    width: 100%;
    position: relative;
    left: -15px;
    bottom: -15px;
`

<div className={totalContainer}>
    { various other children here }
</div>
```
- Use this to pass to pass styling to standard html elements or add additonal styling to a Styled Component
- Our convention is to use css variables for styling specific to a page

You can do a lot of other neat stuff with emotion.js like pass props and specific classnames. Check out the docs for more info: https://emotion.sh/docs/introduction

### Run Woodhouse

Install dependencies

    $ npm install

Start development server 

    $ npm start

Woodhouse runs on port 3000 (`localhost:3000`)

Update the localhost url appending the LeaseSettings object optional personalized hash identified in the previous step like this:

format: `localhost:3000/{your-lease-settings-id}/v={your-optional-personalized-hash}`

without hash: `localhost:3000/1`

with hash: `localhost:3000/1/?v=za7jDFkEML`


### E2E Testing

We are using [Cypress](https://docs.cypress.io/api/api/table-of-contents.html) for E2E testing, this is very much in the early stages so there is still a lot TODO. The example files have also been intentionally included to provide a better experience when onboarding and can be removed later.

- Adding it to CI
- Plan for managing test objects that are created/used
- Adding more better helpers (such as login)
- Mocking requests to 3rd parties (using polly.js)

this is just to name a few

Run Cypress GUI

    $ npm cypress:open

Run Cypress CLI 

    $ npm run cy:run
    
- _it will use the systems node version_
