import React, {useEffect,useState} from 'react';
import axios from 'axios';
import {Button} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
// import Modal from './src/components/ModalEditNotes.js';

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

        }).catch(e => {
            setError({
            err: "Something is wrong. Try again!"
        })
        alert(err.err);
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
            // console.log(items1.noteTitle);
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
                let d = localStorage.getItem('data');
                axios.get(`/notes/all/${d}`)
                .then(res =>  {
                    setItems(res.data);   
                });
            })            
            .catch((err) => {
                console.log(err);
            });
    }
   
    function updateNote(id){
        console.log(id);

        // axios.get(`/notes/get/${id}`)
        // .then(res =>  {
        //     setItems1(res.data);   
        //     console.log(items1.noteTitle);
        //  })
        // axios.put(`/notes/put/${id}`,{
        //     userId: d,
        //     noteTitle: note.noteTitle,
        //     noteContent: note.noteContent,
        //     noteArchived: false,
        //     synced: 0
        // })
        // .then(res => {
        //         console.log(res.data);
        //         setNotes({
        //             userId: d,
        //             noteTitle: items1.noteTitle,
        //             noteContent: items1.noteContent,
        //             noteArchived: false,
        //             synced: 0
        //         })
        //         let d = localStorage.getItem('data');
        //         axios.get(`/notes/all/${d}`)
        //         .then(res =>  {
        //             setItems(res.data);   
        //         });
        //     })            
        //     .catch((err) => {
        //         console.log(err);
        //     });
    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    function handleShow(id){
        setShow(true);
        console.log(id);
        axios.get(`/notes/get/${id}`)
        .then(res =>  {
            setItems1(res.data);   
             console.log(items1.noteTitle);
         });


    };
    const reload=()=>window.location.reload();

    function handleChange(e){
        const newnote = {...note };
        newnote[e.target.name] = e.target.value;
        //setNotes(newnote);
     }

    
    if(props.user){  
             
        return(  
            <>         
            <div className="row mainrow">
                    <div className="todo col-md-3">
                        <h1>Notes</h1>
                        <div className="container">                 
                            {items.filter(item => item.synced !== 3).map(item => (<><div className="row titlecontentNotes">
                                <div className="titlenote">
                                    <div className="row buttoninnotes">
                                        <button onClick={() => handleShow(item._id)} className="btn btn-secondary NotesBtn"><FontAwesomeIcon icon={faEdit} /></button> 
                                        <button onClick={() => deleteNotes(item._id)} className="btn btn-danger NotesBtn"><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                    <p value={item.noteTitle} id="noteTitle">{item.noteTitle}</p>
                                    {(<span>{item.createdAt.substring(0,10)}</span>)}
                                </div>                                
                            </div> </>))}                                                            
                        </div>   
                    </div>
                    <div className="todo col-md-8 notes">
                        <h3>Ovdje opišite svoj dan!</h3>
                        <div className="container">
                            <form onSubmit={(e)=> submit(e)}>
                            <div className="form-group">
                                <label>Naslov bilješke</label>
                                <input onChange={(e) => handle(e)} value={note.noteTitle} id="noteTitle" type="text" className="form-control" placeholder="Title"></input>
                            </div>   
                                <div className="form-group">
                                    <label>Obilježi svoj dan</label>
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
                <Modal show={show} onHide={handleClose} onExit={reload}>
                    <Modal.Header closeButton>
                    <Modal.Title>Update note</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>                       
                        <form>
                            <div className="form-group">
                                <label>Naslov bilješke</label>
                                <input onChange={(e) => handle(e)} value={note.noteTitle} id="noteTitle" type="text" className="form-control" placeholder="Title"></input>
                            </div>   
                            <div className="form-group">
                                <label>Obilježi svoj dan</label>
                                <textarea onChange={(e) => handle(e)} value={note.noteContent} id="noteContent" className="form-control" type="text"  rows="12" ></textarea>
                            </div>                                
                        </form>                 
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
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



