/*GETS CURRENT USER'S EMAIL*/
firebase.auth().onAuthStateChanged(function (user) {

    if (user) {
        var user = firebase.auth().currentUser
        if (user != null) {
            // User is signed in.
            var email_id = user.email;
            document.getElementById("user_para").innerHTML = "You are currently logged in as: "
                + "<span class ='currentuser'>"
                + email_id
                + "</span>"
                + " Select an action below to continue."
        }
    } else if (!window.location.href.match('index.html') && user == null) {
        window.location.href = 'index.html'
    }

});

function login() {
    const email = email_field.value;
    const password = password_field.value;
    const auth = firebase.auth();

    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            console.log("Redirecting to home")
            window.location.href = "home.html"
        })
        .catch(function (error) {
            var errorCode = error.code;

            if (errorCode == 'auth/invalid-email') {
                console.log('Invalid Email')
                window.alert('Invalid Email')

            } else if (errorCode == 'auth/wrong-password') {
                console.log('Wrong Password')
                window.alert('Wrong Password')
            } else {
                console.log('Error: ' + errorCode);
                window.alert('Error: ' + errorCode);
            }
        });
}

function logout() {
    const auth = firebase.auth();
    auth.signOut().then(function () {
        console.log("Redirecting to login")
        window.location.href = "index.html"
    });
}
