import { getChapterUrl } from '.'

test('Belgium - Mons', () => {
    expect(getChapterUrl({ latitude: 50.454, longitude: 3.951 })).toBe(
        'https://www.internetsociety.be/'
    )
})
