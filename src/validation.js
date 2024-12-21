import trans from './trans'
import * as ruleHelpers from './rules'

export const resolveProperty = ({ default: def = null, name = null, rules }, key) => {
  if (!rules || !name) {
    throw new TypeError(trans('set-rules-and-name'))
  }

  const model = ref(def)

  name ??= key

  const resolvedRules = resolveRules(rules, name)

  const returnedRef = reactive({
    data: model,
    error: '',
    isDirty: false,
    isValid: false,
    default: def,
    name,
  })

  watch(model, (newVal) => {
    const validator = validate(name, newVal, resolvedRules)
    returnedRef.isDirty = true
    returnedRef.error = validator || ''
    returnedRef.isValid = validator == null
  }, { deep: true })

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

  const props = Object.entries(properties).map(([key, value]) => {
    if (typeof value !== 'object') {
      throw new TypeError(trans('properties-must-object'))
    }
    return [key, resolveProperty(value, key)]
  })

  return reactive({
    ...Object.fromEntries(props),
    isValid: computed(() => props.every(([, value]) => value.isValid)),
    errors: computed(() => props.flatMap(([, value]) => value?.error || [])),
    isDirty: computed(() => props.some(([, value]) => value.isDirty)),
  })
}

export const validate = (name, value, rules = {}) => {
  if (rules.unload && value.length === 0) return ''
  delete rules.unload

  for (const rule of Object.keys(rules)) {
    const pipeline = (typeof rules[rule] === 'function')
      ? rules[rule](value)
      : ruleHelpers[rule](value, ...(rules[rule]))

    if (!pipeline.status) {
      return pipeline.message.replace(':attribute:', name)
    }
  }
  return null
}
