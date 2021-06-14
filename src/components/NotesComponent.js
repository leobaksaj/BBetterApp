import React, {useEffect,useState} from 'react';
import axios from 'axios';
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

function NotesComponent(props){
    let d = localStorage.getItem('data');  
    const [items, setItems] = useState([]);    
    const [items1, setItems1] = useState();    
    const [err, setError] = useState();    
    
    useEffect(() => {
        let d = localStorage.getItem('data');
        axios.get(`/notes/all/${d}`)
        .then(res =>  {                  
            setItems(res.data);             
        });
    },[]);
      
    const [note, setNotes] = useState({
        userId: d,
        noteTitle: "",
        noteContent: "",
        noteArchived: false,
        synced: 0
    })
   
    function submit(e){      
        e.preventDefault();
        axios.post('/notes/new',{
            userId: d,
            noteTitle: note.noteTitle,
            noteContent: note.noteContent,
            noteArchived: false,
            synced: 0
        })
        .then(res =>{
            console.log(res);
            setNotes({
                userId: d,
                noteTitle: "",
                noteContent: "",
                noteArchived: false,
                synced: 0
            })
        }).then(            
            axios.get(`/notes/all/${d}`)
            .then(res =>  {
                setItems(res.data);   
            })
        ).catch(e => {
            setError({
            err: "Something is wrong. Try again!"
        })
        alert(err);
        })
            
    };
    function handle(e){
        const newnote = {...note };
        newnote[e.target.id] = e.target.value;
        setNotes(newnote);
    }
    
    function deleteNotes(id){
        axios.get(`/notes/get/${id}`)
        .then(res =>  {
            setItems1(res.data);   
         })
        axios.put(`/notes/put/${id}`,{
            _id: id,
            userId: d,
            noteTitle:  "qa",
            noteContent:  "qa",
            noteArchived: false,
            synced: 3
        })
        .then(res => {
                console.log(res.data);
                setNotes({
                    userId: d,
                    noteTitle: items1.noteTitle,
                    noteContent: items1.noteContent,
                    noteArchived: false,
                    synced: 3
                })
            }).then(            
                axios.get(`/notes/all/${d}`)
                .then(res =>  {
                    setItems(res.data);   
            }) 
            )           
            .catch((err) => {
                // console.log(err);
            });
    }
   
    function parseDateDDMMYYYY(key){ 
        const date = key;    
        const yyyy = date.substring(0,4);
        const mm = date.substring(5,7);
        const dd = date.substring(8,10);
        const date11 =dd+"."+mm+"."+yyyy;  
        return date11;
    }

    function parseDateYYYYMMDD(key){ 
        var dd = today.getFullYear();
        var mm = today.getMonth()+1;
        var yyyy = today.getDate();
        var mm1 = mm < 10 ? '0'+mm : mm;
        const date =dd+"-"+mm1+"-"+yyyy;      
        return date;
    }
    function submitUpdate(e){      
        e.preventDefault();
        setNotes({
            userId: d,
            noteTitle: "",
            noteContent: "",
            noteArchived: false,
            synced: 3
        });
        updateNote(note);     
    };

    function updateNote(note1){
        axios.put(`/notes/put/${note1._id}`,{
            userId: d,
            noteTitle: note.noteTitle,
            noteContent: note.noteContent,
            noteArchived: false,
            synced: 2
        })
        .then(res => {
            // console.log(res.data);
            setNotes({
                userId: d,
                noteTitle: items.noteTitle,
                noteContent: items.noteContent,
                noteArchived: false,
                synced: 2
            });
            axios.get(`/notes/all/${d}`)
            .then(res =>  {
                setItems(res.data);   
            });
            handleClose();
            })            
            .catch((err) => {
                // console.log(err);
            });
    }

    /************ MODALS ****************** */
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    function handleShow(id){    
        setShow(true);            
        axios.get(`/notes/get/${id}`)
        .then(res =>  {
            setNotes(res.data);                   
         })
    };
    const reload=()=>window.location.reload();

    function handleChange(e){
        const newnote = {...note };
        newnote[e.target.name] = e.target.value;
        setNotes(newnote);
     }

     /********** TAB KONTROLE   ************* */
     const [toggleState, setToggleState] = useState(1);

     const toggleTab = (index) => {
       setToggleState(index);
     };
     var today = new Date();
     const [searchTerm, setSearchTerm] = useState("")
      
    if(props.user){  
             
        return(  
            <>         
            <div className="row mainrow">
             <div className="todo col-md-4">
                <div className="container">
                    <div className="tab">
                        <div className="bloc-tabs">
                        <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"}  onClick={() => toggleTab(1)}>Notes</button>
                        <button className={toggleState === 2 ? "tabs active-tabs" : "tabs"}  onClick={() => toggleTab(2)}>Old Notes</button>
                        </div>
                    </div>
                    <div className="content-tabs">   
                        <div className={toggleState === 1 ? "content  active-content" : "content"}>   
                            <div>
                                <input onChange={event => {setSearchTerm(event.target.value)}} type="text" placeholder="Search..." class="form-control searchNotes"></input>
                            </div>                 
                            <h1>Notes</h1>
                            <div className="container">                 
                                {items.filter((item) => {
                                    if(searchTerm =="" && item.synced !== 3 && item.createdAt.substring(0,10) === parseDateYYYYMMDD(today)){
                                        return item
                                    }else if(item.synced !== 3 && item.noteContent.toLowerCase().includes(searchTerm.toLowerCase()) && item.createdAt.substring(0,10) === parseDateYYYYMMDD(today)
                                                || item.noteTitle.toLowerCase().includes(searchTerm.toLowerCase()) && item.synced !== 3 && item.createdAt.substring(0,10) === parseDateYYYYMMDD(today)
                                                || item.createdAt.substring(0,10).toLowerCase().includes(searchTerm.toLowerCase()) && item.synced !== 3 && item.createdAt.substring(0,10) === parseDateYYYYMMDD(today)
                                            ){
                                                return item 
                                    }
                                    }).map((item) =>                                        
                                     (<><div className="row titlecontentNotes">
                                    <div className="titlenote">
                                        <div className="row buttoninnotes">
                                            <button onClick={() => handleShow(item._id)} className="btn btn-secondary NotesBtn"><FontAwesomeIcon icon={faEdit} /></button> 
                                            <button onClick={() => deleteNotes(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                        <p value={item.noteTitle} id="noteTitle">{item.noteTitle}</p>
                                        {(<span>{parseDateDDMMYYYY(item.createdAt.substring(0,10))}</span>)}
                                        <p>{item.noteContent}</p>
                                    </div>                                
                                </div> </>))}                                                            
                            </div>   
                        </div>

                        <div className={toggleState === 2 ? "content  active-content" : "content"}>     
                            <div>
                                <input onChange={event => {setSearchTerm(event.target.value)}} type="text" placeholder="Search..." class="form-control searchNotes" ></input>
                            </div>                  
                            <h1>Notes</h1>
                            <div className="container">                 
                                {items.filter((item) => {
                                    if(searchTerm =="" && item.synced !== 3 && item.createdAt.substring(0,10) !== parseDateYYYYMMDD(today)){
                                        return item
                                    }else if(item.synced !== 3 && item.noteContent.toLowerCase().includes(searchTerm.toLowerCase())  && item.createdAt.substring(0,10) !== parseDateYYYYMMDD(today)
                                                || item.noteTitle.toLowerCase().includes(searchTerm.toLowerCase()) && item.synced !== 3  && item.createdAt.substring(0,10) !== parseDateYYYYMMDD(today)
                                                || item.createdAt.substring(0,10).toLowerCase().includes(searchTerm.toLowerCase()) && item.synced !== 3  && item.createdAt.substring(0,10) !== parseDateYYYYMMDD(today)
                                                 ){
                                        return item
                                    }
                                    })
                                .sort((a,b) =>b.createdAt.substring(0,10) - a.createdAt.substring(0,10))
                                .map(item => (<><div className="row titlecontentNotes">
                                    <div className="titlenote">
                                        <div className="row buttoninnotes">
                                            <button onClick={() => handleShow(item._id)} className="btn btn-secondary NotesBtn"><FontAwesomeIcon icon={faEdit} /></button> 
                                            <button onClick={() => deleteNotes(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                        <p value={item.noteTitle} id="noteTitle">{item.noteTitle}</p>
                                        {(<span>{parseDateDDMMYYYY(item.createdAt.substring(0,10))}</span>)}
                                        <p>{item.noteContent}</p>
                                    </div>                                
                                </div> </>))}                                                            
                            </div>   
                        </div>
                    </div>


                    </div>
            </div>
                    
                    <div className="todo col-md-7 notes">
                        <h2>Ovdje opišite svoj dan!</h2>
                        <div className="container">
                            <form onSubmit={(e)=> submit(e)}>
                            <div className="form-group">
                                <label className="labelfromnotesadd">Naslov bilješke</label>
                                <input onChange={(e) => handle(e)} value={note.noteTitle} id="noteTitle" type="text" className="form-control" placeholder="Title"></input>
                            </div>   
                                <div className="form-group">
                                    <label className="labelfromnotesadd">Obilježi svoj dan</label>
                                    <textarea onChange={(e) => handle(e)} value={note.noteContent} id="noteContent" className="form-control" type="text"  rows="12" ></textarea>
                                </div><br></br>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="text-right">
                                            <button className="btn btn-primary saveNotesBtn">Spremi bilješku</button>
                                        </div>
                                    </div>      
                                </div>   
                            </form>                 
                        </div>
                    </div>
            </div>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Update note</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>                       
                        <form onSubmit={(e)=> submitUpdate(e)}>
                            <div className="form-group">
                                <label>Naslov bilješke</label>
                                <input onChange={(e) => handleChange(e)} value={note.noteTitle} name="noteTitle" type="text" className="form-control" placeholder="Title"></input>
                                {/* <input onChange={(e) => handleChange(e)} value={note._id}  name="_id" type="text" className="form-control" ></input>
                                <input onChange={(e) => handleChange(e)} value={note.noteArchived}  name="noteArchived" type="boolean" className="form-control" ></input>
                                <input onChange={(e) => handleChange(e)} value={note.synced}  name="synced" type="number" className="form-control" ></input> */}
                            </div>   
                            <div className="form-group">
                                <label>Obilježi svoj dan</label>
                                <textarea onChange={(e) => handleChange(e)} value={note.noteContent} name="noteContent" className="form-control" type="text"  rows="12" ></textarea>
                            </div>                                                           
                            <button className="btn btn-primary updateBtn">Update</button>                               
                        </form>   
                        <button onClick={handleClose} className="btn btn-danger CloseUpdate">Close</button>              
                    </Modal.Body>
                </Modal>
            </>

        )
    }else{
        return(
            <div className="auth-inner">
                <h2> You are not logged in! </h2>
            </div>
            )  
    }     
}; 

export {NotesComponent};



