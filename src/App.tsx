import KanbanBoard from "./components/KanbanBoard"
import './App.css'

const App = () => {
  return (
    <div>
      <h1
       className=" text-2xl font-semibold text-center mt-10 leading-3"
      >Kanban Board</h1>
      <KanbanBoard/>
    </div>
  )
}

export default App
