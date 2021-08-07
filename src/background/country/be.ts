import Country from '.'
import { DNS } from '../../types/Status'

export default class Belgium extends Country {
  public get dns(): DNS {
    return {
      registrant: {
        organisation: '',
      },
    }
  }
}
