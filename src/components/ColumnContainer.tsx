import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities'
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../types"
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
    column: Column;
    deleteColumn: (id:Id) => void;
    updateColumn: (id:Id,title:string) => void;
    createTask : (columnId:Id) => void
    tasks: Task[]
    deleteTask: (id:Id)=>void;
    updateTask:(id:Id,content:string)=>void;
}

const ColumnContainer = (props: Props) => {

    
    const { column,deleteColumn, updateColumn, createTask, tasks, deleteTask , updateTask} = props;
    const [editMode, SetEditMode] = useState(false)
    const tasksIds = useMemo(()=>{
        return tasks.map((task)=> task.id);
    }, [tasks])

    const {setNodeRef,attributes,listeners,transform,transition,isDragging} = useSortable({
        id:column.id,
        data:{
            type:"Column",
            column
        },
        disabled:editMode
    })


    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if(isDragging) {
        return (
        <div ref={setNodeRef} style={style} className="
        w-[350px]
        h-[500px]
        rounded-lg
        opacity-40
        flex
        flex-col
        bg-[#e2e8f0]
        border-[#475569]
        border-2
        "></div>
        );
    }

    return (
        <div
        ref={setNodeRef}
        style={style}
         className="
    w-[350px]
    h-[500px]
    rounded-lg
    flex
    flex-col
    bg-[#e2e8f0]
    ">
            <div
            {...attributes}
            {...listeners}
            onClick={()=>{
                SetEditMode(true);
            }}
            className="
        text-md
        h-[50px]
        cursor-grab
        rounded-md
        p-3
        font-medium
        bg-[#cbd5e1]
        border-[#cbd5e1]
        border-2
        flex
        items-center
        justify-between
        ">
                <div className="flex gap-2">
                    <div className="
                        flex
                        justify-center
                        items-center
                        px-2
                        py-0.5
                        text-sm
                        bg-[#94a3b8]
                        rounded-full
                    ">{tasks.length}</div>
                   {!editMode && column.title}
                   {editMode && 
                   <input autoFocus
                   className="
                   bg-[#e2e8f0] focus:border-rose-500 rounded outline-none px-2
                   "
                   value={column.title}
                   onChange={(e)=>{
                    updateColumn(column.id, e.target.value)
                   }}
                    onBlur={()=>{
                    SetEditMode(false);
                   }}
                    onKeyDown={(e)=>{
                        if (e.key != "Enter") return;
                        SetEditMode(false)
                    }}
                   />}
                
                </div>
                    <button onClick={()=>{
                        deleteColumn(column.id)
                    }} className="
                    rounded
                    p-2
                    hover:bg-[#475569]
                    hover:text-white
                    "><TrashIcon /></button>
            </div>


            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={tasksIds}>
                {
                    tasks.map((task)=>(
                        <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
                    ))
                }
                </SortableContext>
            </div>

            <button className="
            flex gap-2 items-center 
             rounded-md p-4 m-1
            h-10
            border-[#cbd5e1]
            hover:bg-[#cbd5e1]
            hover:text-black-500
            active:bg-[#94a3b8]"
            onClick={()=>{
                createTask(column.id);
            }}
            ><PlusIcon/> Add Task</button>
        </div>
    )
}

export default ColumnContainer
