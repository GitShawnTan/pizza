async function Addtocart(id){
    const result = await axios.post("/api/cart",{id:id,quantity:1});
    
   document.querySelector('#cartcount').innerHTML=result.data.cartcount


}


async function Customize(){
    let customizations =[]
    let checkboxes = document.querySelectorAll("input")
        for(let i = 0; i < checkboxes.length; i++ ){
            if(checkboxes[i].checked){
                customizations.push(checkboxes[i].value);
            }
        }
    const result = await axios.post("/api/cart",{id:0,quantity:1,customizations:customizations});
    document.querySelector('#cartcount').innerHTML=result.data.cartcount
}

async function Update(id, btn){
    let Input = btn.parentNode.previousSibling.firstChild.value
    const result = await axios.put("/api/cart/"+id,{id:id,quantity:Input});     
    document.querySelector('#cartcount').innerHTML=result.data.cartcount
    
}
    async function Delete(id, btn){
        let Input = btn.parentNode.parentNode.remove()
        const result = await axios.delete("/api/cart/"+id)
        document.querySelector('#cartcount').innerHTML=result.data.cartcount
    }
 async function DeleteCart(){
    const result = await axios.delete("/api/cart")
    document.querySelector('#cartcount').innerHTML=result.data.cartcount
    let row = document.querySelectorAll("tr")
    for(i=1; i< row.length; i++){
        row[i].remove()

    }


    
 }
    
    



    

