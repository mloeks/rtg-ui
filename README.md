# RTG UI

## Toolchain

This project is built using [create-react-app](https://github.com/facebookincubator/create-react-app).

### Material UI

Material UI has been added as CSS Framework as described [here](https://stackoverflow.com/a/44197904).

### Sass

Sass support has been configured as described [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-css-preprocessor-sass-less-etc).

## Current Issues / Outstanding TODOs

### Registration

* configure backend field error messages to be better
* Style non-field-errors a bit nicer
* send form on Enter

* (implement "first-time" flag for subsequent login)
* (first/last name info as icon + popup)
* (ability to make password visible)

### Forgot Password

* Latest achievement: Backend request works
* Now: Request error and success handling
* Client-Side form validation
* Continue with reset page (token!)

### Authentication

* do I ever need to check and/or refresh the token?
* Handle token expiry
* use JWT correctly --> auth details should be stored within the token, which then is decoded in the client

### Foyer

* Adding posts
* Take post pagination into account

### Design

#### Reception
* Migrate from old design - with login and registration form

#### Foyer
* Make post cards prettier, give no-avatar letter circles random colours

#### Header
* Show User Avatar and name on the top right with a dropdown menu for Profile and Logout
* make sticky (position: fixed but still take up top space)
* Make it V-shaped using SVG or CSS skewing, logo in the middle, apply fading leather texture on the top?

#### Footer
* Start migrating the (mostly static) footer

#### Big Pictures
* include a react lib for parallax effect

### General
* Add Fetch/Promise polyfill for IE, if it's not already included in create-react-app config.

## Learnings during dev

### React Router

Helpful articles I worked through during setup:
* [This article on Medium](https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf)
* [This post on SitePoint](https://www.sitepoint.com/react-router-v4-complete-guide/)

#### Authentication

Implementation is inspired by [this documentation](https://reacttraining.com/react-router/web/example/auth-workflow).