## [2.5.1](https://github.com/palhinhax/TheBate/compare/v2.5.0...v2.5.1) (2026-01-09)


### Bug Fixes

* **ui:** improve mobile responsiveness for topic pages ([cf210b2](https://github.com/palhinhax/TheBate/commit/cf210b246f99a1beb64f08599c74ff83cf3b74fe))

# [2.5.0](https://github.com/palhinhax/TheBate/compare/v2.4.0...v2.5.0) (2026-01-09)


### Features

* **legal:** add Terms of Service and Privacy Policy pages ([5941885](https://github.com/palhinhax/TheBate/commit/59418854e7aca2556eb3f7bf5ea3a35533781306))

# [2.4.0](https://github.com/palhinhax/TheBate/compare/v2.3.0...v2.4.0) (2026-01-09)


### Features

* **search:** add search functionality with language filtering ([9142ef3](https://github.com/palhinhax/TheBate/commit/9142ef3cc0cb24c7dacd48e3c7e8251432f5e8ac))

# [2.3.0](https://github.com/palhinhax/TheBate/compare/v2.2.0...v2.3.0) (2026-01-09)


### Features

* **i18n:** add 5 new languages with UI support and 50 controversial topics ([bc06564](https://github.com/palhinhax/TheBate/commit/bc065649cf768d443646bf35b20bc26c1a0a75e3))

# [2.2.0](https://github.com/palhinhax/TheBate/compare/v2.1.0...v2.2.0) (2026-01-09)


### Features

* **topics:** add controversial gun control topics in all languages ([bbf57d7](https://github.com/palhinhax/TheBate/commit/bbf57d78ea8a0bdf6a78fb934a1137d8dcdb65a2))

# [2.1.0](https://github.com/palhinhax/TheBate/compare/v2.0.2...v2.1.0) (2026-01-09)


### Features

* **i18n:** add Hindi and Chinese language support ([3773192](https://github.com/palhinhax/TheBate/commit/3773192b1766e8ecda320b286b57bf4ab6d459f5))

## [2.0.2](https://github.com/palhinhax/TheBate/compare/v2.0.1...v2.0.2) (2026-01-09)


### Bug Fixes

* **build:** remove database migration from vercel-build script ([b03d42d](https://github.com/palhinhax/TheBate/commit/b03d42d59e116af6d773deeeba31d1d7afcf775d))

## [2.0.1](https://github.com/palhinhax/TheBate/compare/v2.0.0...v2.0.1) (2026-01-09)


### Bug Fixes

* **i18n:** add robust array validation for preferredContentLanguages ([a271fab](https://github.com/palhinhax/TheBate/commit/a271fab1ab3f5254c7bde535b26ecd0af34a17d4))

# [2.0.0](https://github.com/palhinhax/TheBate/compare/v1.9.0...v2.0.0) (2026-01-09)


### Bug Fixes

* **i18n:** sync public locale files with updated translations ([4d35f5c](https://github.com/palhinhax/TheBate/commit/4d35f5cb53985ec425f67aea4116f0b2d9419dcc))


### Features

* **admin:** add pagination to admin panel and fix language filtering ([fefab55](https://github.com/palhinhax/TheBate/commit/fefab556f28f8e974d03a876dc286e37e38f19c1))
* **settings:** add multi-language content preferences ([a4afaec](https://github.com/palhinhax/TheBate/commit/a4afaec0af80560c46349f0a5565ae8ffaeea4fe))


### BREAKING CHANGES

* **admin:** Admin topics API now returns object with {topics, pagination} instead of array
* **settings:** Content language filtering moved from navbar to user settings. All users will see all languages by default until they configure their preferences in settings.

# [1.9.0](https://github.com/palhinhax/TheBate/compare/v1.8.0...v1.9.0) (2026-01-09)


### Features

* **i18n:** add missing settings translations for es, fr, de ([4c51f3c](https://github.com/palhinhax/TheBate/commit/4c51f3c9658f358b253ec04eba87e592b7f9a92c))

# [1.8.0](https://github.com/palhinhax/TheBate/compare/v1.7.1...v1.8.0) (2026-01-09)


### Bug Fixes

* **adsense:** improve ad loading debug and troubleshooting ([c18f5e5](https://github.com/palhinhax/TheBate/commit/c18f5e51d65bc2ac369b1b6ff961c4ba72704b76)), closes [#adsense-blank-ads](https://github.com/palhinhax/TheBate/issues/adsense-blank-ads)
* **ui:** wrap content language filter in suspense boundary ([a3bbad8](https://github.com/palhinhax/TheBate/commit/a3bbad89f4fdccc2f94985cb309064a2bddfe97f))


### Features

* **i18n:** separate UI language settings from content language filter ([ff8c699](https://github.com/palhinhax/TheBate/commit/ff8c699431488aaeded927dcb216a02300760629))
* **moderation:** add topic reporting system ([64d708c](https://github.com/palhinhax/TheBate/commit/64d708ca851b61490be9664736917b25e7378979))
* **profile:** add user self-deletion functionality ([a75a818](https://github.com/palhinhax/TheBate/commit/a75a81876b789dbe53a71a9a2fe938e683426f13))
* **seo:** enhance multilingual SEO for international discoverability ([f1984b7](https://github.com/palhinhax/TheBate/commit/f1984b735ca9a4dee7a547dbe8ac8b966752295c))
* **settings:** add comprehensive user settings page ([a3e3167](https://github.com/palhinhax/TheBate/commit/a3e3167433f2b96920be9e81f2a89c4b9fb067f8))

## [1.7.1](https://github.com/palhinhax/TheBate/compare/v1.7.0...v1.7.1) (2026-01-09)


### Bug Fixes

* **i18n:** eliminate all Brazilian Portuguese terms from documentation ([b8954bc](https://github.com/palhinhax/TheBate/commit/b8954bc83ecda03963650007d45ab97843f38786))

# [1.7.0](https://github.com/palhinhax/TheBate/compare/v1.6.1...v1.7.0) (2026-01-09)


### Bug Fixes

* **admin:** convert all text to European Portuguese ([605b9df](https://github.com/palhinhax/TheBate/commit/605b9dfd47e454550676dfceb45df0a7bef02ce1))


### Features

* **data:** add hot topics seed script for multiple languages ([a9fbf32](https://github.com/palhinhax/TheBate/commit/a9fbf322b127400bb96c9437f8e164ae3c73a5be))

## [1.6.1](https://github.com/palhinhax/TheBate/compare/v1.6.0...v1.6.1) (2026-01-09)


### Bug Fixes

* **admin:** improve responsiveness and use European Portuguese ([0c500b8](https://github.com/palhinhax/TheBate/commit/0c500b8a9e14022d4914c28bbdf93fe59c226b57))

# [1.6.0](https://github.com/palhinhax/TheBate/compare/v1.5.3...v1.6.0) (2026-01-09)


### Features

* **profile:** create comprehensive user profile page ([17cbc49](https://github.com/palhinhax/TheBate/commit/17cbc497afba0f8380696d7dacf7fabf633fe447))

## [1.5.3](https://github.com/palhinhax/TheBate/compare/v1.5.2...v1.5.3) (2026-01-09)


### Bug Fixes

* **ui:** make comment sort and filter buttons responsive ([c89c418](https://github.com/palhinhax/TheBate/commit/c89c418319d29c58b6e16f4a7b0a4207e398a3b3))

## [1.5.2](https://github.com/palhinhax/TheBate/compare/v1.5.1...v1.5.2) (2026-01-09)


### Bug Fixes

* **ui:** make navbar responsive for mobile devices ([431ac37](https://github.com/palhinhax/TheBate/commit/431ac37f879b4d13ea31acc196b78214f059b36a))

## [1.5.1](https://github.com/palhinhax/TheBate/compare/v1.5.0...v1.5.1) (2026-01-09)


### Bug Fixes

* **db:** add automatic migration deployment for production ([eee13a4](https://github.com/palhinhax/TheBate/commit/eee13a4de2d4148dad6074bf114f94e1f4c60324))

# [1.5.0](https://github.com/palhinhax/TheBate/compare/v1.4.0...v1.5.0) (2026-01-09)


### Bug Fixes

* **auth:** address security and code quality issues ([31815b9](https://github.com/palhinhax/TheBate/commit/31815b9d39ee9a397ca2ba9e77b25fea44c50605))
* **auth:** improve rate limiting for serverless and add tests ([7740e26](https://github.com/palhinhax/TheBate/commit/7740e26e868d014e8f7415130cd3a055b91d04d5))
* **i18n:** convert Brazilian Portuguese to European Portuguese ([32b6280](https://github.com/palhinhax/TheBate/commit/32b6280b828cb3763bd246365def9282e8a50e97))
* **i18n:** replace hardcoded strings with translations in topic form ([69f5a21](https://github.com/palhinhax/TheBate/commit/69f5a21acf29dc2a399cf107c52e376afc620c0a))
* resolve linting and build errors ([29e5cb2](https://github.com/palhinhax/TheBate/commit/29e5cb2c736df6d7187355c7ddae7eee3837a24a))
* **tests:** use proper type assertion for Request mocks ([790cc97](https://github.com/palhinhax/TheBate/commit/790cc97ecf37b073f1eb18acb2867f40de30eab7))


### Features

* **auth:** implement email verification with Resend ([314b4df](https://github.com/palhinhax/TheBate/commit/314b4dffc1444a431f47103765ae62a834e68a68))
* **auth:** implement password reset with magic link ([2998103](https://github.com/palhinhax/TheBate/commit/29981030ca8d7966202c1ad0ffa5aab67270ef51))
* **database:** update environment configuration for Neon PostgreSQL and add setup guide ([d0735d0](https://github.com/palhinhax/TheBate/commit/d0735d07ee77591204305a5ecbb920e34eeb8304))
* **email:** integrate Resend for production email delivery ([048b4e9](https://github.com/palhinhax/TheBate/commit/048b4e9056fbb929f360a2d54cefa77f821767ef))
* **i18n:** add translation support for password reset pages ([3824d8c](https://github.com/palhinhax/TheBate/commit/3824d8c5aa6e0e953d2736b2460f768da396499c))

# [1.4.0](https://github.com/palhinhax/TheBate/compare/v1.3.0...v1.4.0) (2026-01-08)


### Features

* **auth:** add password visibility toggle button to register form ([7af1788](https://github.com/palhinhax/TheBate/commit/7af1788fff7234715744f135abdc777b15af649c))

# [1.3.0](https://github.com/palhinhax/TheBate/compare/v1.2.0...v1.3.0) (2026-01-08)


### Features

* **admin:** add admin panel for content moderation ([f814678](https://github.com/palhinhax/TheBate/commit/f8146787289a4004461e81299abeadf3e44542ad))
* **admin:** add owner system with user management ([a94ecf0](https://github.com/palhinhax/TheBate/commit/a94ecf046640aaf63efbdde6390a27a920244a88))

# [1.2.0](https://github.com/palhinhax/TheBate/compare/v1.1.2...v1.2.0) (2026-01-08)


### Features

* **ads:** configure in-article AdSense with real slot ID ([a24da51](https://github.com/palhinhax/TheBate/commit/a24da51450739092afe27c8c3ed8bc54fa0d78a2))

## [1.1.2](https://github.com/palhinhax/TheBate/compare/v1.1.1...v1.1.2) (2026-01-08)


### Bug Fixes

* **ads:** update placeholder text to Portuguese ([05f525f](https://github.com/palhinhax/TheBate/commit/05f525fc9590de565b7ea6e866557eb09707848e))

## [1.1.1](https://github.com/palhinhax/TheBate/compare/v1.1.0...v1.1.1) (2026-01-08)


### Bug Fixes

* **ads:** prevent AdSense 400 errors with invalid slot ID ([4726f31](https://github.com/palhinhax/TheBate/commit/4726f31f1592f67144ddc2815b02b9dd948a7287))

# [1.1.0](https://github.com/palhinhax/TheBate/compare/v1.0.2...v1.1.0) (2026-01-08)


### Features

* **ui:** add footer with version display ([273bc0b](https://github.com/palhinhax/TheBate/commit/273bc0bcde417797ebf6b2581a3a2d49f9ae7b9c))

## [1.0.2](https://github.com/palhinhax/TheBate/compare/v1.0.1...v1.0.2) (2026-01-08)


### Bug Fixes

* **ui:** prevent language dropdown from overflowing on mobile ([859e799](https://github.com/palhinhax/TheBate/commit/859e799364f773590d2bb29fb4c3038f68969e93))

## [1.0.1](https://github.com/palhinhax/TheBate/compare/v1.0.0...v1.0.1) (2026-01-08)

### Bug Fixes

- **release:** add npm plugin to update package.json version ([7734577](https://github.com/palhinhax/TheBate/commit/7734577531a34fd126b93ebb052b80565c4d4bd9))

# 1.0.0 (2026-01-08)

### Bug Fixes

- add trustHost to NextAuth config for production ([5a5faff](https://github.com/palhinhax/TheBate/commit/5a5faffe62f693281066be989ce3654d81b0caad))
- adicionar atributos autocomplete ao formulário de registro para sugestão de senha do navegador ([85fecb5](https://github.com/palhinhax/TheBate/commit/85fecb503bae1e29d432a5fddd335fef47a94aa8))
- **api:** remove unused error variable in version endpoint ([e0d22c1](https://github.com/palhinhax/TheBate/commit/e0d22c1fee3d5ca0846bb4aaf67c3ab5b080a96e))
- configure production URLs and fix TypeScript error in AdSense component ([e27a973](https://github.com/palhinhax/TheBate/commit/e27a973936e25be5c6a280d27c494757dc366d66))
- corrigir erros TypeScript - usar Prisma.sql/empty e remover referências a comment.score ([94b77b7](https://github.com/palhinhax/TheBate/commit/94b77b7c234486dd6f8ca6bf7b20c39d956ca85b))
- corrigir tipo any para typescript-eslint ([12e61bf](https://github.com/palhinhax/TheBate/commit/12e61bfd410cdc310c0d1626fa9e440d5933c191))
- disable auth middleware to resolve edge runtime errors ([31e6229](https://github.com/palhinhax/TheBate/commit/31e62297b44b595700e627462158dd1475a412a3))
- Fix TypeScript and linting errors, improve error handling ([0cf97f3](https://github.com/palhinhax/TheBate/commit/0cf97f31b64244470981e53746799634690f43ef))
- remove forced English fallback - users see only their chosen languages ([dd69d15](https://github.com/palhinhax/TheBate/commit/dd69d152ed465dd00d3ddbaf561905cefd757147))
- remove unused catch variables (ESLint) ([6179cc4](https://github.com/palhinhax/TheBate/commit/6179cc4f163c428ef1bf0da64991f0410b228fdb))
- remove unused imports and variables ([742bc61](https://github.com/palhinhax/TheBate/commit/742bc6120c617396d650c2cdeac38cbc88759c33))
- simplify middleware to prevent edge runtime errors ([e7da36d](https://github.com/palhinhax/TheBate/commit/e7da36df5ab9bc95152d7ff12ee5d08bcdf565ca))
- **test:** correct ad container element query ([66c84e9](https://github.com/palhinhax/TheBate/commit/66c84e9503529e08a17f6f57038f7c29196a5ca3))
- **ui:** improve button accessibility ([afc3f3a](https://github.com/palhinhax/TheBate/commit/afc3f3a0cba37d3f6d8f350352f14327286ef816))
- use native script tag for AdSense to avoid data-nscript error ([6a74cb7](https://github.com/palhinhax/TheBate/commit/6a74cb732454ac5ed3f7994e982854cecbdcc349))

### Features

- Add database schema, API endpoints for topics and comments ([73de4f8](https://github.com/palhinhax/TheBate/commit/73de4f843adb8d1c82a5c2d581da71876b1e6190))
- add favicon and app icons ([de46297](https://github.com/palhinhax/TheBate/commit/de46297c317a1f536630185eac28e0e5d4ef9db5))
- add language field to topic creation - required for all posts ([f118e6e](https://github.com/palhinhax/TheBate/commit/f118e6e1b1feb3445a0c3b24127b56fc33845e23))
- add multilingual support - 5 languages (EN, PT, ES, FR, DE) with global SEO ([ffbe4a5](https://github.com/palhinhax/TheBate/commit/ffbe4a53c5e8baa394b6a954ca8fda6210882720))
- Add SEO features (sitemap, robots, JSON-LD), user profiles, and fix TypeScript errors ([2fdf65f](https://github.com/palhinhax/TheBate/commit/2fdf65f604751c9e2b382984239a7c3e0112e3aa))
- Add UI components for topics, comments, and auth pages ([82849d4](https://github.com/palhinhax/TheBate/commit/82849d4d37d66f294c208b51668bf1a07123f952))
- add Vercel Analytics ([3be684e](https://github.com/palhinhax/TheBate/commit/3be684ed89cf0914e389ef511cac7d846b603cbc))
- add Vercel Speed Insights ([8224498](https://github.com/palhinhax/TheBate/commit/8224498aadc58bcc33c1e6f06bd323d343bf77e7))
- **api:** add version endpoint to retrieve package information ([d2730f5](https://github.com/palhinhax/TheBate/commit/d2730f543696a2715b1ff3ed107ee0772630d77b))
- intelligent language detection + controversial current topics (Trump, Maduro, Taiwan) ([a7fc4b2](https://github.com/palhinhax/TheBate/commit/a7fc4b201f306befabecac86dd9063c8fac1310a))
- usar logo sem background no navbar em vez de texto ([3378ee7](https://github.com/palhinhax/TheBate/commit/3378ee7f51d9b7f4897156ad163d68d785b108a5))

# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) and uses [Conventional Commits](https://www.conventionalcommits.org/) for automated changelog generation.
