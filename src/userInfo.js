import React from "react";
import { useEffect,useState } from "react";


const UserInfo =()=>{


    return(



        <div className="container">
            <form action="/action_page.php">
                <div>
                    <div>
                        <input type="text" id="fName"
                         name="fullname" placeholder="please enter fullname"/>
                    </div>
                    <div>
                        <input type="number" id="num" 
                        name="Phone Number" placeholder="Enter mobile number"/>
                    </div>
                    <div>
                        <input type="text" id="email" 
                        name="email address" placeholder="enter valid email "/>
                    </div>
                    <div>
                    <div class="col-25">
        <label for="subject">favorite meal</label>
      </div>
      <div class="col-75">
        <textarea id="subject" name="subject" placeholder="what are your favorite meals" style="height:200px"></textarea>
      </div>
    </div>
    <div class="row">
      <input type="submit" value="Submit"/>
    </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UserInfo;