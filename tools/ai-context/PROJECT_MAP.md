# LingoLinq-AAC Project Map

## Project Type
Ruby on Rails AAC (Augmentative and Alternative Communication) Application

## Directory Structure
.
├── CHANGELOG.md
├── CODE_INVESTIGATION.md
├── Gemfile
├── Gemfile.lock
├── Guardfile
├── LICENSE
├── Procfile
├── README.md
├── Rakefile
├── TRANSLATIONS.md
├── app
│   ├── assets
│   ├── controllers
│   ├── frontend
│   ├── helpers
│   ├── mailers
│   ├── models
│   └── views
├── bin
│   ├── bundle
│   ├── deploy_prep
│   ├── devin
│   ├── heroku_console
│   ├── push_deploy
│   ├── rails
│   └── rake
├── config
│   ├── app_schemes.json
│   ├── application.rb
│   ├── boot.rb
│   ├── database.yml
│   ├── environment.rb
│   ├── environments
│   ├── initializers
│   ├── locales
│   ├── newrelic.yml
│   ├── puma.rb
│   ├── routes.rb
│   ├── shards.yml
│   ├── storage.yml
│   └── unicorn.rb
├── config.ru
├── core_ngrams.rb
├── db
│   ├── migrate
│   ├── schema.rb
│   └── seeds.rb
├── deepwiki-mcp
│   ├── CHANGELOG.md
│   ├── CONTRIBUTING.md
│   ├── Dockerfile
│   ├── LICENSE
│   ├── README.md
│   ├── bin
│   ├── build.config.ts
│   ├── docs
│   ├── eslint.config.js
│   ├── logo.svg
│   ├── package-lock.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── public
│   ├── repomix.config.json
│   ├── scripts
│   ├── src
│   ├── tests
│   └── vite.config.ts
├── docs
│   └── UX-UI-Modernization-Plan.md
├── i18n_generator.rb
├── lib
│   ├── admin_constraint.rb
│   ├── app_searcher.rb
│   ├── arpa_to_json.rb
│   ├── assets
│   ├── basic_inflections.xlsx
│   ├── board_merger.rb
│   ├── converters
│   ├── core_lists.json
│   ├── core_suggestions.json
│   ├── domains.json.example
│   ├── exporter.rb
│   ├── external_tracker.rb
│   ├── feature_flags.rb
│   ├── flusher.rb
│   ├── focus_words.json
│   ├── fringe_suggestions.json
│   ├── geolocation.rb
│   ├── json_api
│   ├── message_bank_suggestions.json
│   ├── moby_parser.rb
│   ├── mobyposi.i
│   ├── purchasing.rb
│   ├── purchasing2.rb
│   ├── pusher.rb
│   ├── renamer.rb
│   ├── sentence_pic.rb
│   ├── slow_worker.rb
│   ├── stats.rb
│   ├── tasks
│   ├── templates
│   ├── tinycolor_convert.js
│   ├── transcoder.rb
│   ├── uploader.rb
│   └── worker.rb
├── package-lock.json
├── premium_features.md
├── public
│   ├── 404.html
│   ├── 422.html
│   ├── 500.html
│   ├── _bootstrap
│   ├── alt-aac
│   ├── app.ico
│   ├── assets
│   ├── avatars
│   ├── clippy.swf
│   ├── example-override.css
│   ├── favicon-old.ico
│   ├── favicon.ico
│   ├── fonts
│   ├── icons
│   ├── images
│   ├── locales
│   ├── mespeak
│   ├── offline.json
│   ├── robots.txt
│   ├── sounds
│   ├── speak_js
│   ├── status
│   └── walkthrough
└── spec
    ├── controllers
    ├── features
    ├── javascripts
    ├── lib
    ├── mailers
    ├── models
    └── spec_helper.rb

51 directories, 89 files

## Key Configuration Files
./Gemfile
./Gemfile.lock
./Rakefile
./config.ru
./core_ngrams.rb
./i18n_generator.rb

## Rails App Structure
- app/controllers/ - Request handling
- app/models/ - Data models and business logic
- app/views/ - Templates and UI
- app/frontend/ - Frontend assets (modern JS)
- config/ - Rails configuration
- db/ - Database migrations and schema
- spec/ - RSpec test suite

## Recent Git Changes
61272d8e3 Create UX-UI-Modernization-Plan.md
357e6b36f Update README.md
ac30e2981 Update README.md
fc1bc0e07 Merge pull request #1 from swahlquist/devin/1753200562-update-sweetsuite-branding
ae4f59b05 Update branding from SweetSuite to LingoLinq-AAC throughout codebase
6865d7181 Setup: Update Ruby version to 3.2.2 and update dependencies for Devin workspace
55aaa8aab spec cleanup after rails upgrade
84d7c912f frontent dependency fixes
e49af4342 spec cleanups
76d23747f first pass at removing copyrighted name

Generated: Wed Jul 23 16:04:08 UTC 2025
