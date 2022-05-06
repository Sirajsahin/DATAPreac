import { createContext, useState, useEffect } from "react";
import _ from "lodash";

 let pageSize=10;
const DataContext = createContext({});
export const DataProvider =({children}) =>{

  const [data,setData]=useState([])
  const [input,setInput]=useState('')
  const [single,setSingle]=useState([])
  const [error,setError]=useState('')
  const [paginated,setPaginated]=useState([])
  const [currentPage,setCurrentPage]=useState(1)
  const [flage,setFlage]=useState(false)


    const handelClick=(e)=>{
     e.preventDefault();
    if(input.trim()!==''){
      const temp = data.filter(
        (ch) =>
          ch.first_name.toLowerCase().includes(input.toLowerCase()) ||
          ch.last_name.toLowerCase().includes(input.toLowerCase())
        );
        setPaginated(temp)
        if (temp.length === 0){
          setError('Oops! Data not found');
        }
      }
      else{
        alert('please enter a name')
       }  
   
}

useEffect(()=>{ 
  fetch('https://datapeace-storage.s3-us-west-2.amazonaws.com/dummy_data/users.json')
  .then((response)=>response.json())
  .then(data=>{
   setData(data)
   setPaginated(_(data).slice(0).take(pageSize).value())
})
},[])

const pageCount=data?Math.ceil(data.length/pageSize):0;
if(pageCount===1) return null
 const pages=_.range(1,pageCount+1)

const pagination=(page)=>{
setCurrentPage(page);
const index=(page-1)*pageSize;
const paginatedPost=_(data).slice(index).take(pageSize).value();
setPaginated(paginatedPost)
}

const pesrsonDetails=(item)=>{
  setSingle(item)
  setFlage(true)
}
  return (
    <div>
      <DataContext.Provider
      value={{ input,setInput,handelClick,data,paginated,error,pages,currentPage,pagination,pesrsonDetails,single,flage,setFlage }} >
      {children}
    </DataContext.Provider>
    </div>
  )
}

export default DataContext
