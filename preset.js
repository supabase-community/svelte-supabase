import { Preset, color } from 'apply'
import fs from 'fs'

Preset.setName('svelte-add/supabase')
Preset.option('local', false)

Preset.editNodePackages().addDev("@supabase/supabase-js", "^1.8.0").withTitle("Installing `@supabase/supabase-js`")
Preset.editNodePackages().addDev("supabase", "^0.3.0").withTitle("Installing `supabase`").ifHasOption('local')

//Preset.execute('npx supabase init').withTitle("Initializing local supabase").ifHasOption('local')

Preset.env().createIfMissing()
  .set('VITE_SUPABASE_URL', '<your-supabase-url>')
  .set('VITE_SUPABASE_ANON_KEY', '<your-supabase-public-key>')
  .set('SUPABASE_PRIVATE_KEY', '<your-supabase-private-key>')
  .set('SUPABASE_JWT_SECRET', '<your-supabase-jwt-secret>')
  .ifOptionEquals('local', false)

Preset.env().createIfMissing()
  .set('VITE_SUPABASE_URL', 'http://localhost:8000')
  .set('VITE_SUPABASE_ANON_KEY', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTYwMzk2ODgzNCwiZXhwIjoyNTUwNjUzNjM0LCJyb2xlIjoiYW5vbiJ9.36fUebxgx1mcBo4s19v0SzqmzunP')
  .set('SUPABASE_PRIVATE_KEY', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTYwMzk2ODgzNCwiZXhwIjoyNTUwNjUzNjM0LCJyb2xlIjoic2VydmljZV9yb2xlIn0.necIJaiP7X2T2QjGeV')
  .set('SUPABASE_JWT_SECRET', 'super-secret-jwt-token-with-at-least-32-characters-long')
  .ifOptionEquals('local', true)

Preset.edit('.gitignore').update(content => {
  if (content.match(/^\.env/m)) {
    return content
  }

  return content + "\n.env\n"
})

Preset.extract().to('src/lib')

Preset.instruct([
  `Configure your supabase environment vars in your ${color.green('.env')} file`,
  `You can access the db via ${color.green("import supabase from '$lib/db'")}`
]).withHeading('Configure database')

Preset.instruct(`Run ${color.magenta("npm install")}, ${color.magenta("pnpm install")}, or ${color.magenta("yarn")} to install dependencies`)
  .withHeading('Completing setup')

// Preset.instruct([
//   `Initialize the local db with ${color.green('npx supabase init')}`,
//   `You can access the db via ${color.green("import supabase from '$lib/db'")}`
// ]).withHeading('Completing setup')
