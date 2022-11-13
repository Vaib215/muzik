import React, { useState } from 'react'
import { useRef } from 'react'

const App = () => {
    const [results, setResults] = useState([])
    const [currSong, setCurrSong] = useState(null)
    const [play, setPlay] = useState(false)
    const [progress, setProgress] = useState(0)
    const vid = useRef(null)
    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            fetch(`http://localhost:5100/result/?query=${e.target.value.split(' ').join('+')}`)
                .then(res => res.json())
                .then(data => setResults(data))
        }
    }
    const changeSong = (e) => {
        setCurrSong(e)
        setTimeout(() => {
            vid.current.play()
            setPlay(true)
            setProgress(0)
        }, 100);
    }
    return (
        <>
            {/* Search box */}
            <input type="text" placeholder="Search" onKeyDown={handleSearch}/>
            {/* Search results */}
            <div className='results'>
                {results.map(result => (
                    <div key={result.id} className='result'>
                        <img src={result.image} alt={result.title} />
                        <h3>{result.song}</h3>
                        <p>{result.duration}</p>
                        <button onClick={() => changeSong(result.media_url)}>Play</button>
                    </div>
                ))}
            </div>
            <video ref={vid} src={currSong} controls onProgress={()=>setProgress((vid.current.currentTime / vid.current.duration) * 100)}/>
            {/* video controls */}
            <div className="video-controls">
                <button onClick={()=>{
                    vid.current.paused ? vid.current.play() : vid.current.pause()
                    setPlay(!play)
                    }} >
                    {
                        play? 'Pause' : 'Play'
                    }
                </button>
                <button>Stop</button>
                <input type="range" onChange={(e)=>{
                    setProgress(e.target.valueAsNumber)
                    vid.current.currentTime = e.target.valueAsNumber * vid.current.duration / 100
                }} value={progress}/>
                <input type="range" />
                <button>Lyrics</button>
            </div>
        </>
    )
}

export default App