import React from "react";
import { useEffect,useState } from "react";


const UserInfo =()=>{
     const [formData,setFormData]=useState({
        FullName:'',
        Email:'',
        Phone:'',
        Gender:'',
        Age:'',
        Number:'',
        Message:'',


     });

     const [erros,setErrors]=useState({})

     const changeInfo =(e)=>{
        const {name,value}=e.target;
        setFormData({...formData,[name]:value})
     }
     const submitInfo =(e)=>{
        e.preventDefault();
        const {FullName,Email,Phone,Gender,Age,Message}=formData;
        const errors={};
        if(FullName.length<3){
            errors.FullName='Please enter your full name '
            }
            if(!Email.includes('@')){
                errors.Email='Please enter a valid email '
                }
            if(Phone.length<10){
                errors.Phone='Please enter a valid phone number '
                }
            if(Gender.length<3){
                errors.Gender='Please enter your gender '
                }
            if(Age.length<1){
                errors.Age='Please enter your age '
                }
            if(Message.length<50){
                errors.Message='Please enter a valid message '
                }  setErrors(errors);
            if(Object.keys(errors).length===0){
            console.log(formData);
            }
        }


                            




  
    return(
        <form onSubmit={submitInfo}>
            <div>
                <label>
                    Full Name
                    <input type="text" name="FullName" value={formData.FullName} onChange={changeInfo
                    } />

                </label>

            </div>
            <div>
                <label>
                    Email
                    <input type="email" name="Email" value={formData.Email} onChange={changeInfo}/>                </label>
            </div>
            <div>
                <label>
                    Phone
                    <input type="text" name="Phone" value={formData.Phone} onChange={changeInfo}/>

                </label>
            </div>
            <div>
                <label>
                    Gender
                    <select name="Gender" value={formData.Gender} onChange={changeInfo}>
                        <option value="">Select Gender</option>
                        <option value='Male'>Male</option>
                        <option value="Female">Female</option>

                        
                    </select>

                </label>
            </div>
            <div>
                <label>
                    Date of Birth
                    <input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={
                        changeInfo
                        }/>
                </label>
            </div>
            <div>
                <label>
                    Message
                    <textarea name="Message" value={formData.Message} onChange={changeInfo}/>

                </label>
            </div>

        </form>
        



        
    );
}

export default UserInfo;