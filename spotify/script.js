console.log('lets write some Javascript!');

document.title = "Kings music"
let currentsong=new Audio()
let songs;
let currfolder;

async function getsongs(folder) {
    let a = await fetch(`http://127.0.0.1:5501/${folder}/`)
   currfolder = folder;
    let response = await a.text()
  
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
     songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }   
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {

        songul.innerHTML = songul.innerHTML + `<li><img class="invert"src ="my images/music.svg" alt="">
                                       <div class="info">
                                           <div>${song.replaceAll("%20"," ")}</div>    
                                           <div>Prathamt</div>
                                       </div>
                                       <div class="playnow">
                                        <span>Play Now</span>
                                        <img class="invert" src="my images/play.svg" alt="">
                                       </div> </li>`
    }
    //Attach an eventlilstner to every song+
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
                        
        })
    })
}
const playmusic =(track,pause=false ) => {
   currentsong.src= `${currfolder}/` + track
   if(!pause){

       currentsong.play()
       play.src="my images/pause.svg"
   }
   document.querySelector(".songinfo").innerHTML=decodeURI(track)
   document.querySelector(".songtime").innerHTML="00:00 / 00:00 "
}

function formatTime(durationInSeconds) {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);

    const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;
    if (isNaN(seconds) || seconds <0){
        return "00:00";
    }
    return formattedTime;
}

function padZero(value) {
    return value < 10 ? `0${value}` : value;
}
async function displayalbum(){
    let a = await fetch(`http://127.0.0.1:5501/songs/`)
   
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML= response;
    console.log(response)
    let anchors = div.getElementsByTagName("a")
    let array =  Array.from(anchors)
    cardcontainer = document.querySelector(".cardcontainer")
     for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
     
       if(e.href.includes("/songs")){
           let folder = e.href.split("/").slice(-2)[0]
           let a = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`)
           let response = await a.json();
           
            console.log(response)
            cardcontainer.innerHTML=cardcontainer.innerHTML  + ` <div data-folder=:"${folder}" class="card bg-grey ">
            <div class="play">

                <svg xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24"
                    fill="none">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="#000000" stroke-width="1.5"
                        stroke-linejoin="round" >
                </svg>
            </div>
            <img
                src="/songs/${folder}/cover.jpg" 
                alt="" >

            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
    
        }
}

}

async function main(){

    //get the list of songs 
     await getsongs("songs/ncs");
     playmusic(songs[0],true);

     
    
   //displaying dynamic albums
     displayalbum();
  //adding mute option to volume
   
        document.querySelector(".volume>img").addEventListener("click",e=>{
         console.log(e.target);
         console.log("changing ",e.target.src);
         if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentsong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
      
         }
         else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentsong.volume= .10
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
         
         
     })


    // Attach an eventlistner to previous , play and next 
    play.addEventListener("click",() => {
    if (currentsong.paused){
       
         currentsong.play()
         play.src="my images/pause.svg"
    }
    else{
        currentsong.pause()
        play.src="my images/play.svg"
    }
   });
   // Updating time
   currentsong.addEventListener("timeupdate",() => {
       console.log(currentsong.currentTime,currentsong.duration);
       document.querySelector(".songtime").innerHTML= `${padZero(currentsong.currentTime),formatTime(currentsong.currentTime)} / 
       ${padZero(currentsong.duration),formatTime(currentsong.duration)}`
       document.querySelector(".circle").style.left=(currentsong.currentTime / currentsong.duration) *100 + "%" 
    });
    // adding eventlistner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent=(e.offsetX/e.target.getBoundingClientRect().width) *100
        document.querySelector(".circle").style.left= percent + "%";// gives information about pointer
        currentsong.currentTime = ((currentsong.duration)* percent)/100
    });
    
    // 
    // Adding event listner for hamburger menue
    document.querySelector(".hamburger").addEventListener("click",() => {
      document.querySelector(".left").style.left='0'
      document.querySelector(".playbar").style.display="none"
      
    }); 
    document.querySelector(".close").addEventListener("click",() => {
        document.querySelector(".left").style.left='-120%'
        document.querySelector(".playbar").style.display="block"
    });
    //adding evendlistner to previous 
    previous.addEventListener("click",() => {
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index-1) >= 0){
            playmusic(songs[index-1])
        }
       
    });
    next.addEventListener("click",() => {
        console.log("next clicked")
        currentsong.pause()
       let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
       
     if ((index+1) < songs.length){
         console.log(currentsong.src)
         playmusic(songs[index+1])
     }
    
     });
 
     //adding an event to volume
     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=> {
       console.log(e.target,e.target.value);
       currentsong.volume=parseInt(e.target.value)/100
       
     });

     //loading the library
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        })
     })
     
     
    
 }

main()                                                               