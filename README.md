# RTG UI


## Toolchain

This project is built using [create-react-app](https://github.com/facebookincubator/create-react-app).

### Material UI

Material UI has been added as CSS Framework as described [here](https://stackoverflow.com/a/44197904).

### Sass

Sass support has been configured as described [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-a-css-preprocessor-sass-less-etc).

## Current Issues

### Authentication

* User needs to re-login on every real page reload
* It seems a bit messy to use the authService singleton all over the app. It would be nice to have the authentication info in the App's state.

## Outstanding TODOs

* fetch polyfill


## Learnings during dev

### React Router

Helpful articles I worked through during setup:
* [This article on Medium](https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf)
* [This post on SitePoint](https://www.sitepoint.com/react-router-v4-complete-guide/)

#### Authentication

Implementation is inspired by [this documentation](https://reacttraining.com/react-router/web/example/auth-workflow).