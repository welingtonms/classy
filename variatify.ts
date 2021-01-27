import toArray from './toArray'

type Variations = string | number

// TODO: handle ambiguous prop values
function combinify(mapping: { [key: string]: Variations | Variations[] }) {
  const mapOfValueToAttr: Record<Variations, string> = {}

  for (let prop in mapping) {
    const possiblePropValues: Variations[] = toArray<Variations>(mapping[prop])

    for (let i = 0; i < possiblePropValues.length; i++) {
      const possiblePropValue: Variations = possiblePropValues[i]
      mapOfValueToAttr[possiblePropValue] = prop
    }
  }

  return function combine(props: any, ...propValueCombinations: (Variations | Variations[])[]) {
    const safeProps = props || {}

    return propValueCombinations.some(propValueCombination => {
      const propValues = toArray(propValueCombination)

      return propValues.every(propValue => {
        const prop = mapOfValueToAttr[propValue]
        return safeProps[prop] === propValue
      })
    })
  }
}

export default combinify
