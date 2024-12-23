import Slidebar from "./components/slidebar";
import Body from "./components/body";
import MessageBlock from "./components/messageBlock";

const ChatPage = ({ socket }) => {
  return (
    <div className="flex h-svh p-5">
      <Slidebar className=""/>
      <main>
        <Body />
        <MessageBlock />
      </main>
    </div>
  );
};

export default ChatPage;
