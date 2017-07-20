
import interpreting from '../'

let data1 = './test/files/data.1'
let data2 = './test/files/data.2'
let dataFn = './test/files/data.fn'
let dataNumber = './test/files/data.number'
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

  test('join single', () => {
    let data = interpreting(data1, {
      multiple: true,
      join: true
    })

    expect(data)
      .toEqual({
        js: 1,
        babel: 1,
        json: 1
      })
  })

  test('join multiple', () => {
    let data = interpreting([data1, data2], {
      multiple: true,
      join: true
    })

    expect(data)
      .toEqual({
        js: 2,
        babel: 2,
        json: 2
      })
  })

  test('path not found should return a empty object when !options.required', () => {
    expect(interpreting(dataNotExists)).toBeNull()
  })

  test('function return', () => {
    expect(typeof interpreting(dataFn))
      .toBe('function')
  })

  test('number return', () => {
    expect(typeof interpreting(dataNumber))
      .toBe('number')
  })
})

describe('errors', () => {
  test('throws a error without args', () => {
    expect(() => {
      interpreting()
    }).toThrow(/^Path is required/)
  })

  test('path not found should throws a error when options.required', () => {
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
