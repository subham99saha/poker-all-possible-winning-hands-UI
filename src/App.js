import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Blur from 'react-css-blur'
import './App.css'

function App() {
  const table = [[2,"C"],[7,"H"],[3,"C"],[12,"C"],[13,"D"]]
  const ownHand = [[7,"C"],[13,"C"]]
  const match_values = {
    value: {
      1: "Ace", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 10: "10", 11: "Jack", 12: "Queen", 13: "King", 14: "Ace" 
    },
    suit: {
      'S': 'Spades',
      'H': 'Hearts',
      'C': 'Clubs',
      'D': 'Diamonds',
    }
  }

  const [winningHands, setWinningHands] = useState({})
  const [tableMatch, setTableMatch] = useState({})
  const [handMatch, setHandMatch] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const getWinningHands = () => {
    setIsLoading(true)
    const url = 'http://localhost:4000/'
    const urlString = 'hands/winningHands'
    Axios.post(url + urlString, {
      table 
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      // if (res.data.success === true) {
      //   // setIsLoading(false)
      // } else {
      //   // setIsLoading(false)
      // }
      setWinningHands(res.data.hands)
      handleTableMatch(res.data.hands)
      handleHandMatch(res.data.hands)
      setIsLoading(false)
    }).catch((error) => {
      console.log(error);
      setIsLoading(false)
    })
  }

  const handleTableMatch = (wHands) => {
    let match = {}
    Object.keys(wHands).map((type, index) => {
      wHands[type].map(hand => {
        let hash = {}
        for(var i = 0; i < table.length; i++) {
            hash[table[i]] = i;
        }
        if (hash.hasOwnProperty(hand[0]) || hash.hasOwnProperty(hand[1])) {
          type = type.split(' ').join('_')          
          if (match.hasOwnProperty(type)) { 
           match[type].push(hand) 
          } else { 
           match[type] = [hand] 
          }
        }
      })
    })
    setTableMatch(match)
  }
  const handleHandMatch = (wHands) => {
    let match = {}
    Object.keys(wHands).map((type, index) => {
      wHands[type].map(hand => {
        let hash = {}
        for(var i = 0; i < ownHand.length; i++) {
            hash[ownHand[i]] = i;
        }
        if (hash.hasOwnProperty(hand[0]) && hash.hasOwnProperty(hand[1])) {
          type = type.split(' ').join('_')          
          if (match.hasOwnProperty(type)) { 
           match[type].push(hand) 
          } else { 
           match[type] = [hand] 
          }
        }
      })
    })
    setHandMatch(match)
  }
  
  return (
    <Blur radius={isLoading ? '5px' : '0'} transition="400ms">
    <div className="px-5 bg-success">
      <div className="row text-light">
        <div className="col-md-6" style={{minHeight: "1000px", textAlign: "center"}}>
          <div className="mt-5">
            <h3>Table</h3>
            <div className="row m-5 bg-success p-2 justify-content-center" style={{border: "5px solid white", borderRadius: "50px"}}>
              {table.map(cards => {              
                return <div className="col-2"><card-t rank={match_values.value[cards[0]]} suit={match_values.suit[cards[1]]}></card-t></div>
              })}
            </div>
            <button className="btn btn-outline-light" onClick={() => getWinningHands()}><b>Check winning hands</b></button>
          </div>
          <div className="mt-5">
            <h3>Your hand</h3>
            <div className="row m-5 bg-success p-2 justify-content-center">
              {ownHand.map(cards => {              
                return <div className="col-2"><card-t rank={match_values.value[cards[0]]} suit={match_values.suit[cards[1]]}></card-t></div>
              })}
            </div>
          </div>
          
          { Object.keys(tableMatch).length ? 
          <div className="mt-5">
            {Object.keys(tableMatch).map(type => {
              return <p><b>{type.split('_').join(' ')}:</b> {tableMatch[type].length} probables match the table.</p>
            })}
          
          </div>
           : '' }

          { Object.keys(handMatch).length ? 
          <div className="mt-5">
            {Object.keys(handMatch).map(type => {
              return <p><b>{type.split('_').join(' ')}:</b> {handMatch[type].length} probables match your hand.</p>
            })}
          
          </div>
           : '' }
          
        </div>
        <div className="col-md-6" style={{textAlign: "center"}}>
          <div className="mt-5">
            <h3>All possible winning hands</h3>
            <div className="mt-4 mx-3" style={{border: "5px solid white", borderRadius: "50px"}}>          
            { Object.keys(winningHands).length ? Object.keys(winningHands).reverse().map((type, index) => {
              return <div className="m-4">
              <button className="btn btn-outline-light mb-2" type="button" data-bs-toggle="collapse" data-bs-target={'#hand'+index} aria-expanded="false" aria-controls="collapseExample">
                <b>{type} ({winningHands[type].length})</b>
              </button>
              <div className="row justify-content-center collapse overflow-auto" id={'hand'+index} style={{maxHeight: "500px"}}>
              {winningHands[type].map(hand => {
                let rank = [0,0], suit = ['',''], border = "3px solid #006600"
                let tableHash = {}, ownHandHash = {};
                for(var i = 0; i < table.length; i++) {
                    tableHash[table[i]] = i;
                }
                for(var i = 0; i < ownHand.length; i++) {
                    ownHandHash[ownHand[i]] = i;
                }
                if (hand[0].length === 2) {
                  rank[0] = match_values.value[hand[0][0]]
                  suit[0] = match_values.suit[hand[0][1]]
                  if (tableHash.hasOwnProperty(hand[0])) { border = "4px solid orange" }
                  {/*if (ownHandHash.hasOwnProperty(hand[0])) { border = "4px solid #00ff00" }*/}
                }
                if (hand[1].length === 2) {
                  rank[1] = match_values.value[hand[1][0]]
                  suit[1] = match_values.suit[hand[1][1]]
                  if (tableHash.hasOwnProperty(hand[1])) { border = "4px solid orange" }
                  {/*if (ownHandHash.hasOwnProperty(hand[1])) { border = "4px solid #00ff00" }*/}
                }
                if (ownHandHash.hasOwnProperty(hand[0]) && ownHandHash.hasOwnProperty(hand[1])) { border = "4px solid #00ff00" }                
                
                return <div className="col-3 bg-success m-1 p-2" style={{border: border, borderRadius: "10px"}}><div className="row">
                  <div className="col-6"><card-t rank={rank[0]} suit={suit[0]} backcolor="red" backtext=" "></card-t></div>
                  <div className="col-6"><card-t rank={rank[1]} suit={suit[1]} backcolor="red" backtext=" "></card-t></div>
                </div></div>
              })}
              </div>
              </div>

            }) : 
              <div className="text-white m-5">
                <p><i>Set the table and your hand with appropriate cards to determine all probable winning hands.</i></p>
              </div>
            }
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 ">
          <div className="container">
            <footer className="py-3 my-4">
              <ul className="nav justify-content-center border-bottom pb-3 mb-3">
                <li className="nav-item"><a href="#" className="nav-link px-2 text-white">Home</a></li>
                <li className="nav-item"><a href="#" className="nav-link px-2 text-white">Features</a></li>
                <li className="nav-item"><a href="#" className="nav-link px-2 text-white">Pricing</a></li>
                <li className="nav-item"><a href="#" className="nav-link px-2 text-white">FAQs</a></li>
                <li className="nav-item"><a href="#" className="nav-link px-2 text-white">About</a></li>
              </ul>
              <p className="text-center text-white">&copy; 2022 Company, Inc</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
    </Blur> 
  );
}

export default App;
