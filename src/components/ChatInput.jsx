import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function ChatInput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");
  const [pickerPosition, setPickerPosition] = useState({
    top: "auto",
    bottom: "auto",
  });
  const emojiButtonRef = useRef(null);

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  useEffect(() => {
    if (showEmojiPicker && emojiButtonRef.current) {
      const rect = emojiButtonRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      if (spaceBelow < 350 && spaceAbove > 350) {
        // If there's not enough space below but enough space above, position it above
        setPickerPosition({ top: "auto", bottom: "50px" });
      } else {
        // Otherwise, position it below
        setPickerPosition({ top: "-350px", bottom: "auto" });
      }
    }
  }, [showEmojiPicker]);

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji" ref={emojiButtonRef}>
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && (
            <div className="emoji-picker-container" style={pickerPosition}>
              {" "}
              <Picker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #080420;
  padding: 0 2rem;
  padding-bottom: 0.3rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    position: relative;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
    }
  }
  .emoji-picker-container {
    position: absolute;
    background-color: #080420;
    box-shadow: 0 5px 10px #9a86f3;
    border-color: #9186f3;
    z-index: 10;
    .emoji-scroll-wrapper::-webkit-scrollbar {
      background-color: #080420;
      width: 5px;
      &-thumb {
        background-color: #9186f3;
      }
    }
    .emoji-categories {
      button {
        filter: contrast(0);
      }
    }
    .emoji-search {
      background-color: transparent;
      border-color: #9186f3;
    }
    .emoji-group:before {
      background-color: #080420;
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-content: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      &::selection {
        background-color: #9186f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
