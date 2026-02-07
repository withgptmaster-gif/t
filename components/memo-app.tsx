"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Sidebar } from "@/components/memo-sidebar"
import { MemoEditor } from "@/components/memo-editor"

export interface Memo {
  id: number
  content: string
  updatedAt: number
}

const MEMOS_KEY = "memos_data"

export function MemoApp() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [currentMemoId, setCurrentMemoId] = useState<number | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Load memos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(MEMOS_KEY)
    let loadedMemos: Memo[] = []

    if (saved) {
      try {
        loadedMemos = JSON.parse(saved)
      } catch {
        loadedMemos = []
      }
    }

    if (loadedMemos.length === 0) {
      const newMemo: Memo = {
        id: Date.now(),
        content: "",
        updatedAt: Date.now(),
      }
      loadedMemos = [newMemo]
    }

    setMemos(loadedMemos)
    setCurrentMemoId(loadedMemos[0].id)
    setLoaded(true)
  }, [])

  // Save to localStorage whenever memos change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(MEMOS_KEY, JSON.stringify(memos))
    }
  }, [memos, loaded])

  const createMemo = useCallback(() => {
    const newMemo: Memo = {
      id: Date.now(),
      content: "",
      updatedAt: Date.now(),
    }
    setMemos((prev) => [newMemo, ...prev])
    setCurrentMemoId(newMemo.id)
  }, [])

  const selectMemo = useCallback((id: number) => {
    setCurrentMemoId(id)
  }, [])

  const updateMemo = useCallback((id: number, content: string) => {
    setMemos((prev) => {
      const memo = prev.find((m) => m.id === id)
      if (!memo) return prev
      const updated = { ...memo, content, updatedAt: Date.now() }
      return [updated, ...prev.filter((m) => m.id !== id)]
    })
  }, [])

  const deleteMemo = useCallback(
    (id: number) => {
      setMemos((prev) => {
        const filtered = prev.filter((m) => m.id !== id)
        if (filtered.length === 0) {
          const newMemo: Memo = {
            id: Date.now(),
            content: "",
            updatedAt: Date.now(),
          }
          setCurrentMemoId(newMemo.id)
          return [newMemo]
        }
        if (id === currentMemoId) {
          setCurrentMemoId(filtered[0].id)
        }
        return filtered
      })
    },
    [currentMemoId]
  )

  const currentMemo = memos.find((m) => m.id === currentMemoId) || null

  if (!loaded) {
    return null
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar
        memos={memos}
        currentMemoId={currentMemoId}
        onSelect={selectMemo}
        onCreate={createMemo}
      />
      <MemoEditor
        memo={currentMemo}
        onUpdate={updateMemo}
        onDelete={deleteMemo}
      />
    </div>
  )
}
