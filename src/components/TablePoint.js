import axios from 'axios';
import React,{useEffect,useState,useContext,useRef} from 'react';
import moment from 'moment';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Tooltip from "react-simple-tooltip";

function TablePoint(){   
   
return(       
    <div className="col-sm">
    <h3>Bodovi</h3>
    <table className="tablePoints table table-striped">
        <thead>
            <tr>           
            <th scope="col">Naziv</th>
            <th className="th" scope="col-sm-10">Bodovi    </th>
            </tr>
        </thead>
        <tbody>
            <tr>           
            <td>LEVEL 1</td>
            <td>0 - 200</td>                               
            </tr>
            <tr>           
            <td>LEVEL 2</td>
            <td>200 - 400</td>                               
            </tr>
            <tr>          
            <td>LEVEL 3</td>
            <td>400 - 600</td>                                
            </tr>
            <tr>            
            <td>LEVEL 3</td>
            <td>600 - 800</td>                                
            </tr>
        </tbody>
    </table>
</div> 
)
}
export {TablePoint};