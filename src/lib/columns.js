// columns-factory.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import { formatUzPhone } from "./utils";
import { getLocalizedValue } from "@/lib/multilingual";
import { formatUSD } from "@/lib/utils/currency";

const API_BASE_URL = "https://q-bit.uz";

const normalizeImageUrl = (value) => {
  if (!value || typeof value !== "string") return null;
  if (value.startsWith("http")) return value;
  return value.startsWith("/")
    ? `${API_BASE_URL}${value}`
    : `${API_BASE_URL}/${value}`;
};

const resolveImageUrl = (input) => {
  if (!input) return null;

  if (Array.isArray(input)) {
    for (const item of input) {
      const candidate = resolveImageUrl(item);
      if (candidate) return candidate;
    }
    return null;
  }

  if (typeof input === "string") {
    return normalizeImageUrl(input);
  }

  if (typeof input === "object") {
    return (
      normalizeImageUrl(input.preview) ||
      normalizeImageUrl(input.url) ||
      normalizeImageUrl(input.path)
    );
  }

  return null;
};

const translate = (t, key, fallback) => {
  if (typeof t === "function") {
    const value = t(key);
    if (value && value !== key) {
      return value;
    }
  }
  return fallback ?? key;
};

// --- CLIENTS ---
export const getClientsColumns = (t) => [
  {
    accessorKey: "name",
    header: translate(t, "clients.columns.name", "Имя"),
    cell: ({ row }) => {
      const client = row.original
      const first = client.first_name || client.firstname || ""
      const last = client.last_name || client.lastname || ""
      const fullName = [first, last].filter(Boolean).join(" ").trim()
      return fullName || client.name || "—"
    },
  },
  {
    accessorKey: "company",
    header: translate(t, "clients.columns.company", "Компания"),
    cell: ({ row }) => row.original.company || "—",
  },
  {
    accessorKey: "phone",
    header: translate(t, "clients.columns.phone", "Телефон"),
    cell: ({ row }) => <span>{formatUzPhone(row.original.phone)}</span>,
  },
  {
    accessorKey: "email",
    header: translate(t, "clients.columns.email", "Email"),
    cell: ({ row }) => row.original.email || "—",
  },
  {
    id: "actions",
    header: translate(t, "clients.columns.actions", "Действия"),
    cell: ({ row }) => {
      const client = row.original

      return (
        <div className="w-full flex gap-2 justify-end">
          <Link href={`/dashboard/clients/${client.id}?type=show`}>
            <Button className="cursor-pointer border-2" size="icon" variant="ghost">
              <Image alt="icons" width={50} height={50} src="/icons/arrow.svg" className="h-4 w-4" />
            </Button>
          </Link>

          <Link href={`/dashboard/clients/${client.id}?type=edit`}>
            <Button className="cursor-pointer border-2" size="icon" variant="ghost">
              <Image alt="icons" width={50} height={50} src="/icons/edit.svg" className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )
    },
  },
]

export const getCompaniesColumns = (t) => [
  {
    accessorKey: "name",
    header: translate(t, "companies.columns.name", "Название"),
    cell: ({ row }) => row.original.name || "—",
  },
  {
    accessorKey: "email",
    header: translate(t, "companies.columns.email", "Email"),
    cell: ({ row }) => row.original.email || "—",
  },
  {
    accessorKey: "phone",
    header: translate(t, "companies.columns.phone", "Телефон"),
    cell: ({ row }) => <span>{formatUzPhone(row.original.phone)}</span>,
  },
  {
    accessorKey: "inn",
    header: translate(t, "companies.columns.inn", "ИНН"),
    cell: ({ row }) => row.original.inn || row.original.ctir || "—",
  },
  {
    id: "actions",
    header: translate(t, "companies.columns.actions", "Действия"),
    cell: ({ row }) => {
      const company = row.original
      return (
        <div className="w-full flex gap-2 justify-end">
          <Link href={`/dashboard/companies/${company.id}?type=show`}>
            <Button className="cursor-pointer border-2" size="icon" variant="ghost">
              <Image alt="icons" width={50} height={50} src="/icons/arrow.svg" className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/companies/${company.id}?type=edit`}>
            <Button className="cursor-pointer border-2" size="icon" variant="ghost">
              <Image alt="icons" width={50} height={50} src="/icons/edit.svg" className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )
    },
  },
]

export const getCounterpartiesColumns = (t) => [
  {
    accessorKey: "name",
    header: translate(t, "counterparties.columns.name", "Контрагент"),
    cell: ({ row }) => {
      const counterparty = row.original
      const first = counterparty.first_name || counterparty.firstname || ""
      const last = counterparty.last_name || counterparty.lastname || ""
      const fullName = [first, last].filter(Boolean).join(" ").trim()
      return fullName || counterparty.name || "—"
    },
  },
  {
    accessorKey: "company",
    header: translate(t, "counterparties.columns.company", "Компания"),
    cell: ({ row }) => row.original.company || "—",
  },
  {
    accessorKey: "phone",
    header: translate(t, "counterparties.columns.phone", "Телефон"),
    cell: ({ row }) => <span>{formatUzPhone(row.original.phone)}</span>,
  },
  {
    accessorKey: "email",
    header: translate(t, "counterparties.columns.email", "Email"),
    cell: ({ row }) => row.original.email || "—",
  },
  {
    id: "actions",
    header: translate(t, "counterparties.columns.actions", "Действия"),
    cell: ({ row }) => {
      const counterparty = row.original
      return (
        <div className="w-full flex gap-2 justify-end">
          <Link href={`/dashboard/counterparties/${counterparty.id}?type=show`}>
            <Button className="cursor-pointer border-2" size="icon" variant="ghost">
              <Image alt="icons" width={50} height={50} src="/icons/arrow.svg" className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/dashboard/counterparties/${counterparty.id}?type=edit`}>
            <Button className="cursor-pointer border-2" size="icon" variant="ghost">
              <Image alt="icons" width={50} height={50} src="/icons/edit.svg" className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )
    },
  },
]

// --- SERIAL ---
export const getSerialColumns = (t) => [
  { accessorKey: "id", header: t("serial.columns.id") },
  { accessorKey: "name", header: t("serial.columns.name") },
  { accessorKey: "serial_number", header: t("serial.columns.serial_number") },
  { accessorKey: "date_create", header: t("serial.columns.date_create") },
  { accessorKey: "date_warranty", header: t("serial.columns.date_warranty") },
  {
    accessorKey: "price", header: t("serial.columns.price"), cell: ({ row }) => {
      const price = row.original.price || 0;
      return (
        <h1>{price?.toLocaleString()}</h1>
      );
    },
  },
];

// --- PRODUCTS ---
export const getProductsColumns = (t, language = "ru") => [
  {
    accessorKey: "index",
    header: t("products.columns.id"),
    cell: ({ row }) => {
      return (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {row.index + 1}
        </div>
      );
    },
  },
  {
    accessorKey: "image",
    header: t("products.columns.image"),
    cell: ({ row }) => {
      const image =
        resolveImageUrl(row.original.image) ||
        resolveImageUrl(row.original.images) ||
        resolveImageUrl(row.original.product_images) ||
        resolveImageUrl(row.original.image_url) ||
        resolveImageUrl(row.original.preview);

      if (!image) {
        return (
          <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xs text-muted-foreground">
            Нет
          </div>
        );
      }

      return (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={getLocalizedValue(row.original.name, language) || "Изображение товара"}
            className="w-full h-full object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: t("products.columns.name"),
    cell: ({ row }) => getLocalizedValue(row.original.name, language) || "—",
  },
  {
    accessorKey: "category_name",
    header: t("products.columns.category"),
    cell: ({ row }) => {
      const category =
        row.original.category_name ||
        row.original.category?.name ||
        row.original.category ||
        "";
      return getLocalizedValue(category, language) || "—";
    },
  },
  {
    accessorKey: "warranty",
    header: t("products.columns.warranty"),
    cell: ({ row }) => {
      const warranty = row.original.warranty || row.original.guarantee || "";
      return getLocalizedValue(warranty, language) || "—";
    },
  },
  {
    accessorKey: "price",
    header: t("products.columns.price"),
    cell: ({ row }) => {
      const price = row.original.price || 0;
      return (
        <h1 className="font-semibold">{formatUSD(price)}</h1>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: t("products.columns.createdAt"),
  },
  {
    id: "actions",
    header: t("products.columns.actions"),
    cell: ({ row }) => {
      const product = row.original;

      const handleDelete = (id) => {
        // TODO: API call here
        console.log("Product deleted:", id);
      };

      return (
        <div className="w-full flex gap-2 justify-end">
          <Link href={`/dashboard/products/${product.id}?type=show`}>
            <Button className="cursor-pointer border-2" size="icon" variant="ghost">
              <Image alt="icons" width={50} height={50} src="/icons/arrow.svg" className="h-4 w-4" />
            </Button>
          </Link>

          <Link href={`/dashboard/products/${product.id}?type=edit`}>
            <Button className="cursor-pointer border-2" size="icon" variant="ghost">
              <Image alt="icons" width={50} height={50} src="/icons/edit.svg" className="h-4 w-4" />
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="cursor-pointer border-2" size="icon" variant="ghost">
                <Image alt="icons" width={50} height={50} src="/icons/trash.svg" className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("products.dialog.deleteTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("products.dialog.deleteDesc")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("products.dialog.cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(product.id)}>
                  {t("products.dialog.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export const getCategoriesColumns = (t, language = "ru") => [
  {
    accessorKey: "id",
    header: translate(t, "categories.columns.id", "ID"),
  },
  {
    accessorKey: "title",
    header: translate(t, "categories.columns.title", "Название"),
    cell: ({ row }) => {
      const value = row.original.title || row.original.name || "";
      return getLocalizedValue(value, language) || "—";
    },
  },
  {
    accessorKey: "description",
    header: translate(t, "categories.columns.description", "Описание"),
    cell: ({ row }) =>
      (() => {
        const description = row.original.description || "";
        const localized = getLocalizedValue(description, language);
        if (!localized) return "—";
        const text = localized.slice(0, 120);
        return localized.length > 120 ? `${text}…` : text;
      })(),
  },
  {
    accessorKey: "image",
    header: translate(t, "categories.columns.image", "Изображение"),
    cell: ({ row }) => {
      const image =
        resolveImageUrl(row.original.imageUrl) ||
        resolveImageUrl(row.original.image) ||
        resolveImageUrl(row.original.preview);
      const title = getLocalizedValue(row.original.title || row.original.name, language) || "Изображение категории";

      if (!image) {
        return (
          <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center text-xs text-muted-foreground">
            Нет
          </div>
        );
      }

      return (
        <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: translate(t, "categories.columns.createdAt", "Создано"),
    cell: ({ row }) => {
      const value = row.original.createdAt || row.original.created_at;
      return value ? new Date(value).toLocaleDateString() : "—";
    },
  },
  {
    accessorKey: "updatedAt",
    header: translate(t, "categories.columns.updatedAt", "Обновлено"),
    cell: ({ row }) => {
      const value = row.original.updatedAt || row.original.updated_at;
      return value ? new Date(value).toLocaleDateString() : "—";
    },
  },
  {
    id: "actions",
    header: translate(t, "categories.columns.actions", "Действия"),
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="w-full flex gap-2 justify-end">
          <Link href={`/dashboard/products/categories/${category.id}?type=show`}>
            <Button className="cursor-pointer border-2" size="icon" variant="ghost">
              <Image alt="icons" width={50} height={50} src="/icons/arrow.svg" className="h-4 w-4" />
            </Button>
          </Link>

          <Link href={`/dashboard/products/categories/${category.id}?type=edit`}>
            <Button className="cursor-pointer border-2" size="icon" variant="ghost">
              <Image alt="icons" width={50} height={50} src="/icons/edit.svg" className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      );
    },
  },
];

export const getContractsColumns = (t) => [
  {
    accessorKey: "contract_number",
    header: translate(t, "contracts.columns.number", "Номер"),
    cell: ({ row }) => row.original.contract_number || row.original.number || "—",
  },
  {
    accessorKey: "client",
    header: translate(t, "contracts.columns.client", "Клиент"),
    cell: ({ row }) => {
      const client = row.original.client || row.original.client_name || row.original.client_full_name
      if (typeof client === "string") return client
      if (client && typeof client === "object") {
        const first = client.first_name || client.firstname || ""
        const last = client.last_name || client.lastname || ""
        const combined = [first, last].filter(Boolean).join(" ").trim()
        return combined || client.name || client.company || "—"
      }
      return "—"
    },
  },
  {
    accessorKey: "company",
    header: translate(t, "contracts.columns.company", "Компания"),
    cell: ({ row }) => {
      const company = row.original.company || row.original.company_name
      if (typeof company === "string") return company
      if (company && typeof company === "object" && company.name) {
        return company.name
      }
      return "—"
    },
  },
  {
    accessorKey: "contract_amount",
    header: translate(t, "contracts.columns.amount", "Сумма"),
    cell: ({ row }) => {
      const amount = Number(row.original.contract_amount ?? row.original.amount ?? 0)
      return amount ? amount.toLocaleString() : "0"
    },
  },
  {
    accessorKey: "contract_currency",
    header: translate(t, "contracts.columns.currency", "Валюта"),
    cell: ({ row }) => row.original.contract_currency || row.original.currency || "—",
  },
  {
    accessorKey: "deal_date",
    header: translate(t, "contracts.columns.dealDate", "Дата сделки"),
    cell: ({ row }) => {
      const value =
        row.original.deal_date ||
        row.original.created_at ||
        row.original.createdAt ||
        null
      return value ? new Date(value).toLocaleDateString() : "—"
    },
  },
]
