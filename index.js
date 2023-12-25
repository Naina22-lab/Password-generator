const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");

const passwordDisplay = document.querySelector("[ data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#Number");
const symbolsCheck = document.querySelector("#Symbol");
const indicators = document.querySelector("[strengthIndicator]");
const generateBtn = document.querySelector(".generate");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()-_+={}[]"/.?:><;|';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();//UI P chnge dikhata h bs itna hi kam h iskaa

//strenght color
    setIndicator("#ccc");

//set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+ "% 100%";
}

function setIndicator(color){
    indicators.style.backgroundColor = color;
    indicators.style.boxShadow =` 0px  0px 12px 1px ${color}`
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}


function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123)); 
}


function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}


function generateSymbol(){
   const randNum =getRndInteger(0, symbols.length);
   return symbols.charAt(randNum);
   
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper)&& (hasNumber || hasSymbol) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

 async function copyContent(){
    try{
    await navigator.clipboard.writeText(passwordDisplay.value)
    copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(Array){
//fisher yates method

for(let i= Array.length-1;i>0;i--){
    const j =Math.floor(Math.random()*(i+1));
    const temp =Array[i];
    Array[i]=Array[j];
    Array[j]=temp;
}
let str ="";
Array.forEach((el) => (str+=el));
return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
        checkCount++;
    });
    //special condition
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener("change" ,handleCheckBoxChange);
})

inputSlider.addEventListener("input",(e)=>{
    passwordLength =e.target.value;
handleSlider();
})

copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener("click",()=>{
    if(checkCount <=0) 
    return;
    if(passwordLength<checkCount){
        passwordLength = checkCount
        handleSlider();
    }
    console.log("starting the journey")
    //remove old password
    password = " "; 

    //lets put the stuff essential by checkboxes
    // if(uppercaseCheck.checkbox){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checkbox){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checkbox){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checkbox){
    //     password += generateSymbol();
    // }

    let funcArr =[];
    if(uppercaseCheck.checked)
    funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
    funcArr.push(generateSymbol);

    //compulsory
    for(let i=0;i<funcArr.length;i++){
        password +=funcArr[i]();
    }

    console.log("compulsory done");
  //remaing
    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randomIndex = getRndInteger(0,funcArr.length);
        password+=funcArr[randomIndex]();
    }

    console.log("remaining done");
    //shuffle
    password=shufflePassword(Array.from(password));
    console.log("shuffling done");
    //show in input
    passwordDisplay.value= password;
    console.log("ui done");
    calcStrength();
});

