import React, { useState } from 'react'
import "./index.css"
import cloud from "../src/image/Cloud.png";
import rain from "../src/image/Rain.png";
import clear from "../src/image/Clear.png";
import mist from "../src/image/mist.png";
import err from "../src/image/error.png";





const Weather = () => {
  const [search, setSearch] = useState("");
  const [ data, setData] = useState();
  const [error, setError] = useState();
  const  API_KEY = "d0a0947c75bf2a6d1c56a35c207a6664"
  // const API ="https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}"

  const handleInput = (event) =>{
    setSearch(event.target.value)
    console.log(event.target.value);
    

  }

  const myFun = async() =>{
    const get = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric`);
    const jsonData = await get.json()
    console.log(jsonData);
    setData(jsonData);

    if(search === ""){
      alert("Enter City name to check weather ");
      setError("Please Enter City, Country Name")
    }
    else if(jsonData.cod === '404'){
      setError("Please Enter Valid Name")
    }
    else{
      setError("")
    }
    setSearch("")
    
  }
  
  return (
    <>
    <div className="bigcontainer">
    
       
  <div className="container">
    <div className="inputs">
      <input  placeholder='Enter city, Country' value={search} onChange={handleInput} />
      <button onClick={myFun}><i className="fa-sharp fa-solid fa-magnifying-glass"></i></button>
    </div>
    <div>
      {
        error ? 
        <div className='errorPage'>
          <p>{error}</p>
          <img src={err} alt='errorImg' />
        </div> : ""
      }
      {
        data && data.weather ? 
        <div className='weathers'>
          <h2 className='cityName'>{data.name}</h2>
          <img src={data.weather[0].main === "Clouds" ? cloud : "" } alt=''/>
          <img src={data.weather[0].main === "Rain" ? rain : "" } alt=''/>
          <img src={data.weather[0].main === "Clear" ? clear : "" } alt=''/>
          <img src={data.weather[0].main === "Mist" ? mist : "" } alt=''/>
          <img src={data.weather[0].main === "Haze" ? cloud : "" } alt=''/>
          <h2 className='tamperature'>{Math.trunc(data.main.temp)} °C</h2>
          <h2 className='climate'>{data.weather[0].description}</h2>
        </div> : ""
      }
    </div>
  </div>
  </div>
    
    </>
  )
}

export default Weather;
