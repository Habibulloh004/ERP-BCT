import { defaultMultilingualValue, parseMultilingual, stringifyMultilingual } from "@/lib/multilingual"

const DEFAULT_COLUMNS = [
  {
    id: "col_param",
    label: stringifyMultilingual({ en: "Parameter", ru: "", uz: "" }),
  },
  {
    id: "col_value",
    label: stringifyMultilingual({ en: "Value", ru: "", uz: "" }),
  },
]

const ensureMultilingualObject = (value) => {
  const base = defaultMultilingualValue()
  if (!value) return base
  if (typeof value === "string") {
    const parsed = parseMultilingual(value)
    return { ...base, ...parsed }
  }
  if (typeof value === "object") {
    return { ...base, ...value }
  }
  return base
}

export const parseDescriptionState = (rawValue) => {
  if (!rawValue) {
    return {
      columns: DEFAULT_COLUMNS.map((column) => ({
        ...column,
        labelValue: ensureMultilingualObject(column.label),
      })),
      rows: [],
    }
  }

  let parsed
  if (typeof rawValue === "string") {
    try {
      parsed = JSON.parse(rawValue)
    } catch {
      parsed = null
    }
  } else if (typeof rawValue === "object") {
    parsed = rawValue
  }

  if (!parsed || typeof parsed !== "object") {
    return {
      columns: DEFAULT_COLUMNS.map((column) => ({
        ...column,
        labelValue: ensureMultilingualObject(column.label),
      })),
      rows: [],
    }
  }

  const columns = (parsed.columns || DEFAULT_COLUMNS).map((column, index) => {
    const id = column?.id || `col_${index}`
    const labelValue = ensureMultilingualObject(column?.label)
    return {
      id,
      label: stringifyMultilingual(labelValue),
      labelValue,
    }
  })

  const rows = Array.isArray(parsed.rows)
    ? parsed.rows.map((row, rowIndex) => {
        const cells = {}
        columns.forEach((column) => {
          const rawCell = row?.[column.id]
          cells[column.id] = ensureMultilingualObject(rawCell)
        })
        return {
          id: row?.id || `row_${rowIndex}`,
          cells,
        }
      })
    : []

  return { columns, rows }
}

export const serializeDescriptionState = (state) => {
  const columns = state.columns.map((column) => ({
    id: column.id,
    label: stringifyMultilingual(column.labelValue || {}),
  }))

  const rows = state.rows.map((row) => {
    const serializedRow = {}
    Object.entries(row.cells || {}).forEach(([columnId, value]) => {
      serializedRow[columnId] = stringifyMultilingual(value || {})
    })
    return serializedRow
  })

  return JSON.stringify({ columns, rows })
}

export const createEmptyRow = (columns, index = 0) => {
  const cells = {}
  columns.forEach((column) => {
    cells[column.id] = defaultMultilingualValue()
  })
  return {
    id: `row_${Date.now()}_${index}`,
    cells,
  }
}

export const createEmptyColumn = (index = 0) => {
  const labelValue = defaultMultilingualValue()
  return {
    id: `col_${Date.now()}_${index}`,
    label: stringifyMultilingual(labelValue),
    labelValue,
  }
}
