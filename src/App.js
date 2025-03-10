import './App.css'
import Jars from "./db"
import SpeechTest from './components/SpeechTest'
import React, { useState } from "react"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const App = () => {

  async function askIncome() {
    var msg = new SpeechSynthesisUtterance();
    msg.text = `What is your weekly income?`;
    await window.speechSynthesis.speak(msg);
  }

  const generateJars = (jar) => {
    return (
      <SpeechTest key={jar.key} dollar={`$` + Math.floor(realIncome * (jar.dollar / 100))} category={jar.category} />
    )
  }

  const [realIncome, changeIncome] = useState("")

  const handleChangeIncome = (e) => {
    changeIncome(e.target.value)
  }

  function validate(evt) {
    var theEvent = evt;
  
    // Handle paste
    if (theEvent.type === 'paste') {
        key = evt.clipboardData.getData('text/plain');
    } else {
    // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  const commands=[
    {
      command: 'reset',
      callback:({resetTranscript}) => resetTranscript()
    },
    {
      command: 'how much do I have left in *',
      callback: (section) => {
        //create new var to store section amount
        for (let i = 0; i < Jars.length; i++) {
          if (section.toUpperCase() == (Jars[i].category).toUpperCase()) {
            var msg = new SpeechSynthesisUtterance();
            msg.text = `${Math.floor(realIncome * (Jars[i].dollar / 100))} dollars`;
            window.speechSynthesis.speak(msg);
          }
        }
      }
    },
    {
      command: 'change background color to *',
      callback:(color) =>{
        document.body.style.background = color;
      }
    },
    {
      command: 'my weekly income is *',
      callback: (i) => {
        console.log(i)
        changeIncome(i)
      }
    }
  ]

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({commands});

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div class="App">
      <img src="TrackioLogo.png" alt="" />
      <div className="income-input">
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={() => {
        askIncome()
        setTimeout(() => {
          SpeechRecognition.startListening()
        }, 2000)
      }}>Income 🔊</button>
      
      <div className="buttons">
      <button onClick={SpeechRecognition.startListening}>▶️</button>
      <button onClick={SpeechRecognition.stopListening}>⏹</button>
      <button onClick={resetTranscript}>🔄</button>
      </div>
      <p>{transcript}</p>
      </div>
      <p className="income">WEEKLY INCOME: $ {realIncome}</p>
      <div className="jar-container">
      {Jars.map(generateJars)}
      </div>
    </div>
  );
};
export default App;
