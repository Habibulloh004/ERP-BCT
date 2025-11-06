"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight, ArrowUp, X } from "lucide-react"

import { useFormLanguage } from "@/components/forms/FormLanguageContext"
import MultilingualInput from "@/components/shared/MultilingualInput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LANGUAGES, LANGUAGE_FLAGS, defaultMultilingualValue } from "@/lib/multilingual"
import {
  createEmptyColumn,
  createEmptyRow,
  parseDescriptionState,
  serializeDescriptionState,
} from "@/lib/utils/product-description"

export default function ProductDescriptionEditor({
  label = "Описание товара",
  value,
  onChange,
  disabled = false,
}) {
  const [table, setTable] = useState(() => parseDescriptionState(value))
  const formLanguage = useFormLanguage()

  useEffect(() => {
    setTable(parseDescriptionState(value))
  }, [value])

  const emitChange = (nextState) => {
    setTable(nextState)
    onChange?.(serializeDescriptionState(nextState))
  }

  const handleLabelChange = (columnId, updatedValue) => {
    const nextColumns = table.columns.map((column) =>
      column.id === columnId ? { ...column, labelValue: updatedValue } : column,
    )
    emitChange({ ...table, columns: nextColumns })
  }

  const handleCellChange = (rowId, columnId, updatedValue) => {
    const nextRows = table.rows.map((row) => {
      if (row.id !== rowId) return row
      return {
        ...row,
        cells: {
          ...row.cells,
          [columnId]: updatedValue,
        },
      }
    })
    emitChange({ ...table, rows: nextRows })
  }

  const handleAddRow = () => {
    if (disabled) return
    const nextRow = createEmptyRow(table.columns, table.rows.length)
    emitChange({ ...table, rows: [...table.rows, nextRow] })
  }

  const handleRemoveRow = (rowId) => {
    if (disabled) return
    emitChange({ ...table, rows: table.rows.filter((row) => row.id !== rowId) })
  }

  const handleAddColumn = () => {
    if (disabled) return
    const nextColumn = createEmptyColumn(table.columns.length)
    const nextColumns = [...table.columns, nextColumn]
    const nextRows = table.rows.map((row) => ({
      ...row,
      cells: {
        ...row.cells,
        [nextColumn.id]: defaultMultilingualValue(),
      },
    }))
    emitChange({ columns: nextColumns, rows: nextRows })
  }

  const handleRemoveColumn = (columnId) => {
    if (disabled || table.columns.length <= 1) return
    const nextColumns = table.columns.filter((column) => column.id !== columnId)
    const nextRows = table.rows.map((row) => {
      const { [columnId]: _removed, ...rest } = row.cells || {}
      return { ...row, cells: rest }
    })
    emitChange({ columns: nextColumns, rows: nextRows })
  }

  const activeLanguage = formLanguage?.activeLanguage ?? LANGUAGES[0].code

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${table.columns.length}, minmax(0, 1fr)) 56px`,
    }),
    [table.columns.length],
  )

  const getColumnPlaceholder = (column) => {
    const value =
      column.labelValue?.[activeLanguage] ||
      column.labelValue?.en ||
      column.labelValue?.ru ||
      column.labelValue?.uz
    return value || "Новый столбец"
  }

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="space-y-3 px-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
            {label}
          </CardTitle>
          <span className="text-sm font-medium text-gray-400">
            {table.rows.length} × {table.columns.length}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{LANGUAGE_FLAGS[activeLanguage] || "🌐"}</span>
          <span>
            Активный язык:{" "}
            <strong className="font-semibold text-gray-700">
              {LANGUAGES.find((lang) => lang.code === activeLanguage)?.label || activeLanguage}
            </strong>
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-0">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div
            className="grid items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4"
            style={gridStyle}
          >
            {table.columns.map((column) => (
              <div key={column.id} className="flex w-full items-center gap-2">
                <MultilingualInput
                  value={column.labelValue || defaultMultilingualValue()}
                  onChange={(updated) => handleLabelChange(column.id, updated)}
                  disabled={disabled}
                  hideLanguageSwitcher
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm"
                  placeholder={getColumnPlaceholder(column)}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  disabled={disabled || table.columns.length <= 1}
                  onClick={() => handleRemoveColumn(column.id)}
                  className="h-8 w-8 rounded-full border border-transparent text-slate-400 transition hover:border-slate-200 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="h-8" />
          </div>

          {table.rows.length === 0 ? (
            <div className="px-5 py-6 text-sm text-muted-foreground">
              Нет строк. Добавьте первую, чтобы начать заполнять характеристики.
            </div>
          ) : (
            table.rows.map((row) => (
              <div
                key={row.id}
                className="grid items-start gap-3 px-5 py-4"
                style={gridStyle}
              >
                {table.columns.map((column) => (
                  <MultilingualInput
                    key={`${row.id}-${column.id}`}
                    value={row.cells?.[column.id] || defaultMultilingualValue()}
                    onChange={(updated) => handleCellChange(row.id, column.id, updated)}
                    disabled={disabled}
                    hideLanguageSwitcher
                    className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm"
                    placeholder={getColumnPlaceholder(column)}
                  />
                ))}
                <div className="flex h-11 items-center justify-end">
                  {!disabled && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveRow(row.id)}
                      className="h-9 w-9 rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {!disabled && (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddColumn}
              className="flex items-center gap-2 rounded-2xl border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            >
              <ArrowRight className="h-4 w-4" />
              Yangi ustun qo'shish
            </Button>
            <Button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              <ArrowUp className="h-4 w-4" />
              Yangi qator qo'shish
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
