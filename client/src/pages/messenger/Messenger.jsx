import Chat from "../../components/chat/Chat";
import Message from "../../components/message/Message";
import "./messenger.css";
export default function Messenger() {
  return (
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <input
            type="text"
            placeholder="Chat with your Friends!"
            className="searchMessenger"
          />
          <Chat />
          <Chat />
          <Chat />
          <Chat />
        </div>
      </div>
      <div className="chatBox">
        <div className="chatBoxWrapper">
          <div className="chatBoxTop">
            <Message />
            <Message own={true} />
            <Message />
          </div>
          <div className="chatBoxBottom">
            <textarea
              className="chatMessageInput"
              placeholder="write something...."
            ></textarea>
            <button className="chatSubmitBtn">Send</button>
          </div>
        </div>
      </div>
      <div className="chatOnline">
        <div className="chatOnlineWrapper"></div>
      </div>
    </div>
  );
}
