"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Edit, Loader2, Plus, Search, Settings } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDealStore } from "@/store/dealStore"
import { getContracts, updateContractFunnel, updateFunnel } from "@/lib/actions"
import { extractArrayFromResponse } from "@/lib/utils/api-helpers"
import { toastError } from "@/lib/toast"

const UNASSIGNED_COLUMN_ID = "unassigned"
const UNASSIGNED_COLOR = "#E2E8F0"
const COLUMN_DRAG_TYPE = "application/x-kanban-column"
const CARD_DRAG_TYPE = "application/x-kanban-card"
const ZERO_OBJECT_ID = "000000000000000000000000"

const normalizeFunnelId = (value) => {
  if (value === null || value === undefined) return ""
  const stringified = String(value).trim()
  if (
    !stringified ||
    stringified === ZERO_OBJECT_ID ||
    stringified === "null" ||
    stringified === "undefined"
  ) {
    return ""
  }
  return stringified
}

const hexToRgb = (hex) => {
  if (!hex) return { r: 91, g: 111, b: 221 }
  const normalized = hex.replace("#", "")
  const bigint = parseInt(normalized, 16)
  if (Number.isNaN(bigint)) {
    return { r: 91, g: 111, b: 221 }
  }
  if (normalized.length === 3) {
    const r = (bigint >> 8) & 0xf
    const g = (bigint >> 4) & 0xf
    const b = bigint & 0xf
    return {
      r: (r << 4) | r,
      g: (g << 4) | g,
      b: (b << 4) | b,
    }
  }
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

const mixWithWhite = (hex, alpha = 0.85) => {
  const { r, g, b } = hexToRgb(hex)
  const mix = (channel) => Math.round(channel + (255 - channel) * (1 - alpha))
  return `rgba(${mix(r)}, ${mix(g)}, ${mix(b)}, 1)`
}

const contractFunnelId = (contract) => {
  if (!contract) return ""
  const direct =
    contract.funnel_id ??
    contract.funnelId ??
    contract.stage_id ??
    contract.stageId ??
    contract.pipeline_id ??
    contract.pipelineId
  const normalizedDirect = normalizeFunnelId(direct)
  if (normalizedDirect) return normalizedDirect
  if (contract.funnel && typeof contract.funnel === "object") {
    const funnel = contract.funnel
    return normalizeFunnelId(
      funnel.id ??
        funnel._id ??
        funnel.uuid ??
        funnel.guid ??
        funnel.ID ??
        funnel.Id ??
        funnel.code,
    )
  }
  return ""
}

const contractClientName = (contract) => {
  if (!contract) return "—"
  if (typeof contract.client === "string") return contract.client
  if (contract.client && typeof contract.client === "object") {
    const client = contract.client
    const first = client.first_name || client.firstname || client.firstName || ""
    const last = client.last_name || client.lastname || client.lastName || ""
    const full = [first, last].filter(Boolean).join(" ").trim()
    if (full) return full
    return client.name || client.company || "—"
  }
  return contract.client_name || contract.client_full_name || contract.customer || "—"
}

const contractIdentifier = (contract, fallback = "Deal") => {
  return (
    contract.contract_number ||
    contract.contractNumber ||
    contract.number ||
    contract.code ||
    contract.id ||
    contract._id ||
    fallback
  )
}

const contractComment = (contract) => {
  return contract.comment || contract.description || "—"
}

const contractDate = (contract) => {
  const raw =
    contract.deal_date ||
    contract.updated_at ||
    contract.updatedAt ||
    contract.created_at ||
    contract.createdAt
  if (!raw) return "—"
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString()
}

const contractAmount = (contract) => {
  const value = Number(contract.contract_amount ?? contract.amount ?? 0)
  if (!value) return "0"
  return value.toLocaleString()
}

const resolveContractId = (contract) => {
  return (
    (contract?.id && String(contract.id)) ||
    (contract?._id && String(contract._id)) ||
    (contract?.contract_id && String(contract.contract_id)) ||
    (contract?.contractId && String(contract.contractId)) ||
    ""
  )
}

export default function DealsPage() {
  const { t } = useTranslation()
  const defaultDealLabel = t("dealPage.defaultDealName")
  const router = useRouter()
  const funnels = useDealStore((state) => state.funnels)
  const funnelsLoading = useDealStore((state) => state.funnelsLoading)
  const loadFunnels = useDealStore((state) => state.loadFunnels)
  const loadReferenceData = useDealStore((state) => state.loadReferenceData)

  const [contracts, setContracts] = useState([])
  const [contractsLoading, setContractsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [columnOrder, setColumnOrder] = useState([UNASSIGNED_COLUMN_ID])
  const [savingColumnOrder, setSavingColumnOrder] = useState(false)
  const [movingContractId, setMovingContractId] = useState("")
  const [draggingContractId, setDraggingContractId] = useState("")

  useEffect(() => {
    loadReferenceData()
    loadFunnels()
  }, [loadReferenceData, loadFunnels])

  useEffect(() => {
    let cancelled = false

    const loadContracts = async () => {
      setContractsLoading(true)
      try {
        const response = await getContracts({ limit: 200 })
        const raw = extractArrayFromResponse(response, ["contracts"])
        if (!cancelled) {
          setContracts(Array.isArray(raw) ? raw : [])
        }
      } catch (error) {
        console.error("Error loading contracts:", error)
        if (!cancelled) {
          toastError({
            title: t("dealPage.loadErrorTitle"),
            description: error?.message,
          })
        }
      } finally {
        if (!cancelled) {
          setContractsLoading(false)
        }
      }
    }

    loadContracts()

    return () => {
      cancelled = true
    }
  }, [t])

  const sortedFunnels = useMemo(() => {
    return funnels
      .map((funnel) => ({
        ...funnel,
        id: String(funnel.id ?? funnel._id ?? funnel.uuid ?? funnel.guid ?? ""),
        color: funnel.color || "#5B6FDD",
      }))
      .filter((funnel) => funnel.id)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }, [funnels])

  const funnelById = useMemo(() => {
    const map = new Map()
    sortedFunnels.forEach((funnel) => {
      map.set(funnel.id, funnel)
    })
    return map
  }, [sortedFunnels])

  const defaultOrder = useMemo(
    () => [UNASSIGNED_COLUMN_ID, ...sortedFunnels.map((funnel) => funnel.id)],
    [sortedFunnels],
  )

  useEffect(() => {
    setColumnOrder((prev) => {
      const seen = new Set(defaultOrder)
      const preserved = prev.filter((id) => seen.has(id))
      const missing = defaultOrder.filter((id) => !preserved.includes(id))
      const next = preserved.length > 0 ? [...preserved, ...missing] : defaultOrder
      return next
    })
  }, [defaultOrder])

  const filteredContracts = useMemo(() => {
    if (!searchTerm) return contracts
    const lowered = searchTerm.toLowerCase()
    return contracts.filter((contract) => {
      const searchable = [
        contractIdentifier(contract, defaultDealLabel),
        contractClientName(contract),
        contractComment(contract),
      ]
        .join(" ")
        .toLowerCase()
      return searchable.includes(lowered)
    })
  }, [contracts, searchTerm, defaultDealLabel])


  const columns = useMemo(() => {
    return columnOrder
      .map((columnId) => {
        if (columnId === UNASSIGNED_COLUMN_ID) {
          const deals = filteredContracts.filter((contract) => !contractFunnelId(contract))
          return {
            id: UNASSIGNED_COLUMN_ID,
            name: t("dealPage.unassignedColumn"),
            color: UNASSIGNED_COLOR,
            comment: null,
            order: -1,
            isUnassigned: true,
            deals,
          }
        }

        const funnel = funnelById.get(columnId)
        if (!funnel) return null
        const deals = filteredContracts.filter(
          (contract) => contractFunnelId(contract) === funnel.id,
        )

        return {
          id: funnel.id,
          name: funnel.name,
          color: funnel.color || "#5B6FDD",
          comment: funnel.comment,
          order: funnel.order ?? 0,
          isUnassigned: false,
          deals,
        }
      })
      .filter(Boolean)
  }, [columnOrder, filteredContracts, funnelById, t])

  const isLoading = funnelsLoading || contractsLoading

  const persistFunnelOrder = useCallback(
    async (orderedIds, previousOrder) => {
      const orderedFunnelIds = orderedIds.filter((id) => id !== UNASSIGNED_COLUMN_ID)
      const payload = orderedFunnelIds.map((id, index) => ({
        id,
        order: index + 1,
      }))

      if (payload.length === 0) return

      setSavingColumnOrder(true)
      try {
        await Promise.all(payload.map(({ id, order }) => updateFunnel(id, { order })))
      } catch (error) {
        console.error("Failed to persist funnel order:", error)
        setColumnOrder(previousOrder)
      } finally {
        setSavingColumnOrder(false)
      }
    },
    [],
  )

  const handleColumnDragStart = useCallback((event, columnId) => {
    if (columnId === UNASSIGNED_COLUMN_ID) return
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData(COLUMN_DRAG_TYPE, columnId)
    event.dataTransfer.setData("text/plain", columnId)
  }, [])

  const handleColumnDragOver = useCallback((event) => {
    if (event.dataTransfer.types.includes(COLUMN_DRAG_TYPE)) {
      event.preventDefault()
      event.dataTransfer.dropEffect = "move"
    }
  }, [])

  const handleColumnDrop = useCallback(
    (event, targetColumnId) => {
      if (!event.dataTransfer.types.includes(COLUMN_DRAG_TYPE)) return
      event.preventDefault()
      const draggedId = event.dataTransfer.getData(COLUMN_DRAG_TYPE)
      if (!draggedId || draggedId === targetColumnId) return
      if (draggedId === UNASSIGNED_COLUMN_ID || targetColumnId === UNASSIGNED_COLUMN_ID) return

      setColumnOrder((prev) => {
        const previousOrder = [...prev]
        const withoutUnassigned = prev.filter((id) => id !== UNASSIGNED_COLUMN_ID)
        const filteredDragged = withoutUnassigned.filter((id) => id !== draggedId)
        const targetIndex = filteredDragged.indexOf(targetColumnId)
        if (targetIndex === -1) return prev
        filteredDragged.splice(targetIndex, 0, draggedId)
        const nextOrder = [UNASSIGNED_COLUMN_ID, ...filteredDragged]
        persistFunnelOrder(nextOrder, previousOrder)
        return nextOrder
      })
    },
    [persistFunnelOrder],
  )

  const moveContractToColumn = useCallback(
    async (contractId, fromColumnId, toColumnId) => {
      if (!contractId || fromColumnId === toColumnId) return
      const isUnassignedTarget = toColumnId === UNASSIGNED_COLUMN_ID
      const targetFunnelId = isUnassignedTarget ? ZERO_OBJECT_ID : toColumnId
      const targetFunnel =
        !isUnassignedTarget && targetFunnelId ? funnelById.get(targetFunnelId) : null

      let previousContractsState = []
      setContracts((prev) => {
        previousContractsState = prev
        return prev.map((contract) => {
          if (resolveContractId(contract) !== contractId) return contract
          return {
            ...contract,
            funnel_id: targetFunnelId,
            funnelId: targetFunnelId,
            funnel: targetFunnel ? { ...targetFunnel } : undefined,
          }
        })
      })

      setMovingContractId(contractId)
      try {
        await updateContractFunnel(contractId, targetFunnelId)
      } catch (error) {
        console.error("Failed to move contract:", error)
        setContracts(previousContractsState)
      } finally {
        setMovingContractId("")
      }
    },
    [contracts, funnelById, updateContractFunnel],
  )

  const handleCardDragOver = useCallback((event) => {
    if (event.dataTransfer.types.includes(CARD_DRAG_TYPE)) {
      event.preventDefault()
      event.dataTransfer.dropEffect = "move"
    }
  }, [])

  const handleCardDrop = useCallback(
    (event, targetColumnId) => {
      if (!event.dataTransfer.types.includes(CARD_DRAG_TYPE)) return
      event.preventDefault()
      try {
        const payload = JSON.parse(event.dataTransfer.getData(CARD_DRAG_TYPE) || "{}")
        const contractId = payload.contractId ? String(payload.contractId) : ""
        const fromColumnId = payload.fromColumnId || UNASSIGNED_COLUMN_ID
        if (!contractId) return
        moveContractToColumn(contractId, fromColumnId, targetColumnId)
      } catch (error) {
        console.error("Failed to parse drag payload:", error)
      } finally {
        setDraggingContractId("")
      }
    },
    [moveContractToColumn],
  )

  const handleCardDragStart = useCallback(
    (event, contract, currentColumnId) => {
      const contractId = resolveContractId(contract)
      if (!contractId) return
      event.dataTransfer.effectAllowed = "move"
      event.dataTransfer.setData(
        CARD_DRAG_TYPE,
        JSON.stringify({ contractId, fromColumnId: currentColumnId }),
      )
      event.dataTransfer.setData("text/plain", contractIdentifier(contract, defaultDealLabel))
      setDraggingContractId(contractId)
    },
    [defaultDealLabel],
  )

  const handleCardDragEnd = useCallback(() => {
    setDraggingContractId("")
  }, [])

  const handleOpenSettings = () => {
    router.push("/dashboard/deals/funnels")
  }

  const handleEditContract = useCallback(
    (contract) => {
      const contractId = resolveContractId(contract)
      if (!contractId) return
      router.push(`/dashboard/deals/add?contractId=${encodeURIComponent(contractId)}&type=edit`)
    },
    [router],
  )

  return (
    <div className="w-11/12 mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("dealPage.searchPlaceholder")}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleOpenSettings} className="gap-2">
            <Settings className="h-4 w-4" />
            {t("dealPage.openSettings")}
          </Button>
          <Link href="/dashboard/deals/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("dealPage.newDeal")}
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-6">
          {columns.map((column) => {
            const columnColor = column.color || "#5B6FDD"
            const cardColor = column.isUnassigned ? "#FFFFFF" : mixWithWhite(columnColor, 0.78)
            const columnTotal = column.deals
              .reduce((acc, deal) => acc + Number(deal.contract_amount ?? deal.amount ?? 0), 0)
              .toLocaleString()
            const dealCountLabel = t("dealPage.dealCount", { count: column.deals.length })
            const summaryLabel = t("dealPage.columnSummary", {
              dealCount: dealCountLabel,
              total: columnTotal,
            })

            const headerClasses = column.isUnassigned
              ? "cursor-default"
              : savingColumnOrder
                ? "cursor-not-allowed opacity-60"
                : "cursor-move"

            return (
              <div
                key={column.id}
                className="flex w-80 shrink-0 flex-col gap-4"
                data-column-id={column.id}
              >
                <div
                  className={`space-y-1 text-center rounded-md border border-transparent px-2 py-1 ${headerClasses}`}
                  draggable={!column.isUnassigned && !savingColumnOrder}
                  onDragStart={(event) => handleColumnDragStart(event, column.id)}
                  onDragOver={handleColumnDragOver}
                  onDrop={(event) => handleColumnDrop(event, column.id)}
                >
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-800">
                    {column.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">{summaryLabel}</p>
                  <div
                    className="mx-auto h-1 w-full rounded-full"
                    style={{ backgroundColor: columnColor }}
                  />
                </div>

                {!column.isUnassigned && (
                  <Link
                    href={`/dashboard/deals/add?funnelId=${encodeURIComponent(column.id)}`}
                    className="block rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center text-gray-500 transition hover:border-gray-400 hover:text-gray-700"
                  >
                    <Plus className="mx-auto h-6 w-6" />
                    <span className="mt-2 block text-sm font-medium">
                      {t("dealPage.addDealButton")}
                    </span>
                  </Link>
                )}

                <div
                  className="flex min-h-[160px] flex-col gap-3 rounded-xl border border-dashed border-transparent p-1 transition"
                  data-column-id={column.id}
                  onDragOver={handleCardDragOver}
                  onDrop={(event) => handleCardDrop(event, column.id)}
                >
                  {column.deals.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-200 bg-white p-4 text-center text-xs text-muted-foreground">
                      {t("dealPage.emptyColumnHint")}
                    </div>
                  ) : (
                    column.deals.map((deal) => {
                      const contractId = resolveContractId(deal)
                      const isDragging = draggingContractId === contractId
                      const isUpdating = movingContractId === contractId
                      return (
                        <div
                          key={contractId || contractIdentifier(deal, defaultDealLabel)}
                          className={`group rounded-xl border p-4 shadow-sm transition hover:shadow-md ${isDragging ? "opacity-60" : ""}`}
                          style={{
                            backgroundColor: cardColor,
                            borderColor: column.isUnassigned ? "#F1F5F9" : columnColor,
                          }}
                          draggable={!isUpdating}
                          onDragStart={(event) => handleCardDragStart(event, deal, column.id)}
                          onDragEnd={handleCardDragEnd}
                          onDragOver={handleCardDragOver}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-medium text-gray-700">
                                {contractClientName(deal)}
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {contractIdentifier(deal, defaultDealLabel)}
                              </p>
                            </div>
                            <span className="text-xs text-gray-600">{contractDate(deal)}</span>
                          </div>
                          <div className="mt-2 text-xs text-gray-700">
                            {contractComment(deal)}
                          </div>
                          <div className="mt-3 flex items-center justify-between text-xs text-gray-700">
                            <span>{contractAmount(deal)}$</span>
                            <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-gray-600 hover:text-gray-900"
                                onClick={() => handleEditContract(deal)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {isUpdating && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              <span>{t("dealPage.updating")}</span>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>

                {column.isUnassigned && (
                  <div className="rounded-lg border border-dashed border-gray-200 bg-white p-4 text-center text-xs text-muted-foreground">
                    {t("dealPage.unassignedFooter")}
                  </div>
                )}
              </div>
            )
          })}

          {columns.length === 0 && (
            <div className="flex h-60 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white text-center text-gray-500">
              {t("dealPage.noFunnelsHint")}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
