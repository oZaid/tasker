const success = document.querySelector('.alert--success');
const failed = document.querySelector('.alert--failed');

export const showSucc = () => {
  success.classList.remove('hide');
  setTimeout(() => {
    success.classList.add('hide');
  }, 4500);
}
export const showFail = (msg) => {
  failed.innerHTML = msg;
  failed.classList.remove('hide');
  setTimeout(() => {
    failed.classList.add('hide');
  }, 4500);
}