'use client';

import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ChatbotButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className={cn(
                    "fixed bottom-6 right-6 z-50 transition-all duration-300",
                    isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
                )}
            >
                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare className="h-6 w-6" />
                </Button>
            </div>

            {/* Chat Windows Prototype */}
            <div
                className={cn(
                    "fixed bottom-6 right-6 z-50 flex w-[350px] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl transition-all duration-300 origin-bottom-right",
                    isOpen
                        ? "scale-100 opacity-100 translate-y-0"
                        : "scale-95 opacity-0 translate-y-10 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-primary px-4 py-3 text-primary-foreground">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border-2 border-primary-foreground/20">
                            <AvatarImage src="/images/avatars/01.png" alt="@ai" />
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="text-sm font-semibold">Scholar Agent</h4>
                            <p className="text-[10px] opacity-80">Online</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 bg-muted/30 p-4 h-[300px] overflow-y-auto space-y-4">
                    <div className="flex gap-2 max-w-[80%]">
                        <Avatar className="h-6 w-6 shrink-0 mt-1">
                            <AvatarFallback className="text-[10px]">AI</AvatarFallback>
                        </Avatar>
                        <div className="rounded-2xl rounded-tl-none bg-muted p-3 text-sm">
                            Hello! I'm your Scholar Assistant. How can I help you with your manuscript review today?
                        </div>
                    </div>
                    <div className="flex gap-2 max-w-[80%] ml-auto flex-row-reverse">
                        <div className="rounded-2xl rounded-tr-none bg-primary text-primary-foreground p-3 text-sm">
                            I need help analyzing the methodology.
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-3 bg-background">
                    <form className="flex item-center gap-2" onSubmit={(e) => e.preventDefault()}>
                        <Input placeholder="Type a message..." className="h-9 rounded-full" />
                        <Button size="icon" type="submit" className="h-9 w-9 rounded-full shrink-0">
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
