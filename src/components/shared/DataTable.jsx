"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

export function DataTable({ columns, allData, defaultItemsPerPage = 10 }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [columnVisibility, setColumnVisibility] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)

  // Query parametrlardan faqat page ni olish
  const currentPage = parseInt(searchParams.get('page') || '1')

  // Filterlangan ma'lumotlar
  const filteredData = useMemo(() => {
    if (!globalFilter) return allData

    return allData.filter(item => {
      return Object.values(item).some(value =>
        value.toString().toLowerCase().includes(globalFilter.toLowerCase())
      )
    })
  }, [allData, globalFilter])

  // Sahifalangan ma'lumotlar
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [filteredData, currentPage, itemsPerPage])

  // Umumiy sahifalar sonini hisoblash
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Sahifa o'zgarganda URL ni yangilash
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  // Limit o'zgarganda
  const handleLimitChange = (newLimit) => {
    setItemsPerPage(parseInt(newLimit))
    // Sahifani 1 ga qaytarish
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    router.push(`?${params.toString()}`)
  }

  // Sahifa limiti oshib ketganda 1-sahifaga qaytarish
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      handlePageChange(1)
    }
  }, [currentPage, totalPages])

  // Ko'rsatiladigan sahifa raqamlarini hisoblash
  const getVisiblePages = () => {
    const pages = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)

    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages)
    }

    if (currentPage > totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  const visiblePages = getVisiblePages()
  const showStartEllipsis = visiblePages[0] > 1
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages

  const table = useReactTable({
    data: paginatedData,
    columns,
    state: {
      columnVisibility,
      globalFilter,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  })

  // Ma'lumotlar oralig'ini hisoblash
  const startItem = filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const endItem = Math.min(currentPage * itemsPerPage, filteredData.length)

  return (
    <div className="bg-white p-2 rounded-md space-y-4">
      {/* 🔍 Search va Filter */}
      <div className="flex items-center justify-between">
        <Input
          placeholder="Поиск..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm h-11"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className={"h-11"} variant="outline">Выбрать столбцы</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table?.getAllLeafColumns().map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 📊 Table - Vertikal chiziqlari bilan */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50/50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border-r border-gray-200 last:border-r-0 font-medium text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  className={cn(idx % 2 == 0 ? "bg-[#F8F9FA]" : "", "hover:bg-gray-100 border-b border-gray-100")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="border-r border-gray-200 last:border-r-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center border-r border-gray-200"
                >
                  {globalFilter ? 'Ничего не найдено' : 'Данные не найдены'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 📑 Pagination */}
      <div className="flex items-center justify-start px-2">
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            {/* Sahifa ma'lumotlari */}
            <div className="text-sm text-muted-foreground mr-4">
              {currentPage}/{totalPages} Страница
            </div>

            <Pagination>
              <PaginationContent>
                {/* Oldingi sahifa */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {/* Birinchi sahifa va ellipsis */}
                {showStartEllipsis && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {visiblePages[0] > 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}

                {/* Ko'rinadigan sahifalar */}
                {visiblePages.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={page === currentPage}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {/* Oxirgi sahifa va ellipsis */}
                {showEndEllipsis && (
                  <>
                    {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                {/* Keyingi sahifa */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        {/* Chap tomon - ma'lumotlar va limit selector */}
        <div className="flex items-center space-x-4">
          {/* Ma'lumotlar oralig'i */}
          <div className="text-sm text-muted-foreground">
            {filteredData.length > 0 ? (
              `${startItem}-${endItem} из ${filteredData.length}`
            ) : (
              'Нет данных'
            )}
            {globalFilter && (
              <span className="ml-1">
                (отфильтровано из {allData.length})
              </span>
            )}
          </div>

          {/* Limit selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Показать:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* O'ng tomon - pagination */}

      </div>
    </div>
  )
}