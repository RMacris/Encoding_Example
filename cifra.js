let form = document.querySelector('form');
let input = document.getElementById('CipherInput');
let selection = document.getElementById('EncodeTypes');
let radios = document.querySelectorAll('input[type=radio]');
let passoContainer = document.querySelector('label[for=CipherPass]');
let passo = document.getElementById('CipherPass');
let result = document.getElementById('Result');
let button = document.querySelector('input[type=submit]');



form.addEventListener("submit", function(e) {
    e.preventDefault()
    return false;
})
radios.forEach(radio => {
    radio.addEventListener('click', (e) => {
        if(e.target.id == 'encode'){
            button.value = 'Codificar'
        }
        else{
            button.value = 'Decodificar'
        }
    })
})
selection.addEventListener("change",function(e) {
     if( e.target.value == '1' ){
         passoContainer.style.display = 'none';
     }
     else if(e.target.value == '2') {
        passoContainer.style.display = 'flex';
     }
})

input.addEventListener("keyup", function(e) {
    //fomart input on change
    if(input.value.length == 0 || input.value == null) return;
    // se for uma decodificação e for base64, não valdia input
    if(radios[1].checked && selection.value == '1' ) return;
    input.value =  ValidateTextInput(input.value)

})

button.addEventListener("click", function(e){
    //check if necessary information is has been provided
    let text = input.value
    let step = passo.value
    // se for uma decodificação e for base64, valida input
    if(radios[1].checked && selection.value == '1' ) {
        input.value = ValidateTextInput(input.value)
        text = input.value
    }

    if(input.value == null || input.value.length == 0){
        alert("Voce deve inserir um conteudo a ser cifrado.")
        return
    }
    if(!isEncriptionTypeSelected()) return; 
    if(!isRadioSelected()) return; 
    if(!isValidPasso() && selection.value == '2') {
        alert('Voce deve inserir um numero para o passo.')
    }; 
    // if not, return action  
    if(radios[0].checked  && selection.value == '1'){
        //encode && base64
        result.value = encodeBase64(text)
    }
    else if (radios[1].checked && selection.value == '1'){
        //decode && base64
        result.value = decodeBase64(text)
    }
    else if (radios[0].checked && selection.value == '2'){
        //encode && cifra
        result.value = cifra(text, step)   

    }
    else if (radios[1].checked && selection.value == '2'){
        //decode && cifra
        result.value = decifra(text, step)   


    }
})

function encodeBase64(text){
    text = text.toString()
    return btoa(text)
}
function decodeBase64(text){
    text = text.toString()
    return atob(text)
}

function isRadioSelected(){
    if(!radios[0].checked && !radios[1].checked){
        alert('Você deve escolher uma das opções entre encriptação ou desencriptação')
        return false
    }   
    return true
}
function isEncriptionTypeSelected(){
    if(selection.value == '1' || selection.value == '2'){
        return true
    }
    alert('Você deve escolher o tipo de encriptação desejado')
    return false;
}
function containSpecialCharacter (text) {
    let format = /[a-zA-Z0-9 ]/gm
    if(format.test(char)){
        alert('Não é permitido a inserção de characteres especiais.')
    }
}
function ValidateTextInput(char){
    
    let format = /[a-zA-Z0-9 ]{1,}/gm
    let result = ''
    if(!format.test(char)){
        alert('Não é permitido a inserção de characteres especiais.')
        result = char.match(format)
        return result
    }
    result = char.match(format)
    return result[0]
}


function isValidPasso(){
    let format = /[0-9]{1,}/gm
    if(!format.test(`${passo.value}`)){
        return false
    }
    let result = `${passo.value}`.match(format)
    passo.value = result;
    return true
}

function cifra(texto, passo){

    let result = ''
    let currentCode = 0;
    if(typeof parseInt(passo) != 'number') return;
    passo = parseInt(passo);


    for (let i = 0; i < texto.length; i++) {
       if (texto.charCodeAt(i) >= 48 && texto.charCodeAt(i) <= 57){
            passo = passo % 10 

           //ensure the passp in the numbers range
            currentCode = (((texto.charCodeAt(i) % 48) + passo) % 10) + 48;
        }
        else if (texto.charCodeAt(i) >= 65 && texto.charCodeAt(i) <= 90) {
            passo = passo % 26 
            //letras maisculas
            //divide o codigo pelo valor inicial da primeira letra da tabela ascii
            //soma o passo
            //divide por 26 para garantir que o valor não exceda o codigo maximo do alphabeto maiusculo
            //soma o valor resultante ao valor inical deslocando o codigo
            currentCode = (((texto.charCodeAt(i) % 65) + passo) % 26) + 65;
        }
        else if (texto.charCodeAt(i) >= 97 && texto.charCodeAt(i) <= 122) {
            passo = passo % 26 
            //letras minusculas
            currentCode = (((texto.charCodeAt(i) % 97) + passo) % 26) + 97;
        }
        else if (texto.charCodeAt(i) === 32) {
            currentCode = 32;
        }

        result += String.fromCharCode(currentCode);
    }
    return result.toLowerCase();

}

function decifra(texto, passo){
    let result = ''
    let currentCode = 0;
    //garante que o passo não sera maior que a quantidade de characteres do alphabeto 
    if(typeof parseInt(passo) != 'number') return;
    passo = parseInt(passo);

    for (let i = 0; i < texto.length; i++) {
        if (texto.charCodeAt(i) >= 48 && texto.charCodeAt(i) <= 57){
            passo = passo % 10 
            //ensure the passp in the numbers range
            currentCode = (Math.abs((texto.charCodeAt(i) % 48) - passo) % 26) + 48;
         }
         else if (texto.charCodeAt(i) >= 65 && texto.charCodeAt(i) <= 90) {
            passo = passo % 26 
            //letras maisculas
            //divide o codigo pelo valor inicial da primeira letra da tabela ascii
            //soma o passo
            //divide por 26 para garantir que o valor não exceda o codigo maximo do alphabeto maiusculo
            //soma o valor resultante ao valor inical deslocando o codigo
            currentCode = (Math.abs((texto.charCodeAt(i) % 65) - passo) % 26) + 65;
         }
        else if (texto.charCodeAt(i) >= 97 && texto.charCodeAt(i) <= 122) {
            passo = passo % 26 
            //letras minusculas
            currentCode = (Math.abs((texto.charCodeAt(i) % 97) - passo) % 26) + 97;
        }
        else if (texto.charCodeAt(i) === 32) {
            currentCode = 32;
        }
        
        result += String.fromCharCode(currentCode);
    }
    return result.toLowerCase();
}

