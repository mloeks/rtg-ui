# RTG UI

This repository contains the React-based frontend code for the RTG single page application.

## Toolchain

This project is built using [create-react-app](https://github.com/facebookincubator/create-react-app).

### Material UI

Material UI has been added as CSS Framework as described [here](https://stackoverflow.com/a/44197904).

### Sass

Sass support has been configured as described [here](https://create-react-app.dev/docs/adding-a-sass-stylesheet).

### Authentication & Authorisation

Implementation of authentication and authorisation is inspired by [this approach](https://reacttraining.com/react-router/web/example/auth-workflow).

## Current TODOs

* Thoroughly test login/registration after LoginError refactoring
* Check console output for linter complaints while manually browsing through the rtg pages

## Planned next features

### Must (for 2021 EURO)

* Library updates
* Cookie Consent according to legal requirements
    * As only technically required cookies are being used (for e.g. session and login), this should be rather straightforward

### Should

* Fix minor (but numerous) linter complaints
* Minor facelift, e.g. exchange some pictures (with own pictures?)
* Find replacements for some apparently unmaintained NPM modules
    * canvas-toBlob
    * hsl-to-hex
    * jwt-decode
    * verge

### Could

* Look to improve page speed for home page
* Performance improvements on bet page (look for unnecessary render cycles and state updates)
* Try out new styling approach coming with Material UI 3.5.1
    * https://github.com/mui-org/material-ui/releases/tag/v3.5.1