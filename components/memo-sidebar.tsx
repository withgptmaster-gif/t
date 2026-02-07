"use client"

import { Plus } from "lucide-react"
import type { Memo } from "@/components/memo-app"

interface SidebarProps {
  memos: Memo[]
  currentMemoId: number | null
  onSelect: (id: number) => void
  onCreate: () => void
}

export function Sidebar({ memos, currentMemoId, onSelect, onCreate }: SidebarProps) {
  return (
    <aside className="flex w-[280px] shrink-0 flex-col border-r border-border bg-secondary">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h2 className="text-lg font-semibold text-foreground">{"메모 목록"}</h2>
        <button
          onClick={onCreate}
          title="새 메모"
          className="flex items-center justify-center rounded p-2 text-foreground transition-colors hover:bg-muted"
        >
          <Plus size={20} />
          <span className="sr-only">{"새 메모 추가"}</span>
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto p-2" role="listbox" aria-label="메모 목록">
        {memos.map((memo) => {
          const preview =
            memo.content.trim().split("\n")[0]?.substring(0, 20) || "새로운 메모"
          const displayPreview =
            memo.content.trim().split("\n")[0]?.length > 20
              ? preview + "..."
              : preview
          const date = new Date(memo.updatedAt).toLocaleDateString()

          return (
            <li
              key={memo.id}
              role="option"
              aria-selected={memo.id === currentMemoId}
              onClick={() => onSelect(memo.id)}
              className={`mb-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-lg p-4 text-sm transition-colors ${
                memo.id === currentMemoId
                  ? "bg-card font-medium shadow-sm"
                  : "hover:bg-muted"
              }`}
            >
              <div className="text-foreground">{displayPreview}</div>
              <span className="mt-1 block text-xs text-muted-foreground">
                {date}
              </span>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
