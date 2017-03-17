<!-- Refer to Awesome Readme for tips on improving the readme file: https://github.com/matiassingers/awesome-readme -->
# bd-market

BD-Market is a Craigslist-type site for farmers to post goods and services.

The code is a fork of WikiTongues Poly

#Set-up
BD-Market is written in [Ruby on Rails](http://rubyonrails.org/) and [React.js](https://facebook.github.io/react/), and uses [RecordRTC](recordrtc.org) for video recording. It uses a [PostgreSQL](https://www.postgresql.org/) database, is deployed to [Heroku](heroku.com) and uses [Amazon S3](https://aws.amazon.com/s3) as CDN. RecordRTC relies on [NPM](https://www.npmjs.com/), which in turn requires [Browserify](http://browserify.org/).

To install and set up this application locally, follow the steps below.

##Pre-requisites
You will need the following things properly installed on your computer:
* [Git](http://git-scm.com/)
* [Ruby 2.3.0](https://www.ruby-lang.org/en/downloads/) (check what version of ruby you have by running `ruby -v`)
* [NPM](npmjs.com) (Installed with [Node.js](https://nodejs.org/en/))
* [Bundler](http://bundler.io/) (run `$ gem install bundler`)

On Heroku:

```bash
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-nodejs.git
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-ruby.git
```

##Install
1. Clone or fork this repository:

  ```shell
  git clone https://github.com/mapmeld/bd-market.git
  ```

2. Change into the new directory.
3.  Install all dependencies:

  ```shell
  bundle install && npm install
  ```

4.  Create a Postgres database:

  ```shell
  rake db:setup
  ```

##Run
To start the application locally, run:
```shell
rails server
```
Then, visit the app at [http://localhost:3000](http://localhost:3000).

##Test
Testing is implemented with RSpec, [FactoryGirl](https://github.com/thoughtbot/factory_girl_rails), [shouldamatchers](http://matchers.shoulda.io/) and [simplecov](https://github.com/colszowka/simplecov).

To run tests:

```shell
rspec
```

###Browser Testing
We're proud to do our live, web-based browser testing together with the awesome people at [BrowserStack](http://browserstack.com).

BrowserStack gives you instant access to all real mobile and desktop browsers. Say goodbye to your lab of devices and virtual machines. Go check them out!

[<img src="https://raw.githubusercontent.com/mapmeld/bd-market/master/repo/Browserstack_Logo.jpg" width="200px"/>](http://browserstack.com)

#Usage
The app is intended to be used via the UI by any person with access to a modern browser. As of February 21st, 2017, anyone will be able to create an account and start creating content.

[Video Demo](https://youtu.be/rt-NigJJCgI)

[Live App](bd-market.herokuapp.com)

#Feature Map
We use [semantic versioning](http://semver.org/).

#Security
The app requires a number of secret keys to function correctly. Features that will not work:
* Password reset
* Video recording

#Maintainers
|<img src="https://avatars1.githubusercontent.com/u/2080065?v=3&s=100" width="100px"/>|[Freddie Andrade](https://github.com/FredericoAndrade)|
|:---|:---|
|<img src="https://avatars3.githubusercontent.com/u/2336288?v=3&s=100" width="100px"/>|[Chris Voxland](https://github.com/ChrisVoxland)|
|<img src="https://avatars1.githubusercontent.com/u/12382534?v=3&s=100" width="100px"/>|[Ben Arias](https://github.com/bjlaa)|


##Request features
Feature requests may be made by [opening new issues](https://github.com/mapmeld/bd-market/issues/new) and labeling them enhancements.

##Best Practices
Refer to the [Github Contribution guide](https://guides.github.com/activities/contributing-to-open-source/) or the more comprehensive [Open-Source Contribution Guide](http://www.contribution-guide.org/) for best practices in contributing to open source projects.

<!-- Requirements -->

##Code of Conduct
All contributors will be held accountable to the [Contributor Covenant](https://github.com/mapmeld/bd-market/blob/master/CONDUCT.md).

TLDR: be nice. But go read it anyway.

#License
> BD-Market uses the GNU General Purpose License v3.

Read the license in detail [here](https://github.com/mapmeld/bd-market/blob/master/LICENSE.md).
