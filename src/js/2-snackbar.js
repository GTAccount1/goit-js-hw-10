// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

const refs = {
    form: document.querySelector('.form'),
};

const createPromice = ({ state, delay }) => {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if (state === "fulfilled") {
                    res(`✅ Fulfilled promise in ${delay}ms`)
            }
                else {
                    rej(`❌ Rejected promise in ${delay}ms`)
                }

    }, delay);
});
  
}


refs.form.addEventListener("submit", event => {
    event.preventDefault();
    const state = event.target.elements.state.value;
    const delay = Number(event.target.elements.delay.value);
   
    console.log("state:", state);
    console.log("delay:", delay);
    
    createPromice({state, delay})
        .then(v =>
            iziToast.success({ title: "Done!", message: v, }))
        .catch(err =>
            iziToast.error({ title: "Error!", message: err, })
        );
 
    refs.form.reset();
});

