import { useEffect, useRef, useState } from 'preact/hooks'
import { Sparkles, Send, X, ChevronDown } from 'lucide-preact'

type Role = 'user' | 'assistant'
type Message = { role: Role; content: string; flagged?: boolean }

const ENDPOINT = '/.netlify/functions/chat'
const MAX_INPUT = 500

const GREETING: Message = {
    role: 'assistant',
    content:
        "Hi, I'm Krish's AI assistant. Ask me about his background, projects, skills or what he's looking for, and I'll answer on his behalf.",
}

const BOUNDARY_REPLY = "I'm here to discuss Krish's professional background. Please keep the conversation respectful."
const CLOSED_REPLY = "This chat has been closed due to inappropriate messages. Refresh the page to start a new conversation."

const SUGGESTIONS = [
    'What projects have you built?',
    'Tell me about StackForge',
    "What's your tech stack?",
    'Are you open to internships?',
]

const setCursorHidden = (hidden: boolean) => {
    if (typeof document !== 'undefined') {
        if (hidden) {
            document.body.classList.add('cursor-hidden')
        } else {
            document.body.classList.remove('cursor-hidden')
        }
    }
}

const ChatAssistant = () => {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([GREETING])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [showJump, setShowJump] = useState(false)
    const [strikes, setStrikes] = useState(0)
    const [locked, setLocked] = useState(false)

    const listRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const userJustSentRef = useRef(false)

    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const trigger = (event.target as HTMLElement | null)?.closest('[data-open-assistant]')
            if (!trigger) return
            event.preventDefault()
            setOpen(true)
        }
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false)
        }
        document.addEventListener('click', onClick)
        document.addEventListener('keydown', onKeyDown)
        return () => {
            document.removeEventListener('click', onClick)
            document.removeEventListener('keydown', onKeyDown)
            setCursorHidden(false)
        }
    }, [])

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        const list = listRef.current
        if (list) {
            list.scrollTo({ top: list.scrollHeight, behavior })
        }
    }

    const handleScroll = () => {
        const list = listRef.current
        if (!list) return
        const distanceFromBottom = list.scrollHeight - list.scrollTop - list.clientHeight
        setShowJump(distanceFromBottom > 120)
    }

    useEffect(() => {
        const list = listRef.current
        if (!list) return
        const distanceFromBottom = list.scrollHeight - list.scrollTop - list.clientHeight
        if (userJustSentRef.current || distanceFromBottom <= 80 || messages.length === 1) {
            scrollToBottom('smooth')
        }
        userJustSentRef.current = false
    }, [messages, loading, open])

    useEffect(() => {
        if (open) {
            inputRef.current?.focus()
            scrollToBottom('auto')
        } else {
            setCursorHidden(false)
        }
        const triggers = document.querySelectorAll('[data-open-assistant]')
        triggers.forEach((el) => {
            if (open) {
                el.classList.add('active')
            } else {
                el.classList.remove('active')
            }
        })
    }, [open])

    const send = async (text: string) => {
        const content = text.trim().slice(0, MAX_INPUT)
        if (!content || loading || locked) return

        userJustSentRef.current = true
        const userMsg: Message = { role: 'user', content }
        const next: Message[] = [...messages, userMsg]
        setMessages(next)
        setInput('')
        setLoading(true)

        const cleanHistory = next
            .filter((m) => !m.flagged && m.content !== BOUNDARY_REPLY && m.content !== CLOSED_REPLY)
            .map((m) => ({ role: m.role, content: m.content }))

        try {
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ messages: cleanHistory }),
                signal: AbortSignal.timeout(25000),
            })
            const data = await res.json().catch(() => ({}))
            if (data.flagged) {
                const nextStrikes = strikes + 1
                setStrikes(nextStrikes)
                userMsg.flagged = true
                if (nextStrikes >= 2) {
                    setLocked(true)
                    setMessages([...next, { role: 'assistant', content: CLOSED_REPLY, flagged: true }])
                } else {
                    setMessages([...next, { role: 'assistant', content: BOUNDARY_REPLY, flagged: true }])
                }
            } else {
                const reply =
                    res.ok && data.reply
                        ? data.reply
                        : (data.error ?? "I'm having trouble responding right now. Please try again shortly.")
                setMessages([...next, { role: 'assistant', content: reply }])
            }
        } catch {
            setMessages([
                ...next,
                { role: 'assistant', content: "I'm having trouble responding right now. Please try again shortly." },
            ])
        } finally {
            setLoading(false)
            if (!locked) {
                inputRef.current?.focus()
            }
        }
    }

    const onSubmit = (event: SubmitEvent) => {
        event.preventDefault()
        void send(input)
    }

    return (
        <>
            <button
                type="button"
                aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                class="fixed bottom-5 right-5 z-[70] size-14 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer transition-transform hover:scale-105"
                style={{ background: 'var(--gradient)' }}
            >
                {!open && (
                    <span class="absolute inset-0 rounded-full border-2 border-primary animate-ripple pointer-events-none" />
                )}
                {open ? <X size={24} /> : <Sparkles size={24} />}
            </button>

            <section
                role="dialog"
                aria-label="Chat with Krish's AI assistant"
                aria-hidden={!open}
                data-lenis-prevent
                onMouseEnter={() => setCursorHidden(true)}
                onMouseLeave={() => setCursorHidden(false)}
                class={`fixed bottom-24 right-5 z-[70] flex flex-col w-[min(92vw,380px)] h-[min(72vh,540px)] overflow-hidden rounded-2xl border border-primaryLiteAlt bg-background/95 text-foreground shadow-2xl backdrop-blur-md transition-all duration-200 ${
                    open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
            >
                <header
                    class="flex items-center gap-3 px-4 py-3 border-b border-primaryLiteAlt"
                    style={{ background: 'var(--gradientLite)' }}
                >
                    <Sparkles size={18} />
                    <div class="flex-1 leading-tight">
                        <p class="font-semibold text-sm">Ask Krish's AI</p>
                        <p class="text-xs opacity-70">Answers from Krish's resume and portfolio</p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close chat"
                        onClick={() => setOpen(false)}
                        class="p-1 rounded-md hover:bg-white/10 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </header>

                <div class="relative flex-1 overflow-hidden flex flex-col">
                    <div
                        ref={listRef}
                        onScroll={handleScroll}
                        aria-live="polite"
                        data-lenis-prevent
                        tabIndex={0}
                        class="chat-scroll flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 outline-none"
                    >
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                class={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                                    message.role === 'user'
                                        ? 'self-end text-white rounded-br-sm'
                                        : 'self-start cardGradient border border-primaryLiteAlt rounded-bl-sm'
                                }`}
                                style={message.role === 'user' ? { background: 'var(--gradient)' } : undefined}
                            >
                                {message.content}
                            </div>
                        ))}

                        {loading && (
                            <div class="self-start cardGradient border border-primaryLiteAlt rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5">
                                {[0, 150, 300].map((delay) => (
                                    <span
                                        key={delay}
                                        class="size-1.5 rounded-full bg-primary animate-pulse"
                                        style={{ animationDelay: `${delay}ms` }}
                                    />
                                ))}
                            </div>
                        )}

                        {messages.length === 1 && !loading && !locked && (
                            <div class="flex flex-wrap gap-2 pt-1">
                                {SUGGESTIONS.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => void send(suggestion)}
                                        class="text-xs rounded-full border border-primaryLiteAlt px-3 py-1.5 hover:bg-primaryLiteAlt transition-colors cursor-pointer"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {showJump && (
                        <button
                            type="button"
                            aria-label="Scroll to bottom"
                            onClick={() => scrollToBottom('smooth')}
                            class="absolute bottom-3 left-1/2 -translate-x-1/2 size-8 rounded-full bg-background/90 border border-primaryLiteAlt text-foreground flex items-center justify-center shadow-md hover:bg-primaryLiteAlt transition-all cursor-pointer z-10"
                        >
                            <ChevronDown size={18} />
                        </button>
                    )}
                </div>

                <form onSubmit={onSubmit} class="flex items-center gap-2 border-t border-primaryLiteAlt p-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        maxLength={MAX_INPUT}
                        disabled={locked || loading}
                        placeholder={locked ? 'Chat closed. Refresh to start again' : 'Ask about Krish...'}
                        aria-label="Your question"
                        onInput={(event) => setInput((event.target as HTMLInputElement).value)}
                        class="flex-1 min-w-0 rounded-lg border border-primaryLiteAlt bg-transparent px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        aria-label="Send message"
                        disabled={locked || loading || !input.trim()}
                        class="size-9 shrink-0 rounded-lg flex items-center justify-center text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                        style={{ background: 'var(--gradient)' }}
                    >
                        <Send size={16} />
                    </button>
                </form>
            </section>
        </>
    )
}

export default ChatAssistant
