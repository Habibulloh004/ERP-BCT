import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
export default function LogoutDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className="h-10 w-full flex justify-start items-center gap-2">
          <Button className='w-10 h-10 flex justify-center items-center'>
            <LogOut className='text-white w-10 h-10' size={32} />
          </Button>
          <h1 className='text-lg'>
            Выйти
          </h1>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
