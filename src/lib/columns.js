// columns-factory.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Link from "next/link";
import { formatUzPhone } from "./utils";

// --- CLIENTS ---
export const getClientsColumns = (t) => [
  {
    accessorKey: "id",
    header: t("clients.columns.id"),
  },
  {
    accessorKey: "name",
    header: t("clients.columns.name"),
  },
  {
    accessorKey: "orders",
    header: t("clients.columns.orders"),
    cell: ({ row }) => {
      let count = row.original.orders || 0;
      const has = count > 0;
      return (
        <div className="text-primary flex justify-start items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${has ? "bg-green-600" : "bg-gray-600"}`} />
          <h1>{t("clients.columns.ordersCount", { count })}</h1>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: t("clients.columns.phone"),
    cell: ({ row }) => {
      const phone = row.original.phone;
      return (
        <h1>{formatUzPhone(phone)}</h1>
      )
    }
  },
  {
    accessorKey: "email",
    header: t("clients.columns.email"),
  },
  {
    id: "actions",
    header: t("clients.columns.actions"),
    cell: ({ row }) => {
      const client = row.original;

      const handleDelete = (id) => {
        // TODO: API call here
        console.log("Client deleted:", id);
      };

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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="cursor-pointer border-2" size="icon" variant="ghost">
                <Image alt="icons" width={50} height={50} src="/icons/trash.svg" className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("clients.dialog.deleteTitle")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("clients.dialog.deleteDesc")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("clients.dialog.cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(client.id)}>
                  {t("clients.dialog.confirm")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

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
