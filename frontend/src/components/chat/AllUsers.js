// import { useState, useEffect } from "react";
// import { createChatRoom } from "../../services/ChatService";
// import Contact from "./Contact";
// import UserLayout from "../layouts/UserLayout";

// function classNames(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function AllUsers({
//   users = [],            // Default to empty array to prevent undefined
//   chatRooms = [],        // Default to empty array to prevent undefined
//   setChatRooms,
//   onlineUsersId,
//   currentUser,
//   changeChat,
// }) {
//   const [selectedChat, setSelectedChat] = useState();
//   const [nonContacts, setNonContacts] = useState([]);
//   const [contactIds, setContactIds] = useState([]);

//   useEffect(() => {
//     if (chatRooms && currentUser?.uid) {
//       const Ids = chatRooms.map((chatRoom) => {
//         return chatRoom.members.find((member) => member !== currentUser.uid);
//       });
//       setContactIds(Ids);
//     }
//   }, [chatRooms, currentUser?.uid]);

//   useEffect(() => {
//     if (users && currentUser?.uid) {
//       setNonContacts(
//         users.filter(
//           (f) => f.uid !== currentUser.uid && !contactIds.includes(f.uid)
//         )
//       );
//     }
//   }, [contactIds, users, currentUser?.uid]);

//   const changeCurrentChat = (index, chat) => {
//     setSelectedChat(index);
//     changeChat(chat);
//   };

//   const handleNewChatRoom = async (user) => {
//     try {
//       const members = {
//         senderId: currentUser.uid,
//         receiverId: user.uid,
//       };
//       const res = await createChatRoom(members);
//       if (res) {
//         setChatRooms((prev) => [...prev, res]);
//         changeChat(res);
//       }
//     } catch (error) {
//       console.error("Error creating chat room:", error);
//     }
//   };

//   return (
//     <>
//       <ul className="overflow-auto h-[30rem]">
//         <h2 className="my-2 mb-2 ml-2 text-gray-900 dark:text-white">Chats</h2>
//         <li>
//           {Array.isArray(chatRooms) && chatRooms.length > 0 ? (
//             chatRooms.map((chatRoom, index) => (
//               <div
//                 key={index}
//                 className={classNames(
//                   index === selectedChat
//                     ? "bg-gray-100 dark:bg-gray-700"
//                     : "transition duration-150 ease-in-out cursor-pointer bg-white border-b border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700",
//                   "flex items-center px-3 py-2 text-sm "
//                 )}
//                 onClick={() => changeCurrentChat(index, chatRoom)}
//               >
//                 <Contact
//                   chatRoom={chatRoom}
//                   onlineUsersId={onlineUsersId}
//                   currentUser={currentUser}
//                 />
//               </div>
//             ))
//           ) : (
//             <p className="ml-2 text-gray-500">No chats available.</p>
//           )}
//         </li>

//         <h2 className="my-2 mb-2 ml-2 text-gray-900 dark:text-white">Other Users</h2>
//         <li>
//           {Array.isArray(nonContacts) && nonContacts.length > 0 ? (
//             nonContacts.map((nonContact, index) => (
//               <div
//                 key={index}
//                 className="flex items-center px-3 py-2 text-sm bg-white border-b border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer"
//                 onClick={() => handleNewChatRoom(nonContact)}
//               >
//                 <UserLayout user={nonContact} onlineUsersId={onlineUsersId} />
//               </div>
//             ))
//           ) : (
//             <p className="ml-2 text-gray-500">No other users available.</p>
//           )}
//         </li>
//       </ul>
//     </>
//   );
// }
import { useState, useEffect } from "react";
import { createChatRoom, getUser } from "../../services/ChatService";
import UserLayout from "../layouts/UserLayout";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AllUsers({
  users = [],
  chatRooms = [],
  setChatRooms,
  onlineUsersId,
  currentUser,
  changeChat,
}) {
  const [selectedChat, setSelectedChat] = useState();
  const [nonContacts, setNonContacts] = useState([]);
  const [contactIds, setContactIds] = useState([]);
  const [chatContacts, setChatContacts] = useState([]); // NEW: contacts with user info

  // Fetch chatRoom contact userIds
  useEffect(() => {
    if (chatRooms && currentUser?.uid) {
      const ids = chatRooms.map((chatRoom) => {
        return chatRoom.members.find((member) => member !== currentUser.uid);
      });
      setContactIds(ids);
    }
  }, [chatRooms, currentUser?.uid]);

  // Fetch non-contacts from 'users'
  useEffect(() => {
    if (users && currentUser?.uid) {
      setNonContacts(
        users.filter(
          (f) => f.uid !== currentUser.uid && !contactIds.includes(f.uid)
        )
      );
    }
  }, [contactIds, users, currentUser?.uid]);

  // Fetch full contact data for each chatRoom member
  useEffect(() => {
    const fetchContacts = async () => {
      const contactsData = await Promise.all(
        chatRooms.map(async (room) => {
          const contactId = room.members.find((m) => m !== currentUser.uid);
          const user = await getUser(contactId);
          return { ...room, user }; // add 'user' info to each room
        })
      );
      setChatContacts(contactsData);
    };

    if (chatRooms.length > 0) fetchContacts();
  }, [chatRooms, currentUser?.uid]);

  const changeCurrentChat = (index, chat) => {
    setSelectedChat(index);
    changeChat(chat);
  };

  const handleNewChatRoom = async (user) => {
    try {
      const members = {
        senderId: currentUser.uid,
        receiverId: user.uid,
      };
      const res = await createChatRoom(members);
      if (res) {
        setChatRooms((prev) => [...prev, res]);
        changeChat(res);
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };

  return (
    <ul className="overflow-auto h-[30rem]">
      <h2 className="my-2 mb-2 ml-2 text-gray-900 dark:text-white">Chats</h2>
      <li>
        {Array.isArray(chatContacts) && chatContacts.length > 0 ? (
          chatContacts.map((chatRoom, index) => (
            <div
              key={index}
              className={classNames(
                index === selectedChat
                  ? "bg-gray-100 dark:bg-gray-700"
                  : "transition duration-150 ease-in-out cursor-pointer bg-white border-b border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700",
                "flex items-center px-3 py-2 text-sm"
              )}
              onClick={() => changeCurrentChat(index, chatRoom)}
            >
              <UserLayout user={chatRoom.user} onlineUsersId={onlineUsersId} />
            </div>
          ))
        ) : (
          <p className="ml-2 text-gray-500">No chats available.</p>
        )}
      </li>

      <h2 className="my-2 mb-2 ml-2 text-gray-900 dark:text-white">Other Users</h2>
      <li>
        {Array.isArray(nonContacts) && nonContacts.length > 0 ? (
          nonContacts.map((nonContact, index) => (
            <div
              key={index}
              className="flex items-center px-3 py-2 text-sm bg-white border-b border-gray-200 hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => handleNewChatRoom(nonContact)}
            >
              <UserLayout user={nonContact} onlineUsersId={onlineUsersId} />
            </div>
          ))
        ) : (
          <p className="ml-2 text-gray-500">No other users available.</p>
        )}
      </li>
    </ul>
  );
}

