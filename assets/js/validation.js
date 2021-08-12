export function validate(input){
    const inputType = input.dataset.type;

    if(validators[inputType]){
        validators[inputType](input);
    }

    if(input.validity.valid){
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-error-message').innerHTML = '';
    } else {
        input.parentElement.classList.add('input-container--invalido');
        input.parentElement.querySelector('.input-error-message').innerHTML = showErrorMessage(inputType, input);
    }
}

const errorTypes = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
];

const errorMessages = {
    name: {
        valueMissing: 'Field name is empty!'
    },
    email: {
        valueMissing: 'Field email is empty!',
        typeMismatch: 'Email invalid!'
    },
    password: {
        valueMissing: 'Field password is empty!',
        patternMismatch: 'Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters!'
    },
    birthDate: {
        valueMissing: 'Birth date is empty!',
        customError: 'You should has more than 18 years!'
    },
    socialNumber: {
        valueMissing: 'Social number is empty!',
        customError: 'Social number invalid!'
    },
    zipCode: {
        valueMissing: 'Zip code is empty!',
        patternMismatch: 'Zip Code invalid!',
        customError: 'Erro searching zip code!'
    },
    streetAddress: {
        valueMissing: 'Street Address is empty!'
    },
    city: {
        valueMissing: 'City is empty!'
    },
    state: {
        valueMissing: 'State is empty!'
    },
    price: {
        valueMissing: 'Price is empty!'
    }
}

const validators = {
    birthDate:input => validateBirthDate(input),
    socialNumber:input => validateBrazilianSocialNumber(input),
    zipCode:input => retrieveBrazilianZipCode(input)
}

function showErrorMessage(inputType, input){
    let message = '';

    errorTypes.forEach(error => {
        if(input.validity[error]){
            message = errorMessages[inputType][error];
        }
    })

    return message;
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

function validateBrazilianSocialNumber(input){
    const socialNumberHandled = input.value.replace(/\D/g, '');
    let message = '';

    if(!verifyRepeatedBrazilianSocialNumber(socialNumberHandled) || !verifyBrazilianSocialNumber(socialNumberHandled)){
        message = 'Social number invalid!'
    }

    input.setCustomValidity(message);
}

function verifyRepeatedBrazilianSocialNumber(socialNumber){
    const repeatedValues = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ];
    let validSocialNumber = true;

    repeatedValues.forEach(value => {
        if(value == socialNumber){
            validSocialNumber = false;
        }
    })

    return validSocialNumber;
}

function verifyBrazilianSocialNumber(socialNumber){
    const multiplier = 10;

    return verifyLastDigits(socialNumber, multiplier)
}

function verifyLastDigits(socialNumber, multiplier){
    if(multiplier >= 12){
        return true;
    }

    let initialMultiplier = multiplier;
    let sum = 0;
    const socialNumberWithoutDigits = socialNumber.substr(0, multiplier - 1).split('');
    const digitVerifier = socialNumber.charAt(multiplier - 1);
    for(let counter = 0; initialMultiplier > 1; initialMultiplier--){
        sum = sum + socialNumberWithoutDigits[counter] * initialMultiplier;
        counter++;
    }

    if(digitVerifier == verifyDigit(sum)){
        return verifyLastDigits(socialNumber, multiplier + 1);
    }

    return false;
}

function verifyDigit(sum){
    return 11 - (sum % 11);
}

function retrieveBrazilianZipCode(input){
    const zipCodeHandled = input.value.replace(/\D/g,'');
    const url = `https://viacep.com.br/ws/${zipCodeHandled}/json/`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing){
         fetch(url, options).then(
             response => response.json()  
         ).then(
            data => {
                if(data.erro) {
                    input.setCustomValidity('Erro searching zip code!')
                    return;
                }
                input.setCustomValidity('');
                fillFieldsZipCode(data);
                return;
            }            
         )

    }
}

function fillFieldsZipCode(data){
    const streetAddress = document.querySelector('[data-type="streetAddress"]');
    const city = document.querySelector('[data-type="city"]');
    const state = document.querySelector('[data-type="state"]');

    streetAddress.value = data.logradouro;
    city.value = data.localidade;
    state.value = data.uf;
}