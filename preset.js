import { Preset, color } from 'apply'

Preset.setName('svelte-add/supabase')
Preset.option('local', false)
Preset.option('auth', false);

Preset.editNodePackages().addDev("@supabase/supabase-js", "^1.29.4").withTitle("Installing `@supabase/supabase-js`")
Preset.editNodePackages().addDev("supabase", "^0.5.0").withTitle("Installing `supabase`").ifOption('local')
Preset.editNodePackages().addDev('cookie-es', "^0.5.0").withTitle("Installing `cookie-es`").ifOption('auth')

//Preset.execute('npx supabase init').withTitle("Initializing local supabase").ifHasOption('local')

Preset.env().createIfMissing()
  .set('VITE_SUPABASE_URL', '<your-supabase-url>')
  .set('VITE_SUPABASE_ANON_KEY', '<your-supabase-public-key>')
  .set('SUPABASE_PRIVATE_KEY', '<your-supabase-private-key>')
  .set('SUPABASE_JWT_SECRET', '<your-supabase-jwt-secret>')
  .ifOptionEquals('local', false)

Preset.env().createIfMissing()
  .set('VITE_SUPABASE_URL', 'http://localhost:54323')
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

Preset.extract('base').to('src/lib')
Preset.extract('auth').to('src').ifOption('auth')

Preset.instruct([
  `Configure your supabase environment vars in your ${color.green('.env')} file`,
  `You can access the db via ${color.green("import supabase from '$lib/db'")}`
]).withHeading('Configure database')

Preset.instruct([
  `Auth support has been installed to:`,
  `  ${color.green('src/hooks.js')}`,
  `  ${color.green('src/lib/auth/')}`,
  `  ${color.green('src/routes/auth/')}`,
  `  ${color.green('src/routes/api/auth/')}`,
  ``,
  `Update the ${color.green('src/routes/auth/example.svelte')} route with a table`,
  `in your database to see both SSR and client side query examples.`
]).withHeading('Auth Support')

Preset.instruct(`Run ${color.magenta("npm install")}, ${color.magenta("pnpm install")}, or ${color.magenta("yarn")} to install dependencies`)
  .withHeading('Completing setup')

// Preset.instruct([
//   `Initialize the local db with ${color.green('npx supabase init')}`,
//   `You can access the db via ${color.green("import supabase from '$lib/db'")}`
// ]).withHeading('Completing setup')
