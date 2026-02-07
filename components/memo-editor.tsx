"use client"

import { useRef, useState, useEffect } from "react"
import { Trash2, Save } from "lucide-react"
import type { Memo } from "@/components/memo-app"

interface MemoEditorProps {
  memo: Memo | null
  onUpdate: (id: number, content: string) => void
  onDelete: (id: number) => void
}

export function MemoEditor({ memo, onUpdate, onDelete }: MemoEditorProps) {
  const [showStatus, setShowStatus] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current && memo) {
      textareaRef.current.value = memo.content
    }
  }, [memo?.id])

  if (!memo) return null

  function handleInput(value: string) {
    if (!memo) return
    onUpdate(memo.id, value)

    setShowStatus(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setShowStatus(false), 1000)
  }

  function handleDelete() {
    if (!memo) return
    if (confirm("정말로 이 메모를 삭제하시겠습니까?")) {
      onDelete(memo.id)
    }
  }

  function handleSave() {
    if (!memo || !textareaRef.current) return
    onUpdate(memo.id, textareaRef.current.value)

    setShowStatus(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setShowStatus(false), 1000)
  }

  return (
    <main className="relative flex flex-1 flex-col p-8">
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleDelete}
          title="현재 메모 삭제"
          className="rounded p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
        >
          <Trash2 size={18} />
          <span className="sr-only">{"메모 삭제"}</span>
        </button>
      </div>

      <textarea
        ref={textareaRef}
        defaultValue={memo.content}
        onChange={(e) => handleInput(e.target.value)}
        placeholder="메모를 입력하세요..."
        className="flex-1 resize-none bg-transparent pb-8 text-lg leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        aria-label="메모 내용"
      />

      <button
        onClick={handleSave}
        title="저장하기"
        className="absolute bottom-8 right-8 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
      >
        <Save size={24} />
        <span className="sr-only">{"저장"}</span>
      </button>

      <div
        className={`absolute bottom-8 right-[6.5rem] leading-[3.5rem] text-sm text-muted-foreground transition-opacity ${
          showStatus ? "opacity-100" : "opacity-0"
        }`}
        aria-live="polite"
      >
        {"저장됨"}
      </div>
    </main>
  )
}
