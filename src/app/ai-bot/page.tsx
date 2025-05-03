"use client";

import React from "react";
import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

function AIChat() {
  const { messages, input, handleInputChange, handleSubmit, setInput, isLoading } = useChat({
    api: '/api/chat'
  });

  const premadeQuestions = [
    "¿Cómo puedo usar plantas medicinales para el dolor de estómago?",
    "Cuéntame sobre agricultura sostenible en los Andes",
    "¿Qué ceremonias tradicionales quechuas existen para la siembra?",
    "Explícame la cosmovisión aimara sobre las estrellas"
  ];

  return (
    <div className="min-h-svh flex flex-col items-center px-4 py-8">
      <div className="text-center mb-6">
        <Image 
          src="/images/logo/yachaybot_logo2.png" 
          alt="Logo de YachayBot" 
          width={100} 
          height={100} 
          className="mx-auto"
        />
        <h1 className="text-2xl font-bold mt-2">YACHAYBOT</h1>
        <p className="text-muted-foreground">Saberes ancestrales en tu idioma</p>
      </div>

      <div className="w-full max-w-md flex flex-col gap-6 flex-1">
        <div className="grid grid-cols-2 gap-3">
          {premadeQuestions.map((question, index) => (
            <Button
              key={index}
              type="button"
              variant="default"
              className="h-auto py-2 px-3 text-xs text-left whitespace-normal break-words"
              onClick={() => setInput(question)}
              disabled={isLoading}
            >
              {question}
            </Button>
          ))}
        </div>

        <ScrollArea className="flex-1 h-[50vh] pr-2">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`whitespace-pre-wrap p-3 rounded-lg text-sm ${
                  message.role === "user" 
                    ? "bg-foreground text-background ml-auto max-w-[80%]" 
                    : "bg-foreground text-background mr-auto max-w-[80%]"
                }`}
              >
                {message.role === "user" ? (
                  <strong className="block font-medium mb-1">Tú:</strong>
                ) : (
                  <div className="flex items-center gap-2 mb-1">
                    <Image
                      src="/images/logo/yachaybot_logo2.png"
                      alt="Logo YachayBot"
                      width={40}
                      height={40}
                      className="rounded-sm"
                    />
                    <strong className="font-medium">YachayBot:</strong>
                  </div>
                )}
                {message.content}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="p-3 rounded-lg bg-foreground text-background mr-auto max-w-[80%]">
                <div className="flex items-center gap-2 mb-1">
                  <Image
                    src="/images/logo/yachaybot_logo2.png"
                    alt="Logo YachayBot"
                    width={40}
                    height={40}
                    className="rounded-sm"
                  />
                  <strong className="font-medium">YachayBot:</strong>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-background animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-background animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-background animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form 
          onSubmit={handleSubmit} 
          className="w-full sticky bottom-0 bg-background border-t pt-4"
          aria-label="Formulario de chat"
        >
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Pregunta sobre saberes ancestrales..."
              className="flex-1"
              aria-label="Escribe tu pregunta"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Pensando...' : 'Enviar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AIChat;