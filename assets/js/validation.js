export function validate(input){
    const inputType = input.dataset.type; //birthDate

    if(validators[inputType]){
        validators[inputType](input);
    }
}

const validators = {
    birthDate:input => validateBirthDate(input)
}
/*
dateBirth.addEventListener('blur', (event) => {
    validateBirthDate(event.target);
})
*/
function validateBirthDate(input){
    const dateHandled = new Date(input.value);
    let message = '';
    if(!biggerThan18(dateHandled)){
        message = 'You should has more than 18 years!';
    }

    input.setCustomValidity(message);
}

function biggerThan18(date){
    const dateCurrent = new Date();
    const datePlus18 = new Date(date.getUTCFullYear() + 18, date.getUTCMonth(), date.getUTCDate());

    return datePlus18 <= dateCurrent;
}