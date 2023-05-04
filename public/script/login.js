import '@babel/polyfill';
import { showFail } from './alert';

export const login = async (username, password) => {
  try {
    // Turn of all protecting middle-wares (helmet i helmet@3.23.3) and install polyfill (npm i @babel/polyfill) and parcel-bundler and fuck
    const res = await axios({
      url: 'http://localhost:3000/api/users/login',
      method: 'POST',
      data: { username, password }
    })
    if (res.data.status === 'success') {
      location.assign('/')
    }

  } catch (error) {
    console.log('💥💥💥💥', error)
    showFail('خطأ في الاسم أو كلمة المرور!');
  }
}

export const logout = async () => {
  const res = await axios({
    url: 'http://localhost:3000/api/users/logout',
    method: 'POST',
  })
  if (res.data.status === 'success' || res.status === 200) {
    location.assign('/')
  }
}
