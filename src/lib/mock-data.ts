export type NamedOption = {
  id: string
  name: string
}

export type CurrencyOption = {
  id: string
  label: string
}

export type ProductOption = {
  id: string
  name: string
  category: string
  description: string
  price: number
  vat: number
  discount: number
  image: string
  guarantee: string
  serial: string
}

export const mockClients: NamedOption[] = [
  { id: "client-1", name: "Acme Industries" },
  { id: "client-2", name: "Global Solutions" },
  { id: "client-3", name: "Nova Logistics" },
];

export const mockCounterparties: NamedOption[] = [
  { id: "counterparty-1", name: "Frontier Partners" },
  { id: "counterparty-2", name: "Vertex Holdings" },
  { id: "counterparty-3", name: "Brightline Suppliers" },
];

export const mockCompanies: NamedOption[] = [
  { id: "company-1", name: "BCT Group LLC" },
  { id: "company-2", name: "BCT Distribution" },
  { id: "company-3", name: "BCT Services" },
];

export const mockWarehouses: NamedOption[] = [
  { id: "warehouse-1", name: "Central Warehouse" },
  { id: "warehouse-2", name: "North Hub" },
  { id: "warehouse-3", name: "South Storage" },
];

export const mockCurrencies: CurrencyOption[] = [
  { id: "USD", label: "USD" },
];

export const mockProducts: ProductOption[] = [
  {
    id: "1",
    name: "Industrial Printer X1",
    category: "Office Equipment",
    description: "High-speed thermal printer ideal for industrial labeling.",
    price: 3500000,
    vat: 12,
    discount: 0,
    image:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=800&q=80",
    guarantee: "12 months",
    serial: "PRX1-2024",
  },
  {
    id: "2",
    name: "Barcode Scanner Pro",
    category: "Inventory",
    description: "Handheld barcode scanner with wireless connectivity.",
    price: 980000,
    vat: 12,
    discount: 0,
    image:
      "https://images.unsplash.com/photo-1580894895440-11ee3b46335d?auto=format&fit=crop&w=800&q=80",
    guarantee: "24 months",
    serial: "BRS-PRO-009",
  },
  {
    id: "3",
    name: "Warehouse Tablet",
    category: "Electronics",
    description: "Rugged tablet designed for warehouse data collection.",
    price: 4800000,
    vat: 12,
    discount: 5,
    image:
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
    guarantee: "18 months",
    serial: "WT-2024-18",
  },
  {
    id: "4",
    name: "Logistics Software License",
    category: "Software",
    description: "Annual subscription for warehouse management software.",
    price: 6500000,
    vat: 15,
    discount: 10,
    image:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=800&q=80",
    guarantee: "12 months",
    serial: "LSL-ANNUAL",
  },
  {
    id: "5",
    name: "Pallet Jack",
    category: "Equipment",
    description: "Heavy-duty pallet jack with 3000kg capacity.",
    price: 2800000,
    vat: 12,
    discount: 0,
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
    guarantee: "36 months",
    serial: "PJ-3000",
  },
];
