import axios from "axios";

export const sendEmail = async (email) => {
  try {
    await axios.post("http://localhost:3001/api/email/send-invitation", {
      recipientEmail: email,
    });
    console.log("Invitation email sent");
  } catch (error) {
    console.error("Error sending invitation email:", error);
  }
};
