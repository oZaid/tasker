import { showFail } from "./alert"

export const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const res = await axios({
      url: `http://localhost:3000/api/users/reset/${token}`,
      method: 'POST',
      data: { password, passwordConfirm }
    })
    if (res.status === 200) {
      location.assign('/login')
    }

  } catch (error) {
    console.log('💥💥💥💥', error)
    showFail('حدث خطأ 💥')
  }
}