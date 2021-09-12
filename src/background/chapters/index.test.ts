import { getBestRegion, getChapter } from '.'

const Belgium = getChapter('BE')
const UnitedStates = getChapter('US')
const Luxemburg = getChapter('LU')

test('Belgium', () => {
    expect(getBestRegion(Belgium, {})).toBe(Belgium.regions[0])
})

test('United States', () => {
    expect(getBestRegion(UnitedStates, {})).toBe(UnitedStates.regions[0])
})

test('Seattle', () => {
    expect(
        getBestRegion(UnitedStates, { latitude: 47.614, longitude: -123.201 })
    ).toBe(UnitedStates.regions[1])
})

test('Miami', () => {
    expect(
        getBestRegion(UnitedStates, { latitude: 25.7824, longitude: -80.2295 })
    ).toBe(UnitedStates.regions[0])
})

test('Luxemburg', () => {
    expect(getBestRegion(Luxemburg, {})).toBe(Belgium.regions[0])
})
