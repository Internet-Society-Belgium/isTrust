import { getChapterUrl, getCountry } from '.'

test('getCountry Mons -> Belgium', () => {
    expect(getCountry({ longitude: 3.952, latitude: 50.455 })).toBe('Belgium')
})

test('getChapterUrl Mons', () => {
    expect(getChapterUrl({ longitude: 3.952, latitude: 50.455 })).toBe(
        'https://www.internetsociety.be/'
    )
})

test('getCountry Tokyo -> Japan', () => {
    expect(getCountry({ longitude: 139.68, latitude: 35.657 })).toBe('Japan')
})

test('getCountry La Rochelle -> France', () => {
    expect(getCountry({ longitude: -1.1646, latitude: 46.157 })).toBe('France')
})

test('getCountry Ré -> France', () => {
    expect(getCountry({ longitude: -1.3651, latitude: 46.1855 })).toBe('France')
})

test('getCountry Torshavn -> United Kingdom', () => {
    expect(getCountry({ longitude: -6.833, latitude: 62.052 })).toBe(
        'United Kingdom'
    )
})

test('getCountry Galapagos -> Ecuador', () => {
    expect(getCountry({ longitude: -91.165, latitude: -0.417 })).toBe('Ecuador')
})
