//
//
//
// const onMessageRead = (messageId) => {
//   console.log(messageId);
//   Example: Update local state
//   setMessages((prevMessages) =>
//     prevMessages.map((message) =>
//       message._id === messageId ? { ...message, status: "read" } : message
//     )
//   );
//   // Example: Send read receipt to the server
//   fetch("/api/messages/read", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ messageId }),
//   })
//     .then((response) => {
//       if (response.ok) {
//         console.log(`Message ${messageId} marked as read`);
//       }
//     })
//     .catch((error) => {
//       console.error("Error marking message as read:", error);
//     });
// };
// useEffect(() => {
//   // Page Visibility API to detect if the tab is active
//   const handleVisibilityChange = () => {
//     if (document.visibilityState === "visible") {
//       console.log("Page is visible");
//       checkMessagesVisibility();
//     }
//   };

//   document.addEventListener("visibilitychange", handleVisibilityChange);

//   // Intersection Observer to detect if the message box is in view
//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           console.log(entry.isIntersecting);
//           const messageId = entry.target.dataset.id;
//           // console.log(entry.target);
//           // console.log(`Message ${messageId} is in view`);
//           onMessageRead(messageId);
//           observer.unobserve(entry.target); // Stop observing once the message is read
//         }
//       });
//     },
//     { threshold: 1.0 } // Adjust as needed (1.0 means fully visible)
//   );

//   if (containerRef.current) {
//     const messages = containerRef.current.querySelectorAll(".message");
//     messages.forEach((message) => observer.observe(message));
//   }

//   return () => {
//     document.removeEventListener("visibilitychange", handleVisibilityChange);
//     observer.disconnect();
//   };
// }, []);

// const checkMessagesVisibility = () => {
//   const messages = containerRef.current.querySelectorAll(".message");
//   messages.forEach((message) => {
//     const rect = message.getBoundingClientRect();
//     const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
//     if (fullyVisible) {
//       const messageId = message.dataset.id;
//       console.log(`Message ${messageId} is fully visible`);
//       onMessageRead(messageId);
//     }
//   });
// };

//
//
//
