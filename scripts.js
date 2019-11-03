/* Binding to view fields */
const insert_team_name = document.getElementById('name')
const find_team_members = document.getElementById('email_textbox')
const add_member_button = document.getElementById('add_member_button')
var memberIds = [];

/* Get Base Requset */
function getAjax(url, success) {
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status == 200) success(xhr.responseText);
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
   
    return xhr;
}

/*Post Base Request */
function postAjax(url, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
        function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
    ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status == 200) { success(xhr.responseText); }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(params);
    console.log("create done")
    return xhr;
}

/* Funtion used onClick "create team" */
function createTeam() {
    if(document.getElementById('name').value == "" && tab.length == 0){
        document.getElementById('isa_error').style.display = "flex";
        const error_message = document.getElementById('error_message');
        error_message.innerHTML = "Give the team a name and add members to the team";
    }
    else if(tab.length == 0 || tab == null){
        document.getElementById('isa_error').style.display = "flex";
        const error_message = document.getElementById('error_message');
        error_message.innerHTML = "Please add members to procced to create a team";
    }
    else if(document.getElementById('name').value == ""){
        document.getElementById('isa_error').style.display = "flex";
        const error_message = document.getElementById('error_message');
        error_message.innerHTML = "Please give the team a name";
    }
    else if(tab.length > 0 && document.getElementById('name').value == ""){
        document.getElementById('isa_error').style.display = "flex";
        const error_message = document.getElementById('error_message');
        error_message.innerHTML = "Please give the team a name";
    }
    else if(document.getElementById('name').value != ""){
        getAjax('https://bmrestlibtest20190508033724.azurewebsites.net/Service1.svc/team/' + insert_team_name.value, function (data) {
            idCheck = JSON.parse(data);
            console.log("kode:" + idCheck);

                if(idCheck != 0){
                    document.getElementById('isa_error').style.display = "flex";
                    const error_message = document.getElementById('error_message');
                    error_message.innerHTML = "Team name is allready taken";
                }
                else{
                    var teamToSend = {
                        teamName: document.getElementById('name').value
                    }
                    returnedTeamId = JSON.stringify(teamToSend);
                    console.log(`${returnedTeamId}`);
            
                    postAjax('https://bmrestlibtest20190508033724.azurewebsites.net/Service1.svc/team',
                        returnedTeamId, function (data) 
                        {
            
                            for (i = 0; i < memberIds.length; i++) {
                                var participateMemberInTeam = {
                                    teamId: data,
                                    memberId: memberIds[i]
                                }
                
                                const convertParticipateMemberInTeamToJson = JSON.stringify(participateMemberInTeam)
                                console.log(`${convertParticipateMemberInTeamToJson}`)
                                postAjax('https://bmrestlibtest20190508033724.azurewebsites.net/Service1.svc/membertoteam',
                                    convertParticipateMemberInTeamToJson, function (data) {})

                            }
                            if( 
                                document.getElementById('isa_error').style.display == "flex"){
                                document.getElementById('isa_error').style.display = "none";
                            }
                            else{
                                document.getElementById('isa_success').style.display = "flex";
                                const success_message = document.getElementById('success_message');
                                success_message.innerHTML = "Team has been created";
                            }
                        }
                    )
                }
            }
        )
    }
}


// Method should be called every time a add method is executed. 
var tab = [], index;
var items = document.querySelectorAll("#member_list li");

function refreshArray(){
    tab.length = 0; // resest the counter for the for-loop
    var items = document.querySelectorAll("#member_list li");  //gets all the li elements there's present within the list
    
    for(var i = 0; i < items.length; i++){   //put elements into the list. 
        tab.push(items[i].innerHTML);
    }
}
var memberId; 
/* Add new member function */
function addMember() {
    getAjax('https://bmrestlibtest20190508033724.azurewebsites.net/Service1.svc/member/' + find_team_members.value, function (data) {
        memberId = JSON.parse(data);

        if( document.getElementById('isa_error').style.display == "flex");
        document.getElementById('isa_error').style.display = "none"; //clear an eror from "please add a member"

        //Is theese conditions good enough?
        if (!memberId == 0 || !memberId == null) {

            //checks if member is allready added to the list
            if (!memberIds.find(element => element === memberId)) {

                var listNode = document.getElementById("member_list"); 
                var liNode = document.createElement("li");
                liNode.setAttribute('id', find_team_members.value);
                liNode.appendChild(document.createTextNode(find_team_members.value));
                listNode.appendChild(liNode);

                refreshArray();
                console.log(memberId);

                liNode.onclick = function(){
                    document.getElementById("delete").style.display = "block";
                    index = tab.indexOf(liNode.innerHTML);
                    console.log(liNode.innerHTML + " INDEX = " + index)
                    find_team_members.value = liNode.innerHTML; //set selected value to the emailfield. 
                };

                /* Clear textfield after member is add*/
                document.getElementById("email_textbox").value = "";

                //The last thing to do, is to save the id in a list for later use. 
                memberIds.push(memberId); 

            } else {
                //TODO some kind of error
                document.getElementById('isa_error').style.display = "flex";
                const error_message = document.getElementById('error_message');
                error_message.innerHTML = "Member has already been added";
            }
        }
    });

}



function removeItem(){
    var items = document.querySelectorAll("#member_list li"); 

    if(items.length > 0){
    items[index].parentNode.removeChild(items[index]);
    email_textbox.value = ""; //Clear field after a delete comand
    document.getElementById("delete").style.display = "none";
    

    // delete member in memberIDs
    memberIds[memberId].parentNode.removeChild(memberIds[memberId]);
    memberIds.remove('memberId');
    console.log(memberIds);

    alert("You have sucessfully deleted the selected member")
    }
    else{console.log("Theres no elements in the list: " + items.length)}
}






function email_validation() {
    const error_message_output = document.getElementById('error_message_text');

    error_message_output.value = "agsgasgas";

    /* Clear textfield after member is add*/
    document.getElementById("email_textbox").value = "";
}

function back(){
    window.location.href="home.html"
}