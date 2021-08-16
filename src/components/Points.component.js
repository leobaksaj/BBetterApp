import axios from 'axios';
import React,{useEffect,useState,useContext,useRef} from 'react';
import moment from 'moment';
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Tooltip from "react-simple-tooltip";
import {TablePoint} from './TablePoint';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

function Points(props){    

    let d = localStorage.getItem('data');  
    useEffect(() => {
        axios.get(`/sessions/all/${d}`)
        .then(res =>  {
            setSessions(res.data);   
        });   
    },[]);

    const [sessions, setSessions] = useState([]); 

    function parseDateYYYYMMDD(key){  //Ne koristim za sada
        const date = key.substring(0,10);    
        const yyyy = date.substring(0,4);
        const mm = date.substring(5,7);
        const dd = date.substring(8,10);
        const date11 = dd +"."+mm+"."+yyyy;
        // console.log(date11);  
        return date11;
    }

    function GetPoint(){
        var number = 0;
        sessions.forEach((item) => { 
            if(item.sessionFinished == true){
            number = number + item.sessionPoints;
            }
        })
        return number - GetNegativePoint();
    }

    function GetNegativePoint(){
        var number = 0;
        sessions.forEach((item) => { 
            if(item.sessionFinished == false){
            number = number + item.sessionPoints;
            }
        })
        return number;
    }

    function Congrats(){
        var div = '';
        if(GetPoint() <= 200 && GetPoint() > 0){
            div += 'Čestitamo sada ste na razini "LEVEL 1"';
        }
        if(GetPoint() <= 400 && GetPoint() > 200){
            div += ' Čestitamo sada ste na razini "LEVEL 2"';
        }
        if(GetPoint() <= 600 && GetPoint() > 400){
            div += ' Čestitamo sada ste na razini "LEVEL 3"';
        }
        if(GetPoint() <= 800 && GetPoint() > 600){
            div += ' Čestitamo sada ste na razini "LEVEL 4"';
        }
        if(GetPoint() <= 1000 && GetPoint() > 800){
            div += ' Čestitamo sada ste na razini "LEVEL 5"';
        }
        if(GetPoint() <= 1200 && GetPoint() > 1400){
            div += ' Čestitamo sada ste na razini "LEVEL 6"';
        }
        if(GetPoint() <= 0){
            div += ' Nema osvojenih bodova!';
        }
        return div;
    }


    if(props.user){  
        return(<> 
        <div className="row mainrowProgress">
            <div className="todo col-md-11 ">
                <div className="PointTooltip">
                        <Tooltip className="Tooltip" background="#373b40" radius="15"  fadeDuration={400} placement="bottom"
                        style={{width:"3rem", height:"3rem"}} content={<TablePoint/>}>                       
                        <circle className="circle"><b>?</b></circle>                    
                        </Tooltip>
                </div><br></br>
                <div className="pointdiv">
                    <div className="row">  
                    <div className="col-sm-1"></div>                          
                        <div className="col-sm-4 step1">                                             
                                <h3>LEVEL 1</h3>
                            <div className="ProgresDiv" style={{ width: 200, height: 200 }}>
                                <CircularProgressbar value={GetPoint()} minValue={0} maxValue={200} 
                                text={GetPoint() >=200 ?  `200`  : `${GetPoint()}`} strokeWidth={15} 
                                 styles={buildStyles({
                                    pathColor: '#000000',
                                    textColor: '#000000',
                                    trailColor: '#fff',
                                    textSize: '30px',
                                })}/>
                            </div>
                        </div>
                        <div className="col-sm-2"></div>   
                        <div className="col-sm-4 step2">                                             
                                <h3>LEVEL 2</h3>
                            <div className="ProgresDiv" style={{ width: 200, height: 200 }}>
                                <CircularProgressbar value={GetPoint()} minValue={0} maxValue={400}
                                text={GetPoint() >=400 ?  `400`  : `${GetPoint()}`} strokeWidth={15} 
                                styles={buildStyles({
                                    pathColor: '#000000',
                                    textColor: '#000000',
                                    trailColor: '#fff',
                                    textSize: '30px',
                                })}/>
                            </div>
                        </div> 
                        <div className="col-sm-1"></div>                     
                    </div> <br></br>
                    <div className="row">  
                        <div className="col-sm-1"></div>                              
                        <div className="col-sm-4 step3">                                             
                                <h3>LEVEL 3</h3>
                            <div className="ProgresDiv" style={{ width: 200, height: 200}}>
                                <CircularProgressbar value={GetPoint()} minValue={0} maxValue={600} 
                                text={GetPoint() >=600 ?  `600`  : `${GetPoint()}`} strokeWidth={15} 
                                styles={buildStyles({
                                    pathColor: '#000000',
                                    textColor: '#000000',
                                    trailColor: '#fff',
                                    textSize: '30px',
                                })}/>
                            </div>
                        </div>
                        <div className="col-sm-2"></div>    
                        <div className="col-sm-4 step4">                                             
                                <h3>LEVEL 4</h3>
                            <div className="ProgresDiv" style={{ width: 200, height: 200 }}>
                                <CircularProgressbar value={GetPoint()} minValue={0} maxValue={800} 
                                text={GetPoint() >=800 ?  `800`  : `${GetPoint()}`} strokeWidth={15} 
                                styles={buildStyles({
                                    pathColor: '#000000',
                                    textColor: '#000000',
                                    trailColor: '#fff',
                                    textSize: '30px',
                                })}/>
                            </div>
                        </div>   
                        <div className="col-sm-1"></div>                    
                    </div> <br></br><br></br>
                    <div className="row">  
                        <div className="col-sm-1"></div>                              
                        <div className="col-sm-4 step3">                                             
                                <h3>LEVEL 5</h3>
                            <div className="ProgresDiv" style={{ width: 200, height: 200}}>
                                <CircularProgressbar value={GetPoint()} minValue={0} maxValue={1000} 
                                text={GetPoint() >=800 ?  `1200`  : `${GetPoint()}`} strokeWidth={15} 
                                styles={buildStyles({
                                    pathColor: '#000000',
                                    textColor: '#000000',
                                    trailColor: '#fff',
                                    textSize: '30px',
                                })}/>
                            </div>
                        </div>
                        <div className="col-sm-2"></div>    
                        <div className="col-sm-4 step4">                                             
                                <h3>LEVEL 6</h3>
                            <div className="ProgresDiv" style={{ width: 200, height: 200 }}>
                                <CircularProgressbar value={GetPoint()} minValue={0} maxValue={1200} 
                                text={GetPoint() >=1000 ?  `1000`  : `${GetPoint()}`} strokeWidth={15} 
                                styles={buildStyles({
                                    pathColor: '#000000',
                                    textColor: '#000000',
                                    trailColor: '#fff',
                                    textSize: '30px',
                                })}/>
                            </div>
                        </div>   
                        <div className="col-sm-1"></div>                    
                    </div> <br></br><br></br>
                  
                </div>                              
            </div>
        </div>      
        </>)
    }else{
        return(
            <div className="auth-inner">
                <h2> You are not logged in! </h2>
            </div>
        )}        

}
export {Points};