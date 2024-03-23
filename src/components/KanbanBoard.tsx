import { useMemo, useState } from "react"
import PlusIcon from "../icons/PlusIcon"
import { Column, Id, Task } from "../types"
import ColumnContainer from "./ColumnContainer"
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import TaskCard from "./TaskCard"


const defaultCols: Column[] = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Work in progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "todo",
    content: "List admin APIs for dashboard",
  },
  {
    id: "2",
    columnId: "todo",
    content:
      "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
  },
  {
    id: "3",
    columnId: "doing",
    content: "Conduct security testing",
  },
  {
    id: "4",
    columnId: "doing",
    content: "Analyze competitors",
  },
  {
    id: "5",
    columnId: "done",
    content: "Create UI kit documentation",
  },
  {
    id: "6",
    columnId: "done",
    content: "Dev meeting",
  },
  {
    id: "7",
    columnId: "done",
    content: "Deliver dashboard prototype",
  },
  {
    id: "8",
    columnId: "todo",
    content: "Optimize application performance",
  },
  {
    id: "9",
    columnId: "todo",
    content: "Implement data validation",
  },
  {
    id: "10",
    columnId: "todo",
    content: "Design database schema",
  },
  {
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates into workflow",
  },
  {
    id: "12",
    columnId: "doing",
    content: "Implement error logging and monitoring",
  },
  {
    id: "13",
    columnId: "doing",
    content: "Design and implement responsive UI",
  },
];

const KanbanBoard = () => {

  const [columns,SetColumns] = useState<Column[]>(defaultCols)
  const columnsId = useMemo(()=> columns.map((col)=>col.id),[columns])
  const [activeColumn,SetActiveColumn]= useState<Column | null>(null)
  const [tasks, SetTasks] = useState<Task[]>(defaultTasks)
  const [activeTask,SetActiveTask] = useState<Task | null>(null)  

  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance:10
    }
    })
  )


  const createNewColumn =() =>{
    const columnToAdd: Column = {
      id:generateId(),
      title: `Column ${columns.length +1}`
    };

    SetColumns([...columns, columnToAdd])
}

const updateColumn = (id:Id,title:string)=>{
  const newColumns = columns.map((col)=>{
    if (col.id !== id) return col;
    return {...col, title}
  }) 

  SetColumns(newColumns);
}
const deleteColumn = (id:Id)=>{
  const filteredColumns = columns.filter((col)=>col.id !== id)
  SetColumns(filteredColumns);

  const newTasks = tasks.filter(t=>t.columnId !== id);
  SetTasks(newTasks)
}

const createTask = (columnId:Id)=>{
    const newTask:Task = {
      id:generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    }

    SetTasks([...tasks,newTask])
}

const deleteTask = (id:Id) => {
  const newTasks = tasks.filter((task)=> task.id !== id);
  SetTasks(newTasks);
}

const updateTask = (id:Id,content:string)=>{
  const newTasks = tasks.map(task=>{
    if(task.id !== id) return task;
    return {...task, content}
  })
  SetTasks(newTasks);
}

const generateId = ()=>{
  return Math.floor(Math.random() * 1000)
}

  
const onDragStart = (event:DragStartEvent)=>{
  // console.log("drag start",event);
  if (event.active.data.current?.type === "Column") {
    SetActiveColumn(event.active.data.current.column)
    return;
  }

  if (event.active.data.current?.type === "Task") {
    SetActiveTask(event.active.data.current.task)
    return;
  }
  
}

const onDragOver = (event:DragOverEvent) => {
  const {active, over} = event;

  if(!over) return;

  const activeId = active.id;
  const overId = over.id;

  if (activeId === overId) return;

  const isActiveATask = active.data.current?.type === "Task";
  const isOverATask = over.data.current?.type === "Task"; 


  if(!isActiveATask) return;

  if (isActiveATask && isOverATask) {
    SetTasks(tasks => { 
      const activeIndex =  tasks.findIndex(t => t.id === activeId)
      const overIndex =  tasks.findIndex(t => t.id === overId)
      
      if (tasks[activeIndex].columnId != tasks[overIndex].columnId){
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
      }


      return arrayMove(tasks, activeIndex, overIndex)
    })
  }

  const isOverAColumn = over.data.current?.type === "Column";

  if(isActiveATask && isOverAColumn) {
    SetTasks(tasks => { 
      const activeIndex =  tasks.findIndex(t => t.id === activeId)
      
      tasks[activeIndex].columnId = overId;


      return arrayMove(tasks, activeIndex, activeIndex)
    })
  }


}

const onDragEnd = (event:DragEndEvent) => {
  SetActiveColumn(null);
  SetActiveTask(null)

  const {active, over} = event;

  if(!over) return;

  const activeId = active.id;
  const overId = over.id;

  if (activeId === overId) return;

  const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

  SetColumns((columns) =>{
    const activeColumnIndex = columns.findIndex(
      (col)=>col.id === activeId
    )

    const overColumnIndex = columns.findIndex(
      (col)=> col.id === overId
    )

    return arrayMove(columns, activeColumnIndex,overColumnIndex);
  })
}

  return (
    <div 
    className="
    m-[auto]
    flex
    min-h-screen
    w-full
    justify-center
    overflow-x-auto
    overflow-y-hidden
    px-[40]
    "
    >
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>  
      <div className="m-auto flex gap-4 w-[90%]">
      <div className="flex gap-4">
        <SortableContext items={columnsId}>
        {
          columns.map(col => (
            <ColumnContainer
             createTask={createTask}
             key={col.id}
             column={col} 
             deleteColumn={deleteColumn} 
             updateColumn={updateColumn}
             deleteTask={deleteTask}
             updateTask={updateTask}
             tasks = {tasks.filter((task)=>task.columnId === col.id)}
            />))
        }
        </SortableContext>
      </div>
      <button onClick={()=>{createNewColumn()}} className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-[#f1f5f9]
      p-4
      border-2
      text-[black]
      font-[600]
      flex
      gap-2 
      "
      ><PlusIcon/> Add Column</button>
      </div>

        {createPortal(
      <DragOverlay>
        {activeColumn && (
          <ColumnContainer
              column={activeColumn}
              deleteTask={deleteTask}
              deleteColumn={deleteColumn}
              updateColumn={updateColumn}
              createTask={createTask}
              updateTask={updateTask}
              tasks = {tasks.filter((task)=> task.columnId === activeColumn.id)}
              />
              )}
              {
                activeTask && <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask}/>
              }
      </DragOverlay>,document.body
        )}
      </DndContext>
    </div>
  )

 
}

export default KanbanBoard
