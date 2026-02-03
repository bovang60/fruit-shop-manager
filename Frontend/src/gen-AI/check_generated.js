import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

function toPascal(k) {
  return k.split(/[-_]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
}

function read(p) {
  try { return fs.readFileSync(p, 'utf8') } catch (e) { return null }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const kebab = process.argv[2]
if (!kebab) {
  console.error('Usage: node src/gen-AI/check_generated.js <kebab-screen>')
  process.exit(2)
}

const pascal = toPascal(kebab)
const base = path.join(__dirname, '..', 'components', kebab)
const files = {
  container: path.join(base, `${pascal}.tsx`),
  view: path.join(base, `${pascal}View.tsx`),
  css: path.join(base, `${pascal}.css`),
}

const report = []

// 1) files exist
for (const [k, fp] of Object.entries(files)) {
  const ok = fs.existsSync(fp)
  report.push({ id: `file:${k}`, ok, msg: ok ? 'exists' : `missing: ${fp}` })
}

// early exit if missing files
if (!report.find(r => r.id === 'file:container').ok || !report.find(r => r.id === 'file:view').ok) {
  console.log(JSON.stringify(report, null, 2))
  console.log('\nSummary: some required files are missing.');
  process.exit(1)
}

const containerSrc = read(files.container) || ''
const viewSrc = read(files.view) || ''
const cssSrc = read(files.css) || ''

// 2) view imports its CSS
const cssImportRegex = new RegExp(`import\\s+['\\\"]\\.\/` + pascal + `\\.css['\\\"]`)
report.push({ id: 'view:imports-css', ok: cssImportRegex.test(viewSrc), msg: cssImportRegex.test(viewSrc) ? 'ok' : 'view does not import CSS' })

// 3) container imports and renders the View component
const importView = new RegExp(`from\\s+['\\\"]\\.\\\/${pascal}View['\\\"]`)
const rendersView = new RegExp(`<${pascal}View[\\s>\\/]`)
report.push({ id: 'container:imports-view', ok: importView.test(containerSrc), msg: importView.test(containerSrc) ? 'ok' : 'container does not import View' })
report.push({ id: 'container:renders-view', ok: rendersView.test(containerSrc), msg: rendersView.test(containerSrc) ? 'ok' : 'container does not render <View />' })

// 4) view declares Props type/interface
const propsDecl = /(?:interface|type)\\s+Props\\b/
report.push({ id: 'view:declares-props', ok: propsDecl.test(viewSrc), msg: propsDecl.test(viewSrc) ? 'ok' : 'view missing Props type/interface' })

// 5) container passes props (basic check: container contains <PascalView and a prop name)
const passesProps = new RegExp(`<${pascal}View[\\s\\S]*?/>`) // rudimentary
report.push({ id: 'container:passes-props', ok: passesProps.test(containerSrc), msg: passesProps.test(containerSrc) ? 'ok' : 'container does not pass props to view' })

// 6) View uses class-name contract (check for some common classes)
const requiredClasses = ['register-root','login-root','field','form-actions','primary','link-btn','products-grid','product-card']
const foundClasses = requiredClasses.filter(c => viewSrc.includes(c) || cssSrc.includes('.' + c))
report.push({ id: 'view:uses-classes', ok: foundClasses.length > 0, msg: foundClasses.length > 0 ? `found: ${foundClasses.join(',')}` : 'none of expected classes found in view or css' })

// 7) Accessibility: labels present
report.push({ id: 'view:labels', ok: /<label\\b/.test(viewSrc), msg: /<label\\b/.test(viewSrc) ? 'labels found' : 'no <label> elements' })

// 8) inline styles check
report.push({ id: 'no:inline-styles', ok: !/style=\\{/.test(viewSrc) && !/style=\\{/.test(containerSrc), msg: /style=\\{/.test(viewSrc) || /style=\\{/.test(containerSrc) ? 'inline styles found' : 'no inline styles' })

// 9) mock API behavior in container
const mockApiRegex = /setTimeout\(|\/\/\s*TODO:\s*connect API|mock/i
report.push({ id: 'container:mock-api', ok: mockApiRegex.test(containerSrc), msg: mockApiRegex.test(containerSrc) ? 'mock API detected' : 'no mock API behavior found' })

// print JSON and human summary
console.log(JSON.stringify(report, null, 2))
console.log('\nSummary:')
for (const r of report) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'} - ${r.id} - ${r.msg}`)
}

const failed = report.filter(r => !r.ok)
process.exit(failed.length === 0 ? 0 : 1)
