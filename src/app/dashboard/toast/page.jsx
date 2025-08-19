"use client";

import React from "react";
import { toast } from "sonner";
import { 
  toastSuccess, 
  toastError, 
  toastWarning, 
  toastLoading 
} from "@/lib/toast";

export default function Demo() {
  const onSave = async () => {
    const id = toastLoading({ 
      title: "Сохранение...", 
      description: "Пожалуйста, подождите" 
    });

    try {
      await new Promise((r) => setTimeout(r, 1500));
      toast.dismiss(id);
      toastSuccess({ 
        title: "Успех!", 
        description: "Новая запись успешно добавлена!" 
      });
    } catch (e) {
      toast.dismiss(id);
      toastError({ 
        title: "Ошибка", 
        description: "Не удалось сохранить изменения" 
      });
    }
  };

  const onWarn = () =>
    toastWarning({
      title: "Внимание",
      description: "Это действие нельзя отменить!",
    });

  const onError = () =>
    toastError({
      title: "Ошибка",
      description: "Что-то пошло не так...",
    });

  return (
    <div className="flex gap-3 p-6">
      <button onClick={onSave} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
      <button onClick={onWarn} className="px-4 py-2 rounded bg-amber-500 text-white">Warning</button>
      <button onClick={onError} className="px-4 py-2 rounded bg-red-600 text-white">Error</button>
    </div>
  );
}
