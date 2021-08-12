import { validate } from "./validation.js";

const inputs = document.querySelectorAll('input');

inputs.forEach(input => {
    input.addEventListener('blur', (event) => {
        if (input.dataset.type === 'price') {
            SimpleMaskMoney.setMask(input, {
                prefix: '$ ',
                fixed: true,
                fractionDigits: 2,
                decimalSeparator: ',',
                thousandsSeparator: '.',
                cursor: 'end'
            })
        }

        validate(event.target);
    })
})
