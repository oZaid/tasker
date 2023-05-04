import { showFail, showSucc } from "./alert";

export const sendResetToken = async (email) => {
  try {
    const res = axios({
      method: 'POST',
      url: 'http://localhost:3000/api/users/forgot',
      data: { email }
    })

    if (res.status = 200) {
      showSucc();
    }

  } catch (error) {
    console.log('💥💥💥', error);
    showFail('لم نستطع إيجاد البريد 🧐')
  }
}