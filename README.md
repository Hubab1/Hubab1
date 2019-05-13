# Woodhouse

![Woodhouse](https://i2.wp.com/www.bubbleblabber.com/wp-content/uploads/2015/06/Woodhouse.jpg)

online leasing front end

## Development Setup


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


### Create LeaseSettings in Chuck

Create or identify a LeaseSettings object here: http://localhost:8000/admin/onlineleasing/leasesettings/
Feel free to use the following images / colors if creating a LeaseSettings object:
    
    background: 'https://nestiolistings-assets-dev.s3.amazonaws.com/onlineleasing_background/b10195d50ab77145bdf59e0b54b2fe5d.png',
    logo: 'https://nestiolistings-assets-dev.s3.amazonaws.com/onlineleasing_logos/c9bed1d02d3b3b0a0f1c19a3ec4b8e9c.png',
    primary_color: '286165',
    secondary_color: 'FFFFFF'

If you'd like to make a personalized link with associated client and/or unit data, you can create a hash in the shell with [PersonalizedHash](https://github.com/Nestio/chuck/blob/d6eadddac786af3a0af4acdaf017f1c5fc64a954/chuck/onlineleasing/utils.py#L6)


### Run Woodhouse

Install dependencies

    $ npm install

Start development server 

    $ npm start

Woodhouse runs on port 3000 (`localhost:3000`)

Update the localhost url appending the LeaseSettings object optional personalized hash identified in the previous step like this:

format: `localhost:3000/{your-lease-settings-id}/v={your-optional-personalized-hash}`

without hash: `localhost:3000/1`

with hash: `localhost:3000/1/v=za7jDFkEML`
