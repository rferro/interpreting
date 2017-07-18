
import interpreting from '../src'

let data1 = './test/files/data.1'
let data2 = './test/files/data.2'
let dataNotExists = 'notExists'
let dataMissing = './test/files/data.missing'

describe('success', () => {
  test('single should match .js', () => {
    expect(interpreting(data1))
      .toEqual({ js: 1 })
  })

  test('single with exact .json filename', () => {
    expect(interpreting(data1 + '.json'))
      .toEqual({ json: 1 })
  })

  test('single with exact .babel.js filename', () => {
    expect(interpreting(data1 + '.babel.js'))
      .toEqual({ babel: 1 })
  })

  test('multiple with single path', () => {
    let data = interpreting(data1, {
      multiple: true
    })

    expect(data).toHaveLength(3)
    expect(data).toContainEqual({ js: 1 })
    expect(data).toContainEqual({ babel: 1 })
    expect(data).toContainEqual({ json: 1 })
  })

  test('multiple with multiple paths', () => {
    let data = interpreting([data1, data2], {
      multiple: true
    })

    expect(data).toHaveLength(6)
    expect(data).toContainEqual({ js: 1 })
    expect(data).toContainEqual({ js: 2 })
    expect(data).toContainEqual({ babel: 1 })
    expect(data).toContainEqual({ babel: 2 })
    expect(data).toContainEqual({ json: 1 })
    expect(data).toContainEqual({ json: 2 })
  })

  test('path not found should return a empty object', () => {
    expect(interpreting(dataNotExists)).toEqual({})
  })
})

describe('errors', () => {
  test('path not found should throws a error', () => {
    expect(() => {
      interpreting(dataNotExists, { required: true })
    }).toThrow(/^No files found/)
  })

  test('module not found should throws a error', () => {
    expect(() => {
      interpreting(dataMissing)
    }).toThrow(/^Module loader not found/)
  })
})
