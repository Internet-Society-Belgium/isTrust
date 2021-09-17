import { getChapterUrl, getCountry } from '.'

test('getCountry Mons -> Belgium', () => {
    expect(getCountry({ longitude: 3.952, latitude: 50.455 })).toBe('Belgium')
})

test('getChapterUrl Mons -> Belgium', () => {
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

// test('getCountry Ré -> France', () => {
//     expect(getCountry({ longitude: -1.3651, latitude: 46.1855 })).toBe('France')
// })
