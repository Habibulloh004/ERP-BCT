"use client"

import { FormEvent, useEffect } from "react"

import { useTranslation } from "react-i18next"

import { useDealStore, type DealFormData } from "@/store/dealStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type DealFormProps = {
  onSubmit?: (values: DealFormData) => Promise<void> | void
  onCancel?: () => void
  isSubmitting?: boolean
  autoSelectFunnel?: boolean
  submitLabel?: string
  cancelLabel?: string
}

export default function DealForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  autoSelectFunnel = false,
  submitLabel,
  cancelLabel,
}: DealFormProps) {
  const { t } = useTranslation()
  const computedSubmitLabel = submitLabel ?? t("dealForm.buttons.submit")
  const computedCancelLabel = cancelLabel ?? t("dealForm.buttons.cancel")
  const formData = useDealStore((state) => state.formData)
  const clients = useDealStore((state) => state.clients)
  const counterparties = useDealStore((state) => state.counterparties)
  const companies = useDealStore((state) => state.companies)
  const currencies = useDealStore((state) => state.currencies)
  const referenceLoading = useDealStore((state) => state.referenceLoading)
  const loadReferenceData = useDealStore((state) => state.loadReferenceData)
  const funnels = useDealStore((state) => state.funnels)
  const funnelsLoading = useDealStore((state) => state.funnelsLoading)
  const loadFunnels = useDealStore((state) => state.loadFunnels)
  const setFormField = useDealStore((state) => state.setFormField)

  useEffect(() => {
    loadReferenceData()
    loadFunnels()
  }, [loadReferenceData, loadFunnels])

  useEffect(() => {
    if (autoSelectFunnel && !formData.funnelId && funnels.length > 0) {
      setFormField("funnelId", funnels[0].id)
    }
  }, [autoSelectFunnel, formData.funnelId, funnels, setFormField])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit?.(formData)
  }

  const handleCancel = () => {
    onCancel?.()
  }

  return (
    <Card className="border-none bg-white p-0 shadow-sm">
      <CardHeader className="px-6 pb-0">
        <CardTitle className="text-xl font-semibold text-gray-900">
          {t("dealForm.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.client.label")}
              </label>
              <Select
                value={formData.client}
                onValueChange={(value) => setFormField("client", value)}
                disabled={referenceLoading}
              >
                <SelectTrigger className="h-12 rounded-md border border-gray-300 bg-white text-gray-900">
                  <SelectValue placeholder={t("dealForm.fields.client.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.counterparty.label")}
              </label>
              <Select
                value={formData.counterparty}
                onValueChange={(value) => setFormField("counterparty", value)}
                disabled={referenceLoading}
              >
                <SelectTrigger className="h-12 rounded-md border border-gray-300 bg-white text-gray-900">
                  <SelectValue placeholder={t("dealForm.fields.counterparty.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {counterparties.map((counterparty) => (
                    <SelectItem key={counterparty.id} value={counterparty.id}>
                      {counterparty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.company.label")}
              </label>
              <Select
                value={formData.company}
                onValueChange={(value) => setFormField("company", value)}
                disabled={referenceLoading}
              >
                <SelectTrigger className="h-12 rounded-md border border-gray-300 bg-white text-gray-900">
                  <SelectValue placeholder={t("dealForm.fields.company.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.contractNumber.label")}
              </label>
              <Input
                value={formData.contractNumber}
                onChange={(event) =>
                  setFormField("contractNumber", event.target.value)
                }
                placeholder={t("dealForm.fields.contractNumber.placeholder")}
                className="h-12 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.plannedShipmentDate.label")}
              </label>
              <Input
                type="date"
                value={formData.plannedShipmentDate}
                onChange={(event) =>
                  setFormField("plannedShipmentDate", event.target.value)
                }
                className="h-12 rounded-md border border-gray-300 bg-white text-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.dealAmount.label")}
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.dealAmount}
                onChange={(event) =>
                  setFormField("dealAmount", event.target.value)
                }
                placeholder={t("dealForm.fields.dealAmount.placeholder")}
                className="h-12 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.funnel.label")}
              </label>
              <Select
                value={formData.funnelId}
                onValueChange={(value) => setFormField("funnelId", value)}
                disabled={funnelsLoading}
              >
                <SelectTrigger className="h-12 rounded-md border border-gray-300 bg-white text-gray-900">
                  <SelectValue placeholder={t("dealForm.fields.funnel.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {funnels.map((funnel) => (
                    <SelectItem key={funnel.id} value={funnel.id}>
                      {funnel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.currency.label")}
              </label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormField("currency", value)}
              >
                <SelectTrigger className="h-12 rounded-md border border-gray-300 bg-white text-gray-900">
                  <SelectValue placeholder={t("dealForm.fields.currency.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.payCard.label")}
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.payCard}
                onChange={(event) =>
                  setFormField("payCard", event.target.value)
                }
                placeholder={t("dealForm.fields.payCard.placeholder")}
                className="h-12 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.payCash.label")}
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.payCash}
                onChange={(event) =>
                  setFormField("payCash", event.target.value)
                }
                placeholder={t("dealForm.fields.payCash.placeholder")}
                className="h-12 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.comments.label")}
              </label>
              <Textarea
                value={formData.comments}
                onChange={(event) =>
                  setFormField("comments", event.target.value)
                }
                placeholder={t("dealForm.fields.comments.placeholder")}
                className="min-h-[120px] rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t("dealForm.fields.guarantee.label")}
              </label>
              <Input
                value={formData.guarantee}
                onChange={(event) =>
                  setFormField("guarantee", event.target.value)
                }
                placeholder={t("dealForm.fields.guarantee.placeholder")}
                className="h-12 rounded-md border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              type="submit"
              className="bg-black px-6 py-2 text-white hover:bg-black/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("dealForm.buttons.saving") : computedSubmitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border border-gray-300 px-6 py-2 text-gray-900 hover:bg-muted"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {computedCancelLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
