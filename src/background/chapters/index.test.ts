import { getChapterUrl, getCountry } from '.'

test('getCountry Mons -> Belgium', () => {
    expect(getCountry({ longitude: 3.952, latitude: 50.455 })).toBe('Belgium')
})

test('getChapterUrl Mons', () => {
    expect(getChapterUrl({ longitude: 3.952, latitude: 50.455 })).toBe(
        'https://www.internetsociety.be/project/istrust/'
    )
})

test('getCountry Torshavn -> undefined', () => {
    expect(getCountry({ longitude: -6.833, latitude: 62.052 })).toBe(undefined)
})

test('getCountry Galapagos -> undefined', () => {
    expect(getCountry({ longitude: -91.165, latitude: -0.417 })).toBe(undefined)
})

test('getChapterUrl Galapagos', () => {
    expect(getChapterUrl({ longitude: -91.165, latitude: -0.417 })).toBe(
        'https://www.istrust.org/'
    )
})
