
let cl = console.log;

const addBtn = document.getElementById('addBtn');
const userData = document.getElementById('userData')
const cardShow_Hide = document.getElementById('cardShow_Hide')
const tableData = document.getElementById('tableData')
const title = document.getElementById('title01')
const boolean = document.getElementById('title02')
const completed = document.getElementById('completed')
const sBtn = document.getElementById('sBtn')
const uBtn = document.getElementById('uBtn')
const mainTable = document.getElementById('mainTable')
const loader = document.getElementById('loader')

const Base_Url = `https://practice-set-e97cf-default-rtdb.firebaseio.com`
const Todo_Url = `${Base_Url}/todos.json`;

const snackBar = ((title , icon)=>{
    Swal.fire({
        title,
        icon:icon,
        timer:1500
    })
})


const loderCircle = ((ele,show)=>{
    show ?  ele.classList.remove('d-none'): ele.classList.add('d-none')
})


const table_Show_Hide = (ele, show)=>{
    show ?  ele.classList.remove('d-none'): ele.classList.add('d-none')
}



const s_Form = () => {
    

    cardShow_Hide.classList.contains('d-none') 
    ? cardShow_Hide.classList.remove('d-none') 
    :cardShow_Hide.classList.add('d-none');
    
};


const submit_update = (ele,show)=>{
   show ? ele.classList.remove('d-none'): ele.classList.add('d-none')
}

const makeApiCall = async (methodName, apiUrl, msgBody) => {
    try {
        loderCircle(loader, true); // Show loader

        let option = {
            method: methodName,
            body: msgBody ? JSON.stringify(msgBody) : null,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "JWT Token From Local Storage"
            }
        };

     let res = await fetch(apiUrl, option);
        return await res.json();
    } catch (error) {
        console.error("API Call Error:", error);
        throw error;
    } finally {
        loderCircle(loader, false); // Hide loader after completion
    }
};


const fetchAllBlog = async () => {

    try {
        let jsonPlaceholderRes = await makeApiCall('GET', Todo_Url);
        let data = objtoarr(jsonPlaceholderRes);
        temp(data);
        
    } catch  {
        // console.error("Error fetching todos:", error);
        snackBar( 'Error fetching todos', 'error')
    }
};


const objtoarr =(obj)=>Object.keys(obj).map(key=>({...obj[key], id: key}));

fetchAllBlog();






const temp = (arr)=>{
    let result = '';

  arr.forEach((add,i)=>{
    result+=`
    
    
                <tr id='${add.id}'>
                  <td>${i+1}</td>
                  <td>${add.title}</td>
                  <td>${add.boolean}</td>
                  <td> <button class="btn btn-primary" onclick="onEdit(this)">Edit</button> </td>
                  <td> <button class="btn btn-danger" onclick="onDelete(this)">Delete</button> </td>
                </tr>
    
    
    `

    
})
tableData.innerHTML = result
}






const createTabledata = (obj, res) => {
    if (!tableData) {
        cl("tableData element not found!");
        return;
    }

    let tr01 = document.createElement('tr');
    tr01.id = res.name
    tr01.innerHTML = `
        <td>${tableData.children.length + 1}</td> 
        <td>${obj.title}</td>
        <td>${obj.boolean}</td>
        <td>
            <button class="btn btn-primary" onclick="onEdit(this)">Edit</button>
        </td>
        <td>
            <button class="btn btn-danger" onclick="onDelete(this)">Delete</button>
        </td>
    `;

    tableData.appendChild(tr01);
};

   


const sendObj = async(eve)=>{
  eve.preventDefault()
 let newObj = 
 {
    title:title.value,
    boolean:boolean.value,
    
}
// table_Show_Hide(mainTable , true)

cardShow_Hide.classList.contains('d-none') ? cardShow_Hide.classList.remove('d-none') :cardShow_Hide.classList.add('d-none');
cl(newObj)

userData.reset();

let res = await makeApiCall('POST', Todo_Url , newObj )
cl(res)
createTabledata(newObj , res)
snackBar('Craeted SuccessFully' , 'success')

} 



const onEdit = async(ele)=>{
    let edit_ID = ele.closest("tr").id;
    cl(edit_ID)

     localStorage.setItem('edit' , edit_ID);
    let get_Url = `${Base_Url}/todos/${edit_ID}.json`;
    cl(get_Url)
    
    let res =await makeApiCall('GET', get_Url )
    title.value = res.title,
    boolean.value = res.boolean

    const scroll = ()=>{
       userData.scrollIntoView({block:'end', behavior:'instant'})
    }
    scroll()
    // cardShow_Hide.classList.contains('d-none') 
    cardShow_Hide.classList.remove('d-none');
    submit_update(sBtn , false); 
    submit_update(uBtn , true); 
    
}


const onUpdate = async ()=>{
 
  let u_ID = localStorage.getItem('edit');
  let u_Url  = `${Base_Url}/todos/${u_ID}.json`;


  let updateObj = 
  {
    
    title:title.value,
    boolean:boolean.value
}
cardShow_Hide.classList.add('d-none');
  userData.reset();

let res = await makeApiCall('PATCH', u_Url , updateObj);
let data = document.getElementById(u_ID).children;
data[1].innerHTML = ` <td>${res.title}</td>`;
data[2].innerHTML = ` <td>${res.boolean}</td>`;
submit_update(sBtn , true); 
submit_update(uBtn , false); 
snackBar('Updated SuccessFully' , 'success')
}





const onDelete = async (ele) => {
    let data = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    });

    if (data.isConfirmed) {
        let del_ID = ele.closest('tr').id;
        cl(del_ID);

        let del_Url = `${Base_Url}/todos/${del_ID}.json`;
        cl(del_Url);

        await makeApiCall('DELETE', del_Url);

        // Remove the row
        ele.closest('tr').remove();
        snackBar('Deleted' , 'success')

        // Check if tableData has any rows left
        if (tableData.children.length === 0) {
            // table_Show_Hide(mainTable, false); // Hide table if no rows left
        }

        // Update serial numbers
        updateSerialNumbers();
    }
};


// Function to update the serial numbers after deletion
const updateSerialNumbers = () => {
    let rows = tableData.querySelectorAll("tr");
    rows.forEach((row, index) => {
        row.children[0].textContent = index + 1; // Updating serial number (first column)
    });
};



userData.addEventListener('submit',sendObj)
addBtn.addEventListener('click', s_Form);
uBtn.addEventListener('click' , onUpdate)








