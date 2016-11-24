import { mapValues } from 'lodash'
import { createSelector } from 'reselect'

export const createSelectorWhichMapsToHash = (hashSelector, mapFunc) =>
  createSelector(hashSelector, capturesValue => mapValues(capturesValue, mapFunc))

export const createValuesHashToValueSelector = (valuesHashSelector, valueKey) =>
        createSelector(valuesHashSelector, valuesHash => valuesHash[valueKey])