import '@babel/polyfill';
import { showFail } from './alert';

export const signup = async (username, email, password, passwordConfirm) => {
  try {
    if (password !== passwordConfirm || password === '') return showFail('كلمتي السر غير متطابقة!')
    // Turn of all protecting middle-wares (helmet i helmet@3.23.3) and install polyfill (npm i @babel/polyfill) and parcel-bundler and fuck
    const res = await axios({
      url: 'http://localhost:3000/api/users/signup',
      method: 'POST',
      data: { username, email, password, passwordConfirm }
    })
    console.log(res);
    if (res.data.status === 'success') {
      location.assign('/')
    }

  } catch (error) {
    const msg = error.response.data.message;
    showFail(msg);
  }
}
