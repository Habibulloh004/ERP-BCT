import React from "react"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
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
} from "@/components/ui/alert-dialog"
import Image from "next/image"
import Link from "next/link"

export const clientsColumns = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "Ism Familiya",
  },
  {
    accessorKey: "orders",
    header: "Buyurtmalar",
    cell: ({ row }) => (
      <div className={"text-primary flex justify-start items-center gap-2"}>
        {row.original.orders > 0 ? (
          <div className="w-2 h-2 rounded-full bg-green-600" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-gray-600" />
        )}
        <h1>
          {row.original.orders} заказов
        </h1>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Telefon",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const client = row.original

      // handleDelete ni bu yerda tanilaylik
      const handleDelete = (id) => {
        console.log('Mijoz o\'chirildi:', id)
        // Real API chaqiruvini bu yerda amalga oshiring
      }

      return (
        <div className="w-full flex gap-2 justify-end">
          {/* Ko'rish */}
          <Link href={`/dashboard/clients/${client.id}?type=show`}>
            <Button className={"cursor-pointer border-2"} size="icon" variant="ghost" onClick={() => alert(`Ko'rish: ${client.name}`)}>
              <Image alt="icons" width={50} height={50} src="/icons/arrow.svg" className="h-4 w-4" />
            </Button>
          </Link>

          {/* Tahrirlash */}
          <Link href={`/dashboard/clients/${client.id}?type=edit`}>
            <Button className={"cursor-pointer border-2"} size="icon" variant="ghost" onClick={() => alert(`Edit: ${client.name}`)}>
              <Image alt="icons" width={50} height={50} src="/icons/edit.svg" className="h-4 w-4" />
            </Button>
          </Link>

          {/* O'chirish (AlertDialog bilan) */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className={"cursor-pointer border-2"} size="icon" variant="ghost">
                <Image alt="icons" width={50} height={50} src="/icons/trash.svg" className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>O'chirishni tasdiqlaysizmi?</AlertDialogTitle>
                <AlertDialogDescription>
                  Ushbu mijozni o'chirib tashlasangiz, uni qayta tiklab bo'lmaydi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(client.id)}>
                  Ha, o'chirish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  },
]