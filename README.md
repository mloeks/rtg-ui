# RTG UI

## Current upgrades & TODOs

* create-react-app v2.x
    * https://github.com/facebook/create-react-app/releases
* Prepare for React 17
    * Replace deprecated lifecycle methods
    
### Testing

#### Explorative

* Do some more intensive explorative testing after the Material UI upgrade

#### Automated

* Start writing some basic "money path" Browser tests in a separate repo using Geb


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

* (first/last name info as icon + popup)

### Forgot Password

* (Style progress indicator and success message a bit nicer)

### Design

#### Header
* Make it V-shaped using SVG or CSS skewing, logo in the middle, apply fading leather texture on the top?

## Learnings during dev

#### Authentication

Implementation is inspired by [this documentation](https://reacttraining.com/react-router/web/example/auth-workflow).