import trans from './trans'
import * as ruleHelpers from './rules'

export const resolveProperty = ({ default: def = null, name = null }, key) => {
  if (!name) {
    throw new TypeError(trans('set-rules-and-name'))
  }

  const model = ref(def)

  name ??= key

  const returnedRef = reactive({
    data: model,
    error: '',
    isDirty: false,
    isValid: false,
    default: def,
    name,
  })

  return returnedRef
}

export const resolveRules = (rules, name) => {
  if (!['object', 'string'].includes(typeof rules)) {
    throw new TypeError(trans('invalid-rules', { name }))
  }
  const parseRule = (rule) => {
    const [key, value] = rule.split(':')
    return { [key]: value ? value.split(',') : [] }
  }
  if (typeof rules === 'string') {
    rules = rules.split('|').reduce((acc, rule) => ({ ...acc, ...parseRule(rule) }), {})
  }
  else if (Array.isArray(rules)) {
    let customCount = 0
    rules = rules.reduce((acc, rule) => {
      if (typeof rule === 'function') {
        acc[`custom_${++customCount}`] = rule
      }
      else {
        Object.assign(acc, parseRule(rule))
      }
      return acc
    }, {})
  }
}

export const TrueForm = (properties = {}) => {
  if (typeof properties !== 'object') {
    throw new TypeError(trans('properties-must-object'))
  }

  let props = Object.entries(properties).map(([key, value]) => {
    if (typeof value !== 'object') {
      throw new TypeError(trans('properties-must-object'))
    }
    return [key, reactive({ ...resolveProperty(value, key), rules: value.rules })]
  })
  console.log(typeof props, props)
  /*props = props.map(([key, property]) => {
    const resolvedRules = resolveRules(property.rules, property.name)
    const otherProps = Object.fromEntries(props.filter(([k]) => k != key).map(([k, v]) => [[k, v.data]]))
    watch(model, (newVal) => {
      const validator = validate(property.name, newVal, resolvedRules, otherProps)
      property.isDirty = true
      property.error = validator || ''
      property.isValid = validator == null
    }, { deep: true })
  })*/

  return reactive({
    ...Object.fromEntries(props),
    isValid: computed(() => props.every(([, value]) => value.isValid)),
    errors: computed(() => props.flatMap(([, value]) => value?.error || [])),
    isDirty: computed(() => props.some(([, value]) => value.isDirty)),
  })
}

export const validate = (name, value, rules = {}, otherProps = {}) => {
  if (rules.unload && value.length === 0) return ''
  delete rules.unload

  for (const rule of Object.keys(rules)) {
    const pipeline = (typeof rules[rule] === 'function')
      ? rules[rule](value)
      : ruleHelpers[rule](value, ...(rules[rule]), otherProps)

    if (!pipeline.status) {
      return pipeline.message.replace(':attribute:', name)
    }
  }
  return null
}
