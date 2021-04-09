import { Preset, color } from 'apply'

Preset.setName('svelte-add/supabase')
Preset.editNodePackages().addDev("@supabase/supabase-js", "^1.8.0").withTitle("Installing `@supabase/supabase-js`")

Preset.env().createIfMissing()
  .set('VITE_SUPABASE_URL', '<your-supabase-url>')
  .set('VITE_SUPABASE_ANON_KEY', '<your-supabase-public-key>')
  .set('SUPABASE_PRIVATE_KEY', '<your-supabase-private-key>')
  .set('SUPABASE_JWT_SECRET', '<your-supabase-jwt-secret>')

Preset.edit('.gitignore').update(content => {
  if (content.match(/^\.env/m)) {
    return content
  }

  return content + ".env\n"
})

Preset.extract().to('src/lib')

Preset.instruct([
  `Run ${color.magenta("npm install")}, ${color.magenta("pnpm install")}, or ${color.magenta("yarn")} to install dependencies`,
  `Add your supabase keys to your ${color.green('.env')} file`,
  `You can access the db via ${color.green("import supabase from '$lib/db'")}`
]).withHeading('Completing setup')
