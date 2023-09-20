import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
const BASE_URL = 'https://in-mem-todo.onrender.com';


function App() {

  const [todos, setTodos] = useState([]);

  function fetchTodos() {
    let todos = [];
    axios.get(BASE_URL)
    .then((response)=>{
      setTodos(response.data);
      console.log(response.data);
    })
    .catch((error)=>{
      console.error(error);
    })
  
    return todos;
  }

  useEffect(()=>{
      fetchTodos();
      setIsLoading(false);  
  }, [])


  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState({});

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  function handleAdd(payload) {
    axios({url: BASE_URL, method:'POST', data:payload}).then((response) => {
      const newAddedTodo = response.data;
      const newList = [...todos, newAddedTodo];
      setTodos(newList);

      setTitle('');
      setDescription('');
    }).catch((error) => {
      alert("Unable to add todo, please try again");
      return
    })
  }

  function handleEdit(payload) {
    axios.put(BASE_URL+editMode.id, payload)
    .then(() => {
      setIsLoading(true);
      axios.get(BASE_URL).then((response) => {
        setTodos(response.data);
        setIsLoading(false);
      }).catch((error) => {
        console.log(error);
      })
      setEditMode({});
    }).catch((error) => {
      console.log(error);
      alert("Error: " + error.message)
    })
  }

  function submit(event) {
    event.preventDefault();

    console.log(title, description)

    if(title.length==0 || description.length==0) {
      alert("Both todo and description are required!");
      return;
    }

    const payload = {
      title: title,
      description: description
    };

    if(editMode.id) {
      handleEdit(payload);
    }else{
      handleAdd(payload);
    }
  }

  function enterEditMode(e) {
    console.log("Entering edit mode", e.target.id);
    setEditMode({id: e.target.id});

    let currentTodo = {};
    for(let i=0;i<todos.length;i++){
      if(todos[i].id == e.target.id) {
        currentTodo = todos[i];
      }
    }
    setTitle(currentTodo.title);
    setDescription(currentTodo.description);
  }

  function deleteTodo(e){
    console.log("Deleting todo", e.target.id);
    axios.delete(BASE_URL+e.target.id)
    .then((response) => {
      console.log(response.status);
      setTodos(response.data.todos)
    })
    .catch((error) =>{{
      alert("Some error occurred when deleting todo");
      console.log(error.message)
      return
    }})

    console.log("Successfully deleted", todos)
  }

  function TodoList({data}) {
    return (
      data.map((todo)=>(
        <div key={todo.id} style={{display:'flex', marginLeft:'10px', padding:'5px'}}>
          <button className="edit-btn" id={todo.id} onClick={enterEditMode} style={{marginRight:'5px'}}>EDIT</button>  
          <button className="delete-btn" id={todo.id} onClick={deleteTodo} style={{marginRight:'15px'}}>DELETE</button>  
          
          {todo.title} - {todo.description}
        </div>
      
      ))
    );
  }
  
  function cancelEdit(e) {
    setDescription('');
    setTitle('');
    setEditMode({});
  }

  return (
    <div id="AppContainer">
      <div id='InputSection'>
        <h2><b>In Memory Todo</b></h2>
        <div>
          <div className="input-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              required={true}
              onChange={(e) => {setTitle(e.target.value);}}
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              placeholder="Description"
              value={description}
              required={true}
              onChange={(e) => {setDescription(e.target.value);}}
            />
          </div>
          
          <button id="submit-btn" onClick={submit}>SUBMIT</button>
          <button className="cancel-btn" style={{visibility:(editMode.id>0)?'visible':'hidden'}} onClick={cancelEdit} >CANCEL</button>
        </div>
      </div>
      <div className='separator'></div>
      <div id="TodoSection">
        <h1>Added Todos</h1>
        {isLoading ? <div><h2>Loading todos...</h2></div>: null}
        {!isLoading && todos.length == 0 ? <div><h2>No data to show</h2></div>:null}
        {!isLoading && todos.length > 0 ? <TodoList data={todos}></TodoList> : null}
      </div>
    </div>
  )
}


export default App
