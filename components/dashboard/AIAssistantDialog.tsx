import React, { useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter, DialogClose } from '../ui/Dialog';
import Button from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Send, Sparkles, Loader2, Bot, User, CalendarPlus } from 'lucide-react';
import { getAIAssistantResponse } from '../../services/geminiService';
import { useApp } from '../../hooks/useApp';
import { AITaskSuggestion } from '../../lib/types';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { cn } from '../../lib/utils';


interface Message {
    sender: 'user' | 'ai';
    text?: string;
    suggestion?: AITaskSuggestion;
}

const AIAssistantDialog: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { addEvent, taskCategories } = useApp();
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! How can I help you manage your compliance tasks today? You can ask me to create new events from text." }
    ]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await getAIAssistantResponse(input);
            let aiMessage: Message;
            try {
                // Check if the response is a JSON suggestion
                const parsedJson = JSON.parse(aiResponseText) as AITaskSuggestion;
                if (parsedJson.isTaskSuggestion && parsedJson.task) {
                    aiMessage = { sender: 'ai', suggestion: parsedJson };
                } else {
                     aiMessage = { sender: 'ai', text: aiResponseText };
                }
            } catch (e) {
                // Not a JSON object, so it's a regular text response
                aiMessage = { sender: 'ai', text: aiResponseText };
            }
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: Message = { sender: 'ai', text: error instanceof Error ? error.message : "An unknown error occurred." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTask = async (suggestion: AITaskSuggestion) => {
        await addEvent({
            ...suggestion.task,
            status: 'pending',
            priority: 'medium',
            category: taskCategories[0]?.id || 'cat-1', // Default category
        });
        
        const confirmationMessage: Message = {
            sender: 'ai',
            text: `Great! I've added "${suggestion.task.title}" to your calendar.`
        };
        setMessages(prev => [...prev, confirmationMessage]);
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Sparkles className="text-yellow-500"/> AI Assistant</DialogTitle>
                <DialogDescription>Use natural language to manage your compliance calendar.</DialogDescription>
                <DialogClose onClose={onClose} />
            </DialogHeader>
            <DialogContent className="min-h-[400px] flex flex-col">
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                    {messages.map((msg, index) => (
                        <div key={index} className={cn("flex items-start gap-3", { 'justify-end': msg.sender === 'user' })}>
                             {msg.sender === 'ai' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Bot className="h-5 w-5 text-primary"/></div>}
                            <div className={cn("max-w-xs md:max-w-md rounded-lg px-4 py-2", {
                                'bg-primary text-primary-foreground': msg.sender === 'user',
                                'bg-secondary': msg.sender === 'ai',
                            })}>
                               {msg.text && <p className="text-sm">{msg.text}</p>}
                               {msg.suggestion && (
                                   <Card className="bg-background">
                                       <CardContent className="p-4 space-y-2">
                                           <h4 className="font-semibold">{msg.suggestion.task.title}</h4>
                                           <p className="text-sm text-muted-foreground">{msg.suggestion.task.description}</p>
                                           <p className="text-xs font-medium text-muted-foreground">Due: {new Date(msg.suggestion.task.dueDate).toLocaleDateString()}</p>
                                       </CardContent>
                                       <CardFooter className="p-2 border-t">
                                           <Button size="sm" className="w-full" onClick={() => handleAddTask(msg.suggestion!)}>
                                               <CalendarPlus className="mr-2 h-4 w-4"/>
                                               Add to Calendar
                                           </Button>
                                       </CardFooter>
                                   </Card>
                               )}
                            </div>
                            {msg.sender === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center"><User className="h-5 w-5 text-secondary-foreground"/></div>}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Bot className="h-5 w-5 text-primary"/></div>
                             <div className="max-w-sm rounded-lg px-4 py-3 bg-secondary flex items-center">
                                 <Loader2 className="h-5 w-5 animate-spin text-primary" />
                             </div>
                         </div>
                    )}
                </div>
            </DialogContent>
            <DialogFooter className="border-t pt-4">
                <div className="flex w-full items-center gap-2">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., 'Remind me to file the quarterly report by next Friday...'"
                        className="flex-1 resize-none"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                       {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </DialogFooter>
        </Dialog>
    );
};

export default AIAssistantDialog;
