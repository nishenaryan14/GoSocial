import "./message.css";
export default function Message({ own }) {
  return (
    <div className={`message ${own && "own"}`}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
        />
        <p className="messageText">hello this is a message</p>
      </div>
      <div className="messageBottom">1 Hour ago</div>
    </div>
  );
}
