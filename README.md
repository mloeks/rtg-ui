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

### EURO 2024

### Must
* Manually test if everything is still running, without upgrading ...

### Should

#### Upgrades
* Check lib-upgrades branch
* Make npm i work with more recent node LTS, removing and re-creating package-lock.json fails currently

#### Other
* Cookie Consent according to legal requirements
  * As only technically required cookies are being used (for e.g. session and login), this should be rather straightforward
* Minor redesign (new colour palette, fonts, images)
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
* Known Bugs:
  * Drawer Menu is too wide in desktop breakpoints --> due to changed matchMedia events, which are registered in GameCard. Move to more cross-cutting, top level component?
  * Header display/disappearance is not animated anymore (AppBar overwrites CSS properties in Header.scss)
* Ideas for small improvements:
  * Allow admins to enter results in the UI
  * Place info about open bets to the very top
  * Show quotes from bwin or similar below games (also get results from there?)