# CWNOS Dashboard

Dashboard for the [nodeDB](https://github.com/FFM/FFM).

## Concepts

The Dashboard is a web-application that helps users interact with various
components of the [Common Wireless Network Operating
System](https://github.com/FFM/FFM/blob/master/doc/cwnos.md). It will allow
users to manage their nodes, devices and adresses. It can integrate with
further services (such as e.g. statistics).

Currently the Dashboard is in heavy development and not ready to use for
production: So be aware of this when trying it out.

## Installation

Clone the github directory into a publicly accessible folder on a Web-page
(since this is only html5 and javascript it should run pretty much
everywhere).

To install a development version on your computer: 

* Clone the repo to your computer (maybe fork it first, so you can properly
  issue pull request)
* Run a development webserver
  ```
  python2 -m SimpleHTTPServer
  ```
* point your browser to [http://localhost:8000](http://localhost:8000/)
* If the NodeDB endpoint you are using is behind a .htaccess: copy
  js/settings.js.tmpl to js/settings.js and edit accordingly

## Contributing

Contributions are highly welcome. You can contribute on several places.

### Testing

Take the dashboard for a spin and report [issues and bugs](issues/).
Please also help us think of [User Stories](tree/master/doc/userstories.md)
- so we can target development better.

### Documentation

The [doc](treee/master/doc/) subdirectory contains the documentation for the Dashboard
(both user and developer documentation). 

### Design

The dashboard needs serious design UX love. This is the place where new
users will interact with your network for the first time (using software).
Ideally it is welcoming and user-friendly. The [css](tree/master/css/) and
[templates](tree/master/templates/) directories are where you want to look and work. We
use [Mustache](http://mustache.github.io/) as a templating language. The
design heavily relies on [Boostrap 2.3.2](http://getbootstrap.com)

### Development

If you are a javascript developer or would like to become one, you can
contribute to the code that glues everything together. We decided to use
[Backbone](http://backbonejs.org) as a framework with
[Mustache](http://mustache.github.io) as a templating language. We further
use [Bootstrap - 2.3.2](http://getbootstrap.com/) for design templates. 
