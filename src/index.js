
import fs from 'fs'
import path from 'path'

import interpret from 'interpret'

let interpretExts = Object.keys(interpret.extensions).sort((a, b) => {
  return a === '.js' ? -1 : b === '.js' ? 1 : a.localeCompare(b)
})

export default function interpreting (paths, options) {
  options = options || {}

  if (!Array.isArray(paths)) {
    paths = [paths]
  }

  let entries = entriesVariants(paths)

  entries = entries.filter(entryExists)

  if (!options.multiple) {
    entries = entries.slice(0, 1)
  }

  entries = entries
    .map(entryCompileRegister)
    .map(entryRequire)
    .map(entryPrepare)

  if (options.required && !entries.length) {
    throw new Error(`No files found: ${paths.map(v => `${v}.*`).join(' ')}`)
  }

  if (options.multiple) {
    if (options.join) {
      entries = entries.reduce((result, value) => {
        Object.assign(result, value)
        return result
      }, {})
    }

    return entries
  } else {
    return entries[0] || null
  }
}

function entriesVariants (paths) {
  return paths
    .map((entry) => {
      return entryData(entry, null)
    })
    .concat(
      paths.reduce((result, entry) => {
        return result.concat(interpretExts.map((ext) => {
          return entryData(entry, ext)
        }))
      }, [])
    )
}

function entryData (entry, ext) {
  return { ext, path: path.resolve(entry + (ext || '')) }
}

function entryExists (entry) {
  return fs.existsSync(entry.path)
}

const entryCompileRegisterCache = {}

function entryCompileRegister (entry) {
  if (entryCompileRegisterCache[entry.ext]) {
    return entry
  }

  entryCompileRegisterCache[entry.ext] = true

  let moduleInfo = interpret.extensions[entry.ext]

  if (!moduleInfo) {
    return entry
  }

  if (!Array.isArray(moduleInfo)) {
    moduleInfo = [moduleInfo]
  }

  let loaded = false

  for (let mod of moduleInfo) {
    try {
      if (typeof mod === 'string') {
        require(mod)
      } else {
        mod.register(require(mod.module))
      }

      loaded = true
      break
    } catch (e) {}
  }

  if (!loaded) {
    let modules = moduleInfo[0].module || moduleInfo[0].split('/')[0]

    throw new Error(`Module loader not found for ${entry.ext} files. Try: npm install ${modules}`)
  }

  return entry
}

function entryRequire (entry) {
  return require(entry.path)
}

function entryPrepare (entry) {
  if (typeof entry === 'object' && typeof entry.default !== 'undefined') {
    return entry.default
  } else {
    return entry
  }
}
