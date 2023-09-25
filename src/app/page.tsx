"use client"

import { ChatArea } from "@/components/ChatArea";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { SidebarChatButton } from "@/components/SidebarChatButton";
import { Chat } from "@/types/Chat";
import { useEffect, useState } from "react";

import { v4 as uuid } from "uuid";

const Page = () => {

  const openSidebar = () => setSidebarOpened(true);
  const closeSidebar = () => setSidebarOpened(false);

  const [chatActiveId, setChatActiveId] = useState<string>('');
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [SidebarOpened, setSidebarOpened] = useState(true);
  const [chatActive, setChatActive] = useState<Chat>();
  const [AILoading, setAILoading] = useState(false);

  const handleClearConversations = () => {
    if (AILoading) return;

    setChatActiveId('');
    setChatList([]);
  }

  const handleNewChat = () => {
    if (AILoading) return;

    setChatActiveId('');
    closeSidebar();
  }

  const handleSendMessage = (message: string) => {
    if (!chatActiveId) {
      let newChatId = uuid();
      setChatList([{
        id: newChatId,
        title: message,
        messages: [
          { id: uuid(), author: 'me', body: message }
        ]
      }, ...chatList]);

      setChatActiveId(newChatId);
    } else {
      let chatListClone = [...chatList];
      let chatIndex = chatListClone.findIndex(item => item.id === chatActiveId);
      chatListClone[chatIndex].messages.push({
        id: uuid(), author: 'me', body: message
      });

      setChatList(chatListClone);
    }

    setAILoading(true);
  }

  const getAIResponse = () => {
    setTimeout(() => {
      let chatListClone = [...chatList];
      let chatIndex = chatListClone.findIndex(item => item.id === chatActiveId);

      if (chatIndex > -1) {
        chatListClone[chatIndex].messages.push({
          id: uuid(),
          author: 'ai',
          body: 'Aqui vai a resposta da AI'
        });
      }

      setChatList(chatListClone);
      setAILoading(false);

    }, 2000);
  }

  const handleSelectChat = (id: string) => {
    if (AILoading) return;

    let item = chatList.find(item => item.id === id);
    if (item) {
      setChatActiveId(item.id);
    }

    closeSidebar();
  }

  const handleDeleteChat = (id: string) => {
    let chatListClone = [...chatList];
    let chatIndex = chatListClone.findIndex(item => item.id === id);
    chatListClone.splice(chatIndex, 1);
    setChatList(chatListClone);
    setChatActiveId('');
  }

  const handleEditChat = (id: string, newTitle: string) => {
    if (newTitle) {
      let chatListClone = [...chatList];
      let chatIndex = chatListClone.findIndex(item => item.id === id);
      chatListClone[chatIndex].title = newTitle;
      setChatList(chatListClone);
    }
  }

  useEffect(() => {
    setChatActive(chatList.find(item => item.id === chatActiveId))
  }, [chatActiveId, chatList]);

  useEffect(() => {
    if (AILoading) getAIResponse();
  }, [AILoading])

  return (
    <main className="flex min-h-screen bg-gpt-gray">
      <Sidebar
        open={SidebarOpened}
        onClose={closeSidebar}
        onClear={handleClearConversations}
        onNewChat={handleNewChat}
      >

        {chatList.map(item => (
          <SidebarChatButton
            key={item.id}
            chatItem={item}
            active={item.id === chatActiveId}
            onClick={handleSelectChat}
            onDelete={handleDeleteChat}
            onEdit={handleEditChat}
          />
        ))}
      </Sidebar>

      <section className="flex flex-col w-full">
        <Header
          openSidebarClick={openSidebar}
          title={chatActive ? chatActive.title : 'Nova conversa'}
          newChatClick={handleNewChat}
        />

        <ChatArea chat={chatActive} loading={AILoading} />

        <Footer
          disabled={AILoading}
          onSendMessage={handleSendMessage}
        />

      </section>
    </main>
  );
}

export default Page;