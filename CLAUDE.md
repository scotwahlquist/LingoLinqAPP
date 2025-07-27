# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

LingoLinq AAC is an open-source web-based Augmentative and Alternative Communication (AAC) application with a dual-framework architecture:

- **Backend**: Ruby on Rails 6.1 (goal: upgrade to 7.2) with PostgreSQL and Redis
- **Frontend**: Ember.js ~3.12.0 application located in `app/frontend/`
- **Communication**: REST API between frontend and backend
- **Deployment**: Heroku-ready with Procfile configuration

## Development Commands

### Backend Commands (Rails)
```bash
# Setup
bundle install
rails extras:assert_js          # Fix symbolic links
rails db:create
rails db:migrate
rails db:seed                   # Optional: adds example/password login

# Development
rails server                    # Start Rails server (port 3000)
rails console                   # Local console
bin/heroku_console             # Production console (audited)

# Testing
rspec                          # Run Ruby tests
bundle exec guard              # Watch mode for tests
```

### Frontend Commands (Ember)
```bash
cd app/frontend
npm install
bower install                  # Legacy dependency manager
ember serve                    # Development server
ember build                    # Production build
ember test                     # Run tests
```

### Full System
```bash
gem install foreman
foreman start                  # Runs all processes from Procfile
# or
heroku local                   # Alternative with heroku-cli
```

### Deployment Preparation
```bash
bin/deploy_prep               # Precompile assets
rake extras:mobile            # Prep mobile releases
rake extras:desktop           # Prep desktop releases
```

## Key Technical Constraints

### Internationalization (i18n)
- **CRITICAL**: All user-facing strings must use i18n helpers
- Template: `{{t "key" key="translation_key"}}`
- JavaScript: `i18n.t('key', "fallback string")`
- **Convention**: Double quotes for user-facing strings, single quotes for everything else
- Translation management: `i18n_generator.rb`

### Multi-Platform Support
- Code runs as: web app, mobile app (Cordova), desktop app (Electron)
- Platform-specific code must use `capabilities` library
- Feature flags required for new user-facing features (`lib/feature_flags.rb`)

### Code Style
- Backend: Ruby/Rails conventions
- Frontend: Ember.js conventions with ES6+
- No hardcoded text strings in user interfaces
- Use Feature Flags for beta features and UI changes

## Architecture Components

### Backend Key Directories
- `app/models/concerns/` - Shared model behaviors (async, caching, permissions, etc.)
- `app/controllers/api/` - API endpoints
- `lib/json_api/` - API response serializers
- `lib/converters/` - Import/export functionality (OBF, PDF, PNG, etc.)
- `config/initializers/` - App configuration

### Frontend Key Directories
- `app/frontend/app/` - Ember application code
- `app/frontend/config/` - Build configuration
- `app/frontend/tests/` - Frontend test suite

### Database
- Primary: PostgreSQL with `pg_search` for full-text search
- Cache: Redis for sessions, jobs, and caching
- Background Jobs: Resque queue system
- Auditing: All production console access audited via `AuditEvent`

## External Dependencies

### Required Services
- **Redis**: Required for development and production
- **PostgreSQL**: Primary database
- **Node.js**: Frontend build process
- **ImageMagick**: Image processing (`convert`, `identify`, `montage`)
- **Ghostscript**: PDF generation (`gs`)

### Optional Integrations (see `.env.example`)
- AWS services: S3, SES, SNS, Elastic Transcoder
- Google APIs: Places, Translate, Maps, TTS
- External: Bugsnag, New Relic, Stripe, ZenDesk

## Scheduled Tasks (Production)
```bash
# Heroku Scheduler tasks
rake check_for_expiring_subscriptions # daily
rake generate_log_summaries           # hourly
rake push_remote_logs                 # hourly
rake check_for_log_mergers           # hourly
rake advance_goals                   # hourly
rake transcode_errored_records       # daily
rake flush_users                     # daily
rake clean_old_deleted_boards        # daily
```

## Data Format Standards
- Boards use Open Board Format (OBF) - see http://www.openboardformat.org
- Export/import maintains cross-platform compatibility
- API follows JSON API specification patterns

## Development Workflow
1. Changes require internationalization for user-facing features
2. New features should be feature-flagged initially
3. Platform compatibility must be maintained (web/mobile/desktop)
4. API changes should maintain backward compatibility
5. Database changes require migrations

## Testing Strategy
- Backend: RSpec test suite
- Frontend: Ember QUnit tests
- Console access in production requires audit logging
- Use `Worker.method_stats(queue_name)` for background job monitoring