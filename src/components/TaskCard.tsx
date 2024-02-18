import { useState } from "react"
import TrashIcon from "../icons/TrashIcon"
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import { Id, Task } from "../types"


type Props = {
   task:Task
    deleteTask: (id:Id) => void
    updateTask:(id:Id,content:string)=>void;
}

const TaskCard = ({task, deleteTask,updateTask}:Props) => {

    const [mouseIsOver,SetMouseIsOver] = useState(false)
    const [editMode,SetEditMode] = useState(false)


    const {setNodeRef,attributes,listeners,transform,transition,isDragging} = useSortable({
        id:task.id,
        data:{
            type:"Task",
            task,
        },
        disabled:editMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style}
            className="
            p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl cursor-grab
    bg-[#94a3b8] relative opacity-50
            ">
            </div>
        )
    }

    const toggleEditMode = ()=>{
        SetEditMode((prev)=>!prev)
        SetMouseIsOver(false)
    }


    if(editMode) {
        return (
            <div ref={setNodeRef} style={style}  {...attributes} {...listeners} className="
    p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl cursor-grab
    bg-[#94a3b8] relative
    " >

      <textarea className="
      h-[90px] w-full resize-none rounded bg-transparent focus:outline-none
      "
            value={task.content}
            autoFocus
            placeholder="Task content here"
            onBlur={toggleEditMode}
            onKeyDown={(e)=>{
                if(e.key == "Enter" && e.shiftKey) toggleEditMode();
            }}
            onChange={(e)=>updateTask(task.id,e.target.value)}
      >
      </textarea>
    </div>
        )
    }

  return (
    <div
    ref={setNodeRef} style={style}  {...attributes} {...listeners}
     onClick={toggleEditMode}  className="
    p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl cursor-grab
    bg-[#94a3b8] relative
    " onMouseEnter={()=>{
        SetMouseIsOver(true);
    }} onMouseLeave={()=>{
        SetMouseIsOver(false)
    }}>

    <p className="
    my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap task
    "
    >
      {task.content}
    </p>
      { mouseIsOver &&
        <button  onClick={()=> deleteTask(task.id)}
         className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-[#475569]
                    hover:text-white rounded opacity-60 hover:opacity-100">
                        <TrashIcon/>
        </button>
      }
    </div>
  )
}

export default TaskCard
